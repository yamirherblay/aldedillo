# ============================================================
# tools/estructurar_todo.py — construye data/formularios.js para
# TODOS los códigos del Tomo II.
#
#   · separa la guía del formulario
#   · estructura la guía (canónica o genérica) en bloques
#   · estructura el formulario con reglas (campos, tablas simples)
#   · usa tools/formas_especificas.py para los modelos con tablas
#     o geometría especial
#
# Ejecutar:  python3 tools/estructurar_todo.py [--diag]
# ============================================================
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from formas_especificas import FORMAS  # noqa: E402
from nombres import nombre_archivo  # noqa: E402
from texto import (  # noqa: E402
    FIN_ORACION, desguionar, es_titulo, limpiar_notas, mayusculas,
    normalizar, reflujo, similitud, unir_lineas,
)

RAIZ = Path(__file__).resolve().parent.parent
PLANTILLAS = RAIZ / "data" / "plantillas.js"
SALIDA = RAIZ / "data" / "formularios.js"

SUBTITULOS = {"Propósito", "Emisión y archivo", "Anotaciones", "Objetivo", "Alcance"}

CAMPOS_CONOCIDOS = {
    "cargo", "cargo:", "entidad", "firma", "fecha", "año", "asunto",
    "nombre s y apellidos", "nombres y apellidos", "nombre y apellidos",
    "nombre s apellidos", "nombre s y apellidos del auditor",
    "lugar y fecha", "lugar fecha y año", "pt", "p t", "total",
    "provincia", "municipio", "direccion", "subordinacion",
    "no", "no.", "nro", "observaciones", "car go",
}

COLUMNAS = [
    "Nombres y apellidos", "Nombre(s) y apellidos", "Nombre y apellidos",
    "Nombre(s), apellidos y cargo", "Cargo", "Firma", "Entidad", "Fecha",
    "Hora inicio", "Denominación del área y dirección", "Conforme",
    "Sí", "No", "Total", "Cantidad", "P/T", "PT", "Legajo", "Provincia",
    "Municipio", "Tipo de formato", "Descripción", "Observaciones",
]

INSTRUCCIONES = (
    "detalle", "desglose", "objetivo", "asuntos", "observaciones",
    "recomendaciones", "contenido", "resultados", "propuestas", "relato",
    "consideraciones", "declaro", "requiere", "descripcion", "fundamentacion",
    "alcance", "criterios", "directivas", "personal", "datos", "sistema",
    "tipo", "forma", "motivos", "hechos", "importe", "analisis", "documentos",
    "temas", "acuerdos", "medidas", "plan", "actividades", "funciones",
)


# ------------------------------------------------------------
# separación guía / formulario
# ------------------------------------------------------------
def _es_titulo_nombre(linea, nombre):
    return (
        len(linea) >= 8
        and mayusculas(linea) >= 0.75
        and similitud(linea, nombre) >= 0.45
    )


def _continuacion(linea):
    if not linea or FIN_ORACION.search(linea) or linea.endswith("-"):
        return False
    if re.match(r"^\(\d+\)", linea):
        return False
    if re.match(r"^(Observaciones|Observación|De ser necesario|Nota|Fuente)\b", linea):
        return False
    if len(linea) > 110:
        return False
    return True


def es_inicio(linea, nombre):
    if _es_titulo_nombre(linea, nombre):
        return True
    if re.search(r"\(\d+\)\s*$", linea) and not linea.startswith("("):
        return True
    if re.search(r"_{3,}", linea):
        return True
    if re.search(r"\(\s*\)", linea):
        return True
    if normalizar(limpiar_notas(linea)) in CAMPOS_CONOCIDOS:
        return True
    return False


def partir(texto, nombre, desde=None):
    lineas = [l.strip() for l in texto.split("\n") if l.strip()]
    if desde:
        for i, l in enumerate(lineas):
            if normalizar(l).startswith(normalizar(desde)):
                return "\n".join(lineas[:i]), "\n".join(lineas[i:])
    ult = max(
        (i for i, l in enumerate(lineas) if re.match(r"^\(\d+\):", l)),
        default=-1,
    )
    inicio = None
    for i in range(ult + 1, len(lineas)):
        if es_inicio(lineas[i], nombre):
            inicio = i
            break
    if inicio is None:
        return "\n".join(lineas), None
    while inicio > 0 and _continuacion(lineas[inicio - 1]):
        if es_inicio(lineas[inicio - 1], nombre):
            break
        inicio -= 1
    for j in range(inicio - 1, max(-1, inicio - 4), -1):
        if _es_titulo_nombre(lineas[j], nombre):
            inicio = j
            break
    return "\n".join(lineas[:inicio]), "\n".join(lineas[inicio:])


