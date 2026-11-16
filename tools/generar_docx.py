# ============================================================
# tools/generar_docx.py — de data/formularios.js a plantillas/*.docx
#
# Uso:
#   python3 tools/generar_docx.py              (todos los códigos del modelo)
#   python3 tools/generar_docx.py P-001-G01 …  (solo esos)
#
# Genera, por código, dos archivos separados:
#   «<código> - <nombre> - formulario.docx»   (para llenar)
#   «<código> - <nombre> - guia.docx»         (guía de elaboración)
# ============================================================
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import docx_plantillas as dp  # noqa: E402
from nombres import nombre_archivo  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
MODELO = RAIZ / "data" / "formularios.js"
SALIDA = RAIZ / "plantillas"


def cargar_modelo():
    t = MODELO.read_text(encoding="utf-8")
    inicio = t.index("{")
    fin = t.rindex("}")
    return json.loads(t[inicio: fin + 1])


def bloque(doc, b):
    tipo = b[0]
    if tipo == "campo":
        dp.campo(doc, b[1], b[2] if len(b) > 2 else None, b[3] if len(b) > 3 else 1)
    elif tipo == "campos":
        dp.campos(doc, [(s[0], s[1]) for s in b[1]])
    elif tipo == "parrafo":
        dp.parrafo(doc, b[1])
    elif tipo == "parrafo_campos":
        dp.parrafo_campos(doc, [(s[0], s[1]) for s in b[1]])
    elif tipo == "parrafo_centrado":
        dp.parrafo_centrado(doc, b[1])
    elif tipo in ("subtitulo", "subtitulo_form"):
        dp.subtitulo(doc, b[1])
    elif tipo == "casillas":
        dp.casillas(doc, b[1])
    elif tipo == "lineas":
        for _ in range(b[1]):
            dp.linea_vacia(doc)
    elif tipo == "tabla":
        dp.tabla(doc, b[1], b[2], b[3],
                 etiquetas_col0=b[4] if len(b) > 4 else None,
                 izquierda_cols=b[5] if len(b) > 5 else (),
                 alto=dp.Cm(b[6]) if len(b) > 6 and b[6] else dp.Cm(1.0),
                 tam=b[7] if len(b) > 7 and b[7] else 10)
    elif tipo == "tabla_encabezado":
        celdas = [tuple(c) for c in b[1]]
        dp.tabla_encabezado(doc, celdas, b[2], b[3],
                            alto=dp.Cm(b[4]) if len(b) > 4 and b[4] else dp.Cm(1.0),
                            tam=b[5] if len(b) > 5 else 9,
                            izquierda_cols=b[6] if len(b) > 6 else ())
    elif tipo == "tabla_doble":
        dp.tabla_doble(doc, b[1], b[2], b[3], b[4], b[5])
    elif tipo == "firmas":
        dp.firmas(doc, [(x[0], x[1] if len(x) > 1 else None) for x in b[1]])
    elif tipo == "anotacion":
        dp.anotacion(doc, b[1], b[2])
    elif tipo == "inciso":
        dp.inciso(doc, b[1])
    elif tipo == "pagina_nueva":
        dp.pagina_nueva(doc)
    else:
        raise ValueError(f"bloque desconocido: {tipo}")


def _sin_cola_vacia(doc):
    """Quita los párrafos vacíos del final para no crear una página en blanco."""
    while doc.paragraphs and not doc.paragraphs[-1].text.strip():
        el = doc.paragraphs[-1]._element
        el.getparent().remove(el)


def generar(codigo, datos):
    meta = {"codigo": codigo, "nombre": datos["nombre"], "pagina": datos["pagina"]}
    rutas = []

    form = datos.get("formulario")
    if form and form.get("bloques"):
        doc = dp.nuevo_documento(meta, "formulario", horizontal=bool(form.get("horizontal")))
        dp.titulo(doc, form["titulo"])
        for b in form["bloques"]:
            bloque(doc, b)
        _sin_cola_vacia(doc)
        nombre = datos.get("archivos", {}).get("formulario") \
            or nombre_archivo(codigo, datos["nombre"], "formulario")
        ruta = SALIDA / nombre
        doc.save(ruta)
        rutas.append(ruta)

    guia = datos.get("guia")
    if guia and guia.get("bloques"):
        doc = dp.nuevo_documento(meta, "guia")
        dp.titulo(doc, guia["titulo"])
        for b in guia["bloques"]:
            bloque(doc, b)
        _sin_cola_vacia(doc)
        nombre = datos.get("archivos", {}).get("guia") \
            or nombre_archivo(codigo, datos["nombre"], "guia")
        ruta = SALIDA / nombre
        doc.save(ruta)
        rutas.append(ruta)
    return rutas


def main():
    modelo = cargar_modelo()
    pedidos = sys.argv[1:]
    codigos = [c for c in modelo if not pedidos or c in pedidos]
    SALIDA.mkdir(exist_ok=True)
    total = 0
    for codigo in codigos:
        rutas = generar(codigo, modelo[codigo])
        for r in rutas:
            print(f"  ✓ {r.name} ({r.stat().st_size // 1024} KB)")
        total += len(rutas)
    print(f"\n{total} documentos en {SALIDA.relative_to(RAIZ)}/")


if __name__ == "__main__":
    main()
