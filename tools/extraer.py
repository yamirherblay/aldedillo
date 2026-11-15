#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fase 0 — Extractor del Manual (GOC-2023-O119) hacia los datos de Al Dedillo.

Fuente: Documentos/goc-2023-o119.pdf → texto con: pdftotext -layout
Salida: al-dedillo/data/*.js (patrón data-as-JS, ver CONSTITUCION.md)

Ejecutar:  python3 tools/extraer.py
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
TXT = RAIZ.parent / "goc-2023-o119.txt"          # texto de trabajo (pdftotext)
DATA = RAIZ / "data"

FUENTE = "GOC-2023-980-O119"
RESOLUCION = "Resolución 364/2023, Contraloría General de la República"
VERSION = "2023"

if not TXT.exists():
    TXT = Path("/tmp/opencode/goc-2023-o119.txt")

lineas = TXT.read_text(encoding="utf-8", errors="replace").splitlines()

# ------------------------------------------------------------------ limpieza
SOFT_HYPHEN = "\u00ad"
RE_FOOTER_A = re.compile(r"^\s*(\d{3,4})\s+GACETA\s+OFICIAL\s+(?:1 de diciembre de 2023)?\s*$")
RE_FOOTER_B = re.compile(r"^\s*1 de diciembre de 2023\s+GACETA\s+OFICIAL\s+(\d{3,4})\s*$")
RE_FOOTER_C = re.compile(r"^\s*(\d{3,4})\s+GACETA\s+OFICIAL\s+1 de diciembre de 2023\s*$")
RE_ISSN = re.compile(r"^\s*ISSN\s+1682-7511\s*$")

limpias = []          # líneas sin pies de página ni ISSN
paginas = []          # página de la Gaceta asociada a cada línea limpia
pagina = None
for ln in lineas:
    m = RE_FOOTER_A.match(ln) or RE_FOOTER_B.match(ln) or RE_FOOTER_C.match(ln)
    if m:
        pagina = int(m.group(1))
        continue
    if RE_ISSN.match(ln):
        continue
    ln = ln.replace(SOFT_HYPHEN, "")
    limpias.append(ln)
    paginas.append(pagina)


def unir_hyphenes(texto_lineas):
    """Vuelve a unir palabras partidas por guion al final de línea (tipografía del PDF)."""
    out = []
    for ln in texto_lineas:
        if (out and out[-1].endswith("-") and ln and (ln[0].islower() or ln[0] in "áéíóúüñ")):
            out[-1] = out[-1] + ln.lstrip()
        else:
            out.append(ln)
    return out


def limpiar_texto(texto_lineas):
    """Reordena hyphenes, colapsa espacios y recorta líneas vacías redundantes."""
    texto_lineas = unir_hyphenes(texto_lineas)
    res = []
    for ln in texto_lineas:
        ln = re.sub(r"[ \t]{2,}", " ", ln).strip()
        res.append(ln)
    # colapsar saltos en blanco consecutivos
    final = []
    for ln in res:
        if ln == "" and final and final[-1] == "":
            continue
        final.append(ln)
    while final and final[0] == "":
        final.pop(0)
    while final and final[-1] == "":
        final.pop()
    return "\n".join(final)


# ------------------------------------------------- pasada A: mapa código→nombre
RE_CODIGO = re.compile(r"^\s*(H-\d{3}-\d{4}(?:-\d{2})?|H-\d{3}-G\d{2}(?:-\d{2})?|H-002-APC\d{2}|P-[0-9A-Z]+(?:-[0-9A-Z]+)*)\s{2,}(\S.*)$")
RE_CODIGO_SOLO = re.compile(r"^\s*(H-\d{3}-\d{4}-\d{2}|H-\d{3}-G\d{2})\s*$")

def parece_fragmento(ln):
    """Una línea que es fragmento de nombre dentro de una tabla del índice."""
    s = ln.strip()
    if not s or RE_CODIGO.match(ln) or RE_CODIGO_SOLO.match(ln):
        return False
    prohibido = ("Herramientas", "Tareas", "Manual de procedimientos", "Código",
                 "Procedimiento", "Fase", "GACETA")
    return not any(s.startswith(p) for p in prohibido)

mapa_nombres = {}
for i, ln in enumerate(limpias):
    m = RE_CODIGO.match(ln)
    if m:
        cod, nom = m.group(1), m.group(2).strip()
        nom = nom.rstrip(".").strip()
        if cod not in mapa_nombres:
            mapa_nombres[cod] = nom
    # celdas donde el nombre se partió: el código va solo y el nombre rodea la celda
    ms = RE_CODIGO_SOLO.match(ln)
    if ms:
        cod = ms.group(1)
        if cod not in mapa_nombres:
            prev = next((limpias[k] for k in range(i - 1, max(i - 3, -1), -1) if limpias[k].strip()), "")
            nxt = next((limpias[k] for k in range(i + 1, min(i + 3, len(limpias))) if limpias[k].strip()), "")
            if parece_fragmento(prev) and parece_fragmento(nxt):
                mapa_nombres[cod] = f"{prev.strip()} {nxt.strip()}"

# ------------------------------------------------- pasada B: secciones del Tomo I
RE_ENCABEZADO = re.compile(r"^\s*(H-\d{3}-\d{4}(?:-\d{2})?|H-\d{3}-G\d{2}(?:-\d{2})?|H-002-APC(?:\d{2})?)\s*$")
RE_TOMO2 = re.compile(r"TOMO\s+II\.?\s+PLANTILLAS", re.IGNORECASE)

secciones = []          # Tomo I
tomos2 = []             # Tomo II
indice_tomo2 = None
bloque_actual = None    # dict en construcción
meta_zone = False       # estamos dentro del bloque descriptivo del encabezado
en_tomo2 = False


RE_META_LINE = re.compile(r"^(Manual de procedimientos|de prevención y control|Código\s*Nombre|Código$|Nombre$|Procedimiento\b|Fase\b|Tarea\b|Versión \d{4}$|Tomo I$)")
RE_FASE_CON_NOMBRE = re.compile(r"^Fase\s+(\S+)\s+(\S.*)$")
RE_FASE_SOLO = re.compile(r"^Fase\s+(\S+)\s*$")
RE_TAREA_CON_NOMBRE = re.compile(r"^Tarea\s+\S+\s+(\S.*)$")
RE_APERTURA = re.compile(r"^(Preámbulo\b|Objetivo de la\b|Alcance\b|Ámbito de aplicación\b|Documentos para las acciones\b)")


def quitar_metadata(cuerpo):
    """Quita el bloque descriptivo inicial (Código/Nombre/Procedimiento/Fase/Tarea),
    incluso cuando los nombres están partidos en líneas intercaladas, y devuelve
    (cuerpo_limpio, nombre_fase, nombre_tarea)."""
    nombre_fase = nombre_tarea = ""

    def limpiar_nombre(s):
        return re.sub(r"\s*(Versión \d{4}|Tomo I)$", "", s).strip()

    # el bloque de metadata termina en el primer encabezado de contenido real
    j = next((k for k, ln in enumerate(cuerpo) if RE_APERTURA.match(ln.strip())), None)
    if j is None:
        j = next((k for k, ln in enumerate(cuerpo) if not RE_META_LINE.match(ln.strip())), len(cuerpo))

    bloque = [ln.strip() for ln in cuerpo[:j] if ln.strip()]
    for i, s in enumerate(bloque):
        mf = RE_FASE_CON_NOMBRE.match(s)
        ms = RE_FASE_SOLO.match(s)
        if mf and not nombre_fase:
            nombre_fase = limpiar_nombre(mf.group(2))
        elif ms and not nombre_fase:
            prev = bloque[i - 1] if i else ""
            nxt = bloque[i + 1] if i + 1 < len(bloque) else ""
            if prev and not RE_META_LINE.match(prev):
                nombre_fase = f"{prev} {nxt}" if nxt and not RE_META_LINE.match(nxt) else prev
        mt = re.match(r"^Tarea\s+(\S+)\s*(.*)$", s)
        if mt and not nombre_tarea:
            cod_tarea, resto = mt.group(1), mt.group(2).strip()
            if cod_tarea in ("Capítulo", "Capitulo"):
                partes = resto.split(None, 1)
                nombre_tarea = limpiar_nombre(partes[1]) if len(partes) > 1 else ""
            else:
                nombre_tarea = limpiar_nombre(resto)
    return cuerpo[j:], nombre_fase, nombre_tarea


def cerrar_actual():
    global bloque_actual
    if bloque_actual is not None:
        cuerpo, nombre_fase, nombre_tarea = quitar_metadata(bloque_actual["cuerpo"])
        bloque_actual.pop("cuerpo")
        if nombre_fase:
            bloque_actual["faseNombre"] = nombre_fase
        if nombre_tarea:
            bloque_actual["tareaNombre"] = nombre_tarea
        texto = limpiar_texto(cuerpo)
        if texto:
            bloque_actual["texto"] = texto
        secciones.append(bloque_actual)
        bloque_actual = None


for i, ln in enumerate(limpias):
    # ---- arranque del Tomo II (solo el título real, en mayúsculas; el índice de la
    # introducción dice "Tomo II. Plantillas." y NO debe activar esto)
    if not en_tomo2 and re.search(r"TOMO\s+II\.?\s+PLANTILLAS", ln) and len(ln.strip()) < 60:
        cerrar_actual()
        en_tomo2 = True
        continue

    if en_tomo2:
        m = re.match(r"^\s*(P-[0-9A-Z]+(?:-[0-9A-Z]+)*)\s+(\S.*)$", ln)
        if m:
            # el encabezado de plantilla = código + nombre (el nombre puede partirse
            # en líneas que comienzan en minúscula, antes del título en mayúsculas)
            nombre_pendiente = [m.group(2).strip()]
            tomos2.append({"codigo": m.group(1), "nombre": "",
                           "pagina": paginas[i], "cuerpo": [], "nombre_pendiente": nombre_pendiente})
            continue
        if tomos2:
            p = tomos2[-1]
            pend = p.get("nombre_pendiente")
            s = ln.strip()
            if pend is not None:
                if s and s[0].islower() and len(s) < 90:
                    pend.append(s)
                    continue
                p["nombre"] = " ".join(pend)
                p.pop("nombre_pendiente")
            p["cuerpo"].append(ln)
        continue

    # ---- encabezados del Tomo I (bloque "Manual de procedimientos… / código / Código Nombre / Procedimiento…")
    m = RE_ENCABEZADO.match(ln)
    if m:
        codigo = m.group(1)
        siguientes = limpias[i + 1:i + 7]
        es_encabezado = any("Procedimiento" in s for s in siguientes)
        if es_encabezado:
            cerrar_actual()
            bloque_actual = {
                "codigo": codigo,
                "nombre": mapa_nombres.get(codigo, ""),
                "pagina": paginas[i],
                "cuerpo": [],
            }
            continue
    if bloque_actual is not None:
        bloque_actual["cuerpo"].append(ln)

cerrar_actual()

# ---------------------------------------------------- prólogo (resolución y anexo-introducción)
# líneas 0..primera sección → prólogo
primera = None
for i, ln in enumerate(limpias):
    if RE_ENCABEZADO.match(ln) and i + 7 < len(limpias) and any("Procedimiento" in s for s in limpias[i + 1:i + 7]):
        primera = i
        break
prologo = limpiar_texto(limpias[:primera]) if primera else ""
prologo = re.sub(r"\s*\n\s*\n", "\n\n", prologo).strip()

# ---------------------------------------------------------- armar data/manual.js
def limpiar_fragmento(s):
    """Quita marcadores de columna (Versión 2023, Tomo I) y reúne palabras partidas."""
    s = re.sub(r"\s*(Versión\s*\d{4}|Tomo\s+I{1,3})\s*", " ", s)
    s = re.sub(r"\s{2,}", " ", s).strip()
    s = re.sub(r"([a-záéíóúüñ])- ([a-záéíóúüñ])", r"\1\2", s)
    return s


def tipo_de(codigo):
    if re.match(r"H-\d{3}-\d{4}-\d{2}$", codigo):
        return "tarea"
    if re.match(r"H-\d{3}-\d{4}$", codigo):
        return "fase"
    if codigo.startswith("H-001-G"):
        return "transversal"
    if codigo == "H-002-APC":
        return "preambulo"
    if codigo.startswith("H-002-APC"):
        return "accion"
    return "otro"

manual = {
    "meta": {
        "producto": "Al Dedillo",
        "titulo": "Manual de procedimientos de las acciones de prevención y control",
        "fuente": FUENTE,
        "resolucion": RESOLUCION,
        "version": VERSION,
        "vigente": True,
    },
    "prologo": prologo,
    "secciones": [],
}
for s in secciones:
    tipo = tipo_de(s["codigo"])
    if tipo in ("fase", "preambulo"):
        nombre = s.get("faseNombre") or s.get("tareaNombre") or s.get("nombre") or ""
    else:
        nombre = s.get("nombre") or s.get("tareaNombre") or s.get("faseNombre") or ""
    manual["secciones"].append({
        "codigo": s["codigo"],
        "tipo": tipo,
        "nombre": limpiar_fragmento(nombre),
        "faseNombre": limpiar_fragmento(s.get("faseNombre", "")),
        "pagina": s.get("pagina"),
        "texto": s.get("texto", ""),
    })

# ---------------------------------------------------------------- data/plantillas.js
for p in tomos2:
    if not p["nombre"] and p.get("nombre_pendiente") is not None:
        p["nombre"] = " ".join(p["nombre_pendiente"])
plantillas = []
for p in tomos2:
    cuerpo = limpiar_texto(p["cuerpo"])
    plantillas.append({
        "codigo": p["codigo"],
        "nombre": p["nombre"],
        "pagina": p["pagina"],
        "texto": cuerpo,
    })

# -------------------------------------------------------------------- escribir JS
def escribir_js(nombre, variable, datos, comentario):
    DATA.mkdir(exist_ok=True)
    contenido = (
        f"// {comentario}\n"
        f"// Generado por tools/extraer.py — NO editar a mano (ver CONSTITUCION.md).\n"
        f"window.{variable} = {json.dumps(datos, ensure_ascii=False, indent=1)};\n"
    )
    (DATA / nombre).write_text(contenido, encoding="utf-8")
    kb = (DATA / nombre).stat().st_size / 1024
    print(f"  data/{nombre:<16} {len(datos if isinstance(datos, list) else datos.get('secciones', [])):>4} registros  {kb:8.1f} KB")


escribir_js("manual.js", "DEDILLO_MANUAL", manual,
            "Tomo I del Manual — procedimientos, fases, transversales y otras acciones.")
escribir_js("plantillas.js", "DEDILLO_PLANTILLAS", plantillas,
            "Tomo II del Manual — plantillas de documentos por código.")

# ------------------------------------------------------------ data/constantes.js
constantes = {
    "meta": {"fuente": FUENTE, "version": VERSION},
    "plazos": [
        {"dias": 5, "unidad": "diasHabiles", "titulo": "Criterios ante la consulta de medidas disciplinarias",
         "detalle": "El auditor emite criterios sobre la consulta de las medidas disciplinarias dentro de los cinco (5) días hábiles subsiguientes a la presentación de estas.",
         "codigo": "H-001-0004"},
        {"dias": 10, "unidad": "diasHabiles", "titulo": "Tramitar el recordatorio del vencimiento",
         "detalle": "El responsable puede tramitar el recordatorio dentro de los diez días hábiles anteriores al vencimiento de la consulta de medidas disciplinarias.",
         "codigo": "H-001-0004"},
        {"dias": 20, "unidad": "diasHabiles", "titulo": "Presentar el recurso de apelación",
         "detalle": "El recurso de apelación se presenta dentro de los veinte (20) días hábiles siguientes a la notificación del informe.",
         "codigo": "H-001-0004"},
        {"dias": 30, "unidad": "diasHabiles", "titulo": "Propuesta del Plan de medidas",
         "detalle": "El sujeto auditado dispone de treinta (30) días hábiles para la presentación de la propuesta del Plan de medidas.",
         "codigo": "H-001-0004"},
        {"dias": 5, "unidad": "anios", "titulo": "Custodia de la información",
         "detalle": "Los ejecutantes archivan y custodian la información de la acción por cinco (5) años.",
         "codigo": "H-001-G01"},
    ],
    "examen": {
        "preguntasPorExamen": 20,
        "puntosPorPregunta": 5,
        "aprobado": 70,
    },
    "errorTolerable": {"porcentajes": [50, 75],
                       "detalle": "Se asume la aplicación de un error tolerable del 50 o 75 por ciento de la materialidad predeterminada.",
                       "codigo": "H-001-0001-07"},
}
escribir_js("constantes.js", "DEDILLO_CONSTANTES", constantes,
            "Constantes del dominio: plazos legales, reglas del examen. La lógica no hardcodea cifras.")

# ---------------------------------------------------------------- data/fuentes.js
fuentes = {
    "meta": {"fuente": FUENTE, "version": VERSION},
    "principal": {
        "titulo": "Resolución 364/2023 «Por la que se aprueba el Manual de procedimientos de las acciones de prevención y control»",
        "organismo": "Contraloría General de la República",
        "publicacion": "Gaceta Oficial de la República de Cuba No. 119 Ordinaria, 1 de diciembre de 2023",
        "identificador": FUENTE,
        "descarga": "https://www.gacetaoficial.gob.cu/",
        "notas": "Deroga las resoluciones 306/2012, 32/2016 y 33/2016.",
    },
    "disclaimer": "Recopilación de estudio sin valor oficial. Toda información debe verificarse y contrastarse con la legislación vigente publicada en la Gaceta Oficial de la República de Cuba.",
}
escribir_js("fuentes.js", "DEDILLO_FUENTES", fuentes,
            "Fuentes y aviso legal del producto.")

print("\nListo. Siguiente: preguntas.js y curso.js (autoría) + verificación de fidelidad.")