# ------------------------------------------------------------
# guía
# ------------------------------------------------------------
def _guia_canonica(lineas, nombre):
    i = 0
    titulo_lineas = []
    while i < len(lineas) and lineas[i] not in SUBTITULOS:
        titulo_lineas.append(lineas[i])
        i += 1
    titulo = unir_lineas(titulo_lineas) if titulo_lineas else ""
    if not titulo:
        titulo = "GUÍA PARA ELABORAR " + nombre.upper()
    bloques = []
    pendiente = []

    def cerrar():
        nonlocal pendiente
        if pendiente:
            for p in reflujo("\n".join(pendiente)):
                bloques.append(["parrafo", p])
            pendiente = []

    while i < len(lineas):
        l = lineas[i]
        if l in SUBTITULOS:
            cerrar()
            bloques.append(["subtitulo", l])
            i += 1
            continue
        m = re.match(r"^\((\d+)\)", l)
        if m:
            cerrar()
            num = m.group(1)
            cuerpo = [l]
            i += 1
            while i < len(lineas) and not re.match(r"^\(\d+\)", lineas[i]) \
                    and lineas[i] not in SUBTITULOS:
                if re.match(r"^(Observaciones|Observación|De ser necesario|Nota|Fuente)\b", lineas[i]):
                    break
                cuerpo.append(lineas[i])
                i += 1
            partes, buf = [], [cuerpo[0]]
            for ln in cuerpo[1:]:
                if re.match(r"^[a-z]\)", ln):
                    partes.append(buf)
                    buf = [ln]
                else:
                    buf.append(ln)
            partes.append(buf)
            principal = re.sub(r"^\(\d+\)\s*:?\s*", "", unir_lineas(partes[0]))
            bloques.append(["anotacion", num, principal])
            for parte in partes[1:]:
                bloques.append(["inciso", unir_lineas(parte)])
            continue
        pendiente.append(l)
        i += 1
    cerrar()
    return {"titulo": titulo, "bloques": bloques}


CONOCIDOS = {
    "Generalidades", "Objetivo", "Objetivos", "Alcance", "Propósito",
    "Anotaciones", "Emisión y archivo", "Procedimiento", "Definiciones",
    "Antecedentes", "Fundamento", "Metodología", "Contenido", "Conclusiones",
}


def _guia_generica(lineas, nombre):
    titulo = []
    i = 0
    while i < len(lineas) and i < 3:
        l = lineas[i]
        if mayusculas(l) >= 0.7:
            titulo.append(l)
            i += 1
            continue
        if i == 0 and es_titulo(l, 90):
            titulo.append(l)
            i += 1
        break
    if not titulo:
        titulo = [nombre.upper()]
        i = 0
    bloques = []
    actual = []
    previo = ""

    def cerrar():
        nonlocal actual
        if actual:
            bloques.append(["parrafo", unir_lineas(actual)])
            actual = []

    while i < len(lineas):
        l = lineas[i]
        cierra_antes = (not previo) or bool(FIN_ORACION.search(previo)) \
            or mayusculas(previo) >= 0.7 or previo in CONOCIDOS
        es_encabezado = (
            len(l) <= 55
            and len(l) >= 3
            and not FIN_ORACION.search(l)
            and not l.endswith("-")
            and not re.match(r"^[•·\-a-z0-9]", l)
            and (mayusculas(l) >= 0.6 or l in CONOCIDOS
                 or bool(re.match(r"^\d+(\.\d+)*\.?\s+[A-ZÁÉÍÓÚÑ]", l)))
            and cierra_antes
        )
        if es_encabezado:
            cerrar()
            bloques.append(["subtitulo", l])
            previo = l
            i += 1
            continue
        if re.match(r"^([•·\-]|[a-z]\)|\d+\.)\s", l):
            cerrar()
            grupo = [l]
            i += 1
            while i < len(lineas) and not FIN_ORACION.search(grupo[-1]) \
                    and not es_titulo(lineas[i], 50):
                grupo.append(lineas[i])
                i += 1
            bloques.append(["inciso", unir_lineas(grupo)])
            previo = grupo[-1]
            continue
        actual.append(l)
        previo = l
        i += 1
        if FIN_ORACION.search(l):
            cerrar()
    cerrar()
    return {"titulo": unir_lineas(titulo) if len(titulo) > 1 else titulo[0], "bloques": bloques}


def parsear_guia(texto, nombre):
    lineas = [l.strip() for l in texto.split("\n") if l.strip()]
    if not lineas:
        return None
    canonica = ("Propósito" in lineas) and ("Anotaciones" in lineas)
    if canonica:
        return _guia_canonica(lineas, nombre)
    return _guia_generica(lineas, nombre)


# ------------------------------------------------------------
# formulario genérico
# ------------------------------------------------------------
def _segmentos(linea):
    partes = re.split(r"(\(\d+\)|_{3,})", linea)
    segs = []
    for parte in partes:
        if not parte:
            continue
        if re.fullmatch(r"\(\d+\)", parte):
            segs.append(["n", parte[1:-1]])
        elif re.fullmatch(r"_{3,}", parte):
            segs.append(["b", round(max(1.5, min(6.0, len(parte) / 4)), 1)])
        else:
            t = " ".join(parte.split())
            if t:
                segs.append(["t", t])
    if segs and segs[-1][0] == "b":
        segs[-1] = ["f", None]
    if not any(s[0] in ("b", "f") for s in segs) and any(s[0] == "n" for s in segs):
        nuevos = []
        for k, s in enumerate(segs):
            nuevos.append(s)
            if s[0] == "n":
                siguiente = segs[k + 1] if k + 1 < len(segs) else None
                if k == len(segs) - 1:
                    nuevos.append(["f", None])
                elif siguiente and siguiente[0] == "t" and len(siguiente[1]) <= 12:
                    nuevos.append(["b", 2.6])
                else:
                    nuevos.append(["b", 3.5])
        segs = nuevos
    return segs


def _instruccion(etiqueta):
    n = normalizar(etiqueta)
    if not etiqueta.strip().endswith(":"):
        return False
    return len(etiqueta) > 55 or any(n.startswith(p) for p in INSTRUCCIONES)


def _anchos_columnas(cols):
    pesos = [max(3.0, len(c)) for c in cols]
    total = sum(pesos)
    anchos = [round(16.0 * p / total, 1) for p in pesos]
    anchos = [max(2.4, a) for a in anchos]
    # ajustar la última para que sume el ancho útil
    diferencia = round(16.0 - sum(anchos[:-1]), 1)
    anchos[-1] = max(2.4, diferencia)
    return anchos


def detectar_columnas(linea):
    if re.search(r"\(\d+\)|_{3,}", linea):
        return None
    low = linea.lower()
    hallados = []
    pos = 0
    while True:
        mejor = None
        for col in COLUMNAS:
            j = low.find(col.lower(), pos)
            if j != -1 and (mejor is None or j < mejor[0]):
                mejor = (j, col)
        if not mejor:
            break
        if hallados and low[hallados[-1][2]:mejor[0]].strip():
            return None
        hallados.append((mejor[0], mejor[1], mejor[0] + len(mejor[1])))
        pos = mejor[0] + len(mejor[1])
    if len(hallados) < 2:
        return None
    if low[hallados[-1][2]:].strip():
        return None
    return [h[1] for h in hallados]


def _es_subtitulo_form(linea):
    return (
        len(linea) >= 5
        and mayusculas(linea) >= 0.8
        and not linea.endswith(".")
        and not re.search(r"_{3,}", linea)
    )


def _parrafos(buffer):
    salida, actual = [], []
    for linea in buffer:
        actual.append(linea)
        if FIN_ORACION.search(linea):
            salida.append(unir_lineas(actual))
            actual = []
    if actual:
        salida.append(unir_lineas(actual))
    return salida


def leer_campo(lineas, i, buffer):
    l = lineas[i]
    tiene_nota = bool(re.search(r"\(\d+\)", l))
    tiene_rayas = bool(re.search(r"_{3,}", l))
    conocido = normalizar(limpiar_notas(l)) in CAMPOS_CONOCIDOS
    if not (tiene_nota or tiene_rayas or conocido):
        return None

    previa = None
    if buffer and not FIN_ORACION.search(buffer[-1]) and len(buffer[-1]) < 100 \
            and not re.match(r"^\(\d+\)", buffer[-1]) \
            and not buffer[-1].rstrip().endswith((",", ";")):
        previa = buffer.pop()
        l = unir_lineas([previa, l])
    l = desguionar(l)

    extra = 0
    j = i + 1
    while j < len(lineas) and re.fullmatch(r"_{3,}", lineas[j]):
        extra += 1
        j += 1

    segs = _segmentos(l)
    notas = [s for s in segs if s[0] == "n"]
    textos = [s[1] for s in segs if s[0] == "t"]
    total_texto = sum(len(t) for t in textos)

    if len(notas) <= 1 and len(textos) == 1 and total_texto <= 120:
        etiqueta = textos[0].strip(" :-")
        nota = notas[0][1] if notas else None
        n = 1 + extra
        if n == 1 and _instruccion(textos[0]):
            n = 3
        return {"bloques": [["campo", etiqueta, nota, n]], "fin": j}

    if total_texto > 120 and notas:
        return {"bloques": [["parrafo_campos", segs]], "fin": j}

    if any(s[0] in ("b", "f") for s in segs) and (len(notas) >= 1 or len(textos) >= 2):
        return {"bloques": [["campos", segs]], "fin": j}

    return None


def parsear_formulario(texto, nombre):
    lineas = [
        l.strip() for l in texto.split("\n")
        if l.strip() and not re.match(r"^(GACETA OFICIAL|\d+ de \w+ de \d{4})$", l.strip())
    ]
    if not lineas:
        return None

    titulo = nombre.upper()
    for i, l in enumerate(lineas):
        if _es_titulo_nombre(l, nombre):
            titulo = limpiar_notas(l)
            del lineas[i]
            while i < len(lineas) and mayusculas(lineas[i]) >= 0.8 \
                    and len(lineas[i]) < 70 and not re.search(r"\(\d+\)\s*$", lineas[i]):
                titulo = unir_lineas([titulo, lineas[i]])
                del lineas[i]
            break

    bloques = []
    buffer = []

    def cerrar():
        nonlocal buffer
        for p in _parrafos(buffer):
            if p:
                bloques.append(["parrafo", p])
        buffer = []

    i = 0
    while i < len(lineas):
        l = lineas[i]
        if re.fullmatch(r"\(\d+\)(\s+\(\d+\))*", l) or re.fullmatch(r"_{3,}", l):
            i += 1
            continue
        cols = detectar_columnas(l)
        if cols:
            cerrar()
            i += 1
            while i < len(lineas) and re.fullmatch(r"\(\d+\)(\s+\(\d+\))*", lineas[i]):
                i += 1
            bloques.append(["tabla", cols, 4, _anchos_columnas(cols)])
            continue
        if _es_subtitulo_form(l):
            cerrar()
            bloques.append(["subtitulo_form", l])
            i += 1
            continue
        unidad = leer_campo(lineas, i, buffer)
        if unidad:
            cerrar()
            bloques.extend(unidad["bloques"])
            i = unidad["fin"]
            continue
        buffer.append(l)
        i += 1
        if FIN_ORACION.search(l):
            cerrar()
    cerrar()

    if not bloques:
        return None
    return {"titulo": titulo, "bloques": bloques}


def _segs_de(bloque):
    """Segmentos inline de un bloque de texto, o None si no lo es."""
    if bloque[0] == "parrafo":
        return [["t", bloque[1]]]
    if bloque[0] in ("parrafo_campos", "campos"):
        return [list(s) for s in bloque[1]]
    if bloque[0] == "campo" and bloque[1].lstrip().startswith((",", ";")):
        segs = [["t", bloque[1].strip()]]
        if len(bloque) > 2 and bloque[2]:
            segs.append(["n", bloque[2]])
        return segs
    return None


def _texto_de(segs):
    return "".join(str(s[1]) for s in segs if s[0] == "t")


def _unir_continuaciones(bloques):
    """Une líneas que el PDF partió dentro de un mismo párrafo.

    El extractor produce un bloque por línea; en cartas y actas una frase
    sigue en la línea siguiente (empieza en minúscula o en coma) y quedaba
    como párrafo aparte. Se unen solo esos casos: el bloque anterior no
    cierra frase y el siguiente continúa en minúscula.
    """
    salida = []
    for bloque in bloques:
        segs = _segs_de(bloque)
        if salida and segs is not None:
            previos = _segs_de(salida[-1])
            if previos and previos[-1][0] in ("t", "n") and (
                "parrafo_campos" in (salida[-1][0], bloque[0])
                or (salida[-1][0] == "parrafo" and bloque[0] == "campos")
            ):
                ultimo = _texto_de(previos).rstrip()
                primero = _texto_de(segs).lstrip()
                sigue = (
                    ultimo
                    and primero
                    and not re.search(r"[.:;?!]$", ultimo)
                    and (primero[0].islower() or primero[0] in ",;)")
                )
                if sigue:
                    nuevos = list(previos)
                    if not str(nuevos[-1][1]).endswith(" ") \
                            and primero[0] not in ",;.)":
                        nuevos.append(["t", " "])
                    nuevos.extend(segs)
                    huecos = any(s[0] in ("n", "b", "f") for s in nuevos)
                    salida[-1] = ["parrafo_campos", nuevos] if huecos \
                        else ["parrafo", _texto_de(nuevos)]
                    continue
        salida.append(bloque)
    return salida


# ------------------------------------------------------------
# principal
# ------------------------------------------------------------
def cargar_plantillas():
    t = PLANTILLAS.read_text(encoding="utf-8")
    return json.loads(t[t.index("["): t.rindex("]") + 1])


def main():
    diag = "--diag" in sys.argv
    ps = cargar_plantillas()
    por_codigo = {}
    for p in ps:
        por_codigo.setdefault(p["codigo"], p)

    modelo = {}
    for codigo, p in por_codigo.items():
        especifica = FORMAS.get(codigo)
        guia_txt, form_txt = partir(
            p["texto"], p["nombre"],
            desde=especifica.get("desde") if especifica else None,
        )
        guia = parsear_guia(guia_txt, p["nombre"]) if guia_txt.strip() else None
        if especifica:
            form = {k: v for k, v in especifica.items() if k not in ("desde", "sin_guia")}
            if especifica.get("sin_guia"):
                guia = None
        elif form_txt:
            form = parsear_formulario(form_txt, p["nombre"])
        else:
            form = None

        # Texto sin estructura de formulario: en realidad es una guía
        # metodológica (tablas de referencia aparte, ver FORMAS).
        if form and not especifica:
            tipos = [b[0] for b in form["bloques"]]
            estructurales = {"tabla", "tabla_encabezado", "tabla_doble",
                             "campos", "firmas", "casillas", "parrafo_campos"}
            n_parr = tipos.count("parrafo")
            n_campo = tipos.count("campo") + tipos.count("campos")
            if (not any(t in estructurales for t in tipos)
                    and n_campo <= 3 and (n_parr >= 10 or not guia)):
                convertidos = [["subtitulo", b[1]] if b[0] == "subtitulo_form" else b
                               for b in form["bloques"]]
                if guia:
                    guia["bloques"].extend(convertidos)
                else:
                    guia = {"titulo": form["titulo"], "bloques": convertidos}
                form = None

        if form and not especifica:
            form["bloques"] = _unir_continuaciones(form["bloques"])

        entrada = {
            "codigo": codigo,
            "nombre": p["nombre"],
            "pagina": p["pagina"],
            "guia": guia,
            "formulario": form,
            "archivos": {},
        }
        if guia and guia.get("bloques"):
            entrada["archivos"]["guia"] = nombre_archivo(codigo, p["nombre"], "guia")
        if form and form.get("bloques"):
            entrada["archivos"]["formulario"] = nombre_archivo(codigo, p["nombre"], "formulario")
        if entrada["archivos"]:
            modelo[codigo] = entrada

        if diag:
            def resumen(b):
                tipos = {}
                for x in b:
                    tipos[x[0]] = tipos.get(x[0], 0) + 1
                return ", ".join(f"{k}:{v}" for k, v in sorted(tipos.items()))
            g = len(guia["bloques"]) if guia else 0
            f = len(form["bloques"]) if form else 0
            print(f"{codigo:12} g:{g:3} [{resumen(guia['bloques']) if guia else '—'}]")
            print(f"{'':12} f:{f:3} [{resumen(form['bloques']) if form else '—'}]")

    contenido = (
        "// Estructura de los formularios del Tomo II para generar Word e imprimir.\n"
        "// Generado por tools/estructurar_todo.py — NO editar a mano (ver CONSTITUCION.md).\n"
        "window.DEDILLO_FORMULARIOS = "
        + json.dumps(modelo, ensure_ascii=False, indent=1)
        + ";\n"
    )
    SALIDA.write_text(contenido, encoding="utf-8")
    con_form = sum(1 for e in modelo.values() if e["formulario"])
    con_guia = sum(1 for e in modelo.values() if e["guia"])
    print(f"\n{len(modelo)} códigos · {con_guia} guías · {con_form} formularios · "
          f"{len(contenido) // 1024} KB → {SALIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
