# ============================================================
# tools/docx_plantillas.py — construye los .docx de las plantillas.
#
# Norma: Arial 12, A4, márgenes 2.5 cm, encabezado con código y
# página de la Gaceta, pie con «Página X de Y» (campos de Word).
# Sin marca de la aplicación: el documento es del auditor.
#
# Las tablas se construyen con la geometría del modelo (anchos en
# cm) y admiten encabezados de varios niveles con celdas fusionadas.
# ============================================================
from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_ROW_HEIGHT_RULE
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

FUENTE = "Arial"
ANCHO_TEXTO = 16.0  # cm útiles en A4 vertical (21 − 2×2.5)
GRIS = RGBColor(0x59, 0x59, 0x59)

ORDEN_PPR = (
    "w:shd", "w:tabs", "w:suppressAutoHyphens", "w:kinsoku", "w:wordWrap",
    "w:overflowPunct", "w:topLinePunct", "w:autoSpaceDE", "w:autoSpaceDN",
    "w:bidi", "w:adjustRightInd", "w:snapToGrid", "w:spacing", "w:ind",
    "w:contextualSpacing", "w:mirrorIndents", "w:suppressOverlap", "w:jc",
    "w:textDirection", "w:textAlignment", "w:textboxTightWrap",
    "w:outlineLvl", "w:divId", "w:cnfStyle", "w:rPr", "w:sectPr", "w:pPrChange",
)


def ancho(doc):
    return getattr(doc, "_ancho_texto", ANCHO_TEXTO)


def _rfonts(rPr):
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs"):
        rFonts.set(qn(attr), FUENTE)
    return rFonts


def texto(p, contenido, tam=12, negrita=False, cursiva=False,
          superindice=False, color=None, subrayado=False):
    r = p.add_run(contenido)
    r.font.name = FUENTE
    r.font.size = Pt(tam)
    r.bold = negrita
    r.italic = cursiva
    r.underline = subrayado
    if superindice:
        r.font.superscript = True
    if color is not None:
        r.font.color.rgb = color
    _rfonts(r._r.get_or_add_rPr())
    return r


def _nota(p, num, tam=9):
    texto(p, f"({num})", tam, superindice=True, color=GRIS)


def _borde(p, lados=("bottom",), sz="6", color="808080"):
    pPr = p._p.get_or_add_pPr()
    pBdr = pPr.find(qn("w:pBdr"))
    if pBdr is None:
        pBdr = OxmlElement("w:pBdr")
        pPr.insert_element_before(pBdr, *ORDEN_PPR)
    for lado in lados:
        el = OxmlElement(f"w:{lado}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), sz)
        el.set(qn("w:space"), "1")
        el.set(qn("w:color"), color)
        pBdr.append(el)


def _campo_word(p, instruccion, tam=9, color=GRIS):
    """Campo de Word (PAGE / NUMPAGES) en runs separados, como exige OOXML."""
    r = texto(p, "", tam, color=color)
    fld = OxmlElement("w:fldChar")
    fld.set(qn("w:fldCharType"), "begin")
    r._r.append(fld)
    r = texto(p, "", tam, color=color)
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = f" {instruccion} "
    r._r.append(instr)
    r = texto(p, "", tam, color=color)
    fld = OxmlElement("w:fldChar")
    fld.set(qn("w:fldCharType"), "separate")
    r._r.append(fld)
    texto(p, "1", tam, color=color)
    r = texto(p, "", tam, color=color)
    fld = OxmlElement("w:fldChar")
    fld.set(qn("w:fldCharType"), "end")
    r._r.append(fld)


def nuevo_documento(meta, tipo, horizontal=False):
    """tipo: 'formulario' | 'guia'."""
    doc = Document()
    sec = doc.sections[0]
    if horizontal:
        sec.page_width, sec.page_height = Cm(29.7), Cm(21)
        sec.left_margin = sec.right_margin = Cm(2.0)
        sec.top_margin = sec.bottom_margin = Cm(1.8)
    else:
        sec.page_width, sec.page_height = Cm(21), Cm(29.7)
        sec.left_margin = sec.right_margin = Cm(2.5)
        sec.top_margin = sec.bottom_margin = Cm(2.5)
    sec.header_distance = Cm(1.1)
    sec.footer_distance = Cm(1.1)
    doc._ancho_texto = round(
        (sec.page_width - sec.left_margin - sec.right_margin) / 360000, 2
    )

    normal = doc.styles["Normal"]
    normal.font.name = FUENTE
    normal.font.size = Pt(12)
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.5 if tipo == "guia" else 1.15

    # encabezado
    hp = sec.header.paragraphs[0]
    hp.paragraph_format.tab_stops.clear_all()
    hp.paragraph_format.tab_stops.add_tab_stop(Cm(ancho(doc)), WD_TAB_ALIGNMENT.RIGHT)
    texto(hp, meta["codigo"], 9, color=GRIS)
    texto(hp, "\t", 9)
    texto(hp, f"Res. 364/2023 · Gaceta pág. {meta['pagina']}", 9, color=GRIS)
    _borde(hp, ("bottom",), sz="4", color="BFBFBF")

    # pie con numeración real
    fp = sec.footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    texto(fp, f"Modelo {meta['codigo']} · Res. 364/2023 · Página ", 9, color=GRIS)
    _campo_word(fp, "PAGE")
    texto(fp, " de ", 9, color=GRIS)
    _campo_word(fp, "NUMPAGES")

    doc.core_properties.title = f"{meta['codigo']} {meta['nombre']}"
    doc.core_properties.subject = "Resolución 364/2023 — Manual de procedimientos"
    doc.core_properties.author = ""
    doc.core_properties.comments = "Documento de trabajo basado en el modelo oficial"
    return doc


def titulo(doc, contenido, tam=12):
    lineas = [l for l in contenido.split("\n") if l.strip()]
    for i, linea in enumerate(lineas):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_before = Pt(6 if i == 0 else 0)
        p.paragraph_format.space_after = Pt(14 if i == len(lineas) - 1 else 0)
        p.paragraph_format.keep_with_next = True
        texto(p, linea, tam, negrita=True)


def subtitulo(doc, contenido, tam=12):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    texto(p, contenido, tam, negrita=True)


def parrafo(doc, contenido, justificado=True, sangria=0.0):
    p = doc.add_paragraph()
    if justificado:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if sangria:
        p.paragraph_format.left_indent = Cm(sangria)
    texto(p, contenido, 12)
    return p


def parrafo_centrado(doc, contenido, tam=12, negrita=False):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(6)
    texto(p, contenido, tam, negrita=negrita)
    return p


def anotacion(doc, num, contenido):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.left_indent = Cm(1.0)
    p.paragraph_format.first_line_indent = Cm(-1.0)
    texto(p, f"({num})", 12, negrita=True)
    texto(p, " " + contenido, 12)
    return p


def inciso(doc, contenido):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.left_indent = Cm(1.6)
    texto(p, contenido, 12)
    return p


def linea_vacia(doc, espacio_antes=0, espacio_despues=12):
    """Línea de escritura continua (tab con relleno de guiones bajos)."""
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.0
    p.paragraph_format.space_before = Pt(espacio_antes)
    p.paragraph_format.space_after = Pt(espacio_despues)
    p.paragraph_format.tab_stops.add_tab_stop(
        Cm(ancho(doc)), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.LINES
    )
    texto(p, "\t", 12)
    return p


def campo(doc, etiqueta, nota=None, lineas=1):
    if len(etiqueta) <= 62 and (lineas or 1) == 1:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(8)
        texto(p, etiqueta, 12)
        if nota:
            texto(p, " ", 12)
            _nota(p, nota)
        texto(p, " ", 12)
        p.paragraph_format.tab_stops.add_tab_stop(
            Cm(ancho(doc)), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.LINES
        )
        texto(p, "\t", 12)
    else:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        texto(p, etiqueta, 12)
        if nota:
            texto(p, " ", 12)
            _nota(p, nota)
        for _ in range(max(1, lineas or 1)):
            linea_vacia(doc)


def _blanco(p, cm):
    texto(p, "_" * max(6, round(cm * 4)), 12)


def _segmentos(p, segmentos, tam=12, doc=None):
    """Texto y espacios en blanco dentro de una misma línea."""
    ultimo = " "
    for tipo, valor in segmentos:
        if tipo == "t":
            texto(p, valor, tam)
            if valor:
                ultimo = valor[-1]
        elif tipo == "n":
            if not ultimo.isspace():
                texto(p, " ", tam)
            _nota(p, valor, tam - 3)
            ultimo = ")"
        elif tipo == "b":
            if not ultimo.isspace():
                texto(p, " ", tam)
            _blanco(p, valor)
            texto(p, " ", tam)
            ultimo = " "
        elif tipo == "f":
            # blanco flexible: rellena hasta el margen derecho
            p.paragraph_format.tab_stops.add_tab_stop(
                Cm(ancho(doc) if doc is not None else ANCHO_TEXTO),
                WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.LINES,
            )
            texto(p, "\t", tam)
            ultimo = "\t"
        else:
            raise ValueError(f"segmento desconocido: {tipo}")


def campos(doc, segmentos, tam=12):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    _segmentos(p, segmentos, tam, doc=doc)


def parrafo_campos(doc, segmentos, tam=12):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    _segmentos(p, segmentos, tam, doc=doc)


def casillas(doc, contenido):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    texto(p, contenido, 12)


def _anchos(tabla, anchos):
    tabla.autofit = False
    for i, ancho_col in enumerate(anchos):
        tabla.columns[i].width = Cm(ancho_col)
        for celda in tabla.columns[i].cells:
            celda.width = Cm(ancho_col)


def _no_partir(fila):
    trPr = fila._tr.get_or_add_trPr()
    el = OxmlElement("w:cantSplit")
    trPr.insert_element_before(el, "w:trHeight", "w:tblHeader",
                               "w:tblCellSpacing", "w:jc", "w:hidden")


def _cabecera_repetir(fila):
    trPr = fila._tr.get_or_add_trPr()
    el = OxmlElement("w:tblHeader")
    trPr.insert_element_before(el, "w:tblCellSpacing", "w:jc", "w:hidden")


def _unida(tabla, maximo=8):
    """Evita que una tabla corta se parta entre páginas."""
    if len(tabla.rows) > maximo:
        return
    for fila in tabla.rows[:-1]:
        for celda in fila.cells:
            for p in celda.paragraphs:
                p.paragraph_format.keep_with_next = True


def _celda(celda, contenido="", negrita=False, tam=10, centrado=True, izquierda=False):
    celda.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    partes = str(contenido).split("\n") if contenido else [""]
    for i, parte in enumerate(partes):
        p = celda.paragraphs[0] if i == 0 else celda.add_paragraph()
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.0
        if centrado and not izquierda:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if parte:
            texto(p, parte, tam, negrita=negrita)


def tabla(doc, cabeceras, filas, anchos, etiquetas_col0=None,
          alto=Cm(1.0), tam=10, izquierda_cols=()):
    """Tabla simple.

    filas: número de filas vacías o lista de listas con valores.
    etiquetas_col0: etiquetas para la primera columna (lista).
    """
    valores = filas if isinstance(filas, list) else None
    n_filas = len(valores) if valores is not None else int(filas)
    t = doc.add_table(rows=1 + n_filas, cols=len(cabeceras))
    t.style = "Table Grid"
    t.alignment = 1
    cab = t.rows[0]
    _no_partir(cab)
    for i, texto_cab in enumerate(cabeceras):
        _celda(cab.cells[i], texto_cab, negrita=True, tam=tam)
    for f in range(n_filas):
        fila = t.rows[1 + f]
        fila.height = alto
        fila.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST
        _no_partir(fila)
        for c in range(len(cabeceras)):
            valor = ""
            if valores is not None and c < len(valores[f]):
                valor = valores[f][c]
            elif etiquetas_col0 and c == 0 and f < len(etiquetas_col0):
                valor = etiquetas_col0[f]
            izquierda = bool(valor) and (
                c == 0 or c in izquierda_cols
                or (len(str(valor)) > 40 and c != len(cabeceras) - 1)
            )
            _celda(fila.cells[c], valor, tam=tam, izquierda=izquierda)
    _cabecera_repetir(cab)
    _anchos(t, anchos)
    _unida(t, 10 if valores is not None and len(valores) > 8 else 8)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def tabla_encabezado(doc, celdas, filas, anchos, alto=Cm(1.0), tam=9,
                     izquierda_cols=()):
    """Tabla con encabezado de varios niveles.

    celdas: [(fila, col_ini, col_fin, texto), …] con col_fin inclusive.
    filas: número de filas vacías o lista de listas con valores.
    """
    valores = filas if isinstance(filas, list) else None
    n_filas = len(valores) if valores is not None else int(filas)
    n_cab = max(c[0] for c in celdas) + 1
    t = doc.add_table(rows=n_cab + n_filas, cols=len(anchos))
    t.style = "Table Grid"
    t.alignment = 1
    for fila_i, c0, c1, contenido in celdas:
        celda = t.cell(fila_i, c0)
        _celda(celda, contenido, negrita=True, tam=tam)
        if c1 > c0:
            celda = celda.merge(t.cell(fila_i, c1))
            _celda(celda, contenido, negrita=True, tam=tam)
    for i in range(n_cab):
        fila = t.rows[i]
        _no_partir(fila)
        _cabecera_repetir(fila)
    for f in range(n_filas):
        fila = t.rows[n_cab + f]
        fila.height = alto
        fila.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST
        _no_partir(fila)
        for c in range(len(anchos)):
            valor = ""
            if valores is not None and c < len(valores[f]):
                valor = valores[f][c]
            izquierda = bool(valor) and (
                c == 0 or c in izquierda_cols
                or (len(str(valor)) > 40 and c != len(cabeceras) - 1)
            )
            _celda(fila.cells[c], valor, tam=tam, izquierda=izquierda)
    _anchos(t, anchos)
    _unida(t, 8)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def tabla_doble(doc, grupo, sub, resto, filas, anchos, alto=Cm(1.0), tam=10):
    """Cabecera de dos niveles: grupo ocupa 2 columnas y sub son Sí/No."""
    celdas = [(0, 0, 1, grupo), (1, 0, 0, sub[0]), (1, 1, 1, sub[1])]
    for i, cab in enumerate(resto):
        celdas.append((0, 2 + i, 2 + i, cab))
    return tabla_encabezado(doc, celdas, filas, anchos, alto=alto, tam=tam)


def firmas(doc, bloques):
    """bloques: [(texto, nota|None), …] en columnas iguales, sin bordes."""
    t = doc.add_table(rows=1, cols=len(bloques))
    t.autofit = False
    fila = t.rows[0]
    fila.height = Cm(1.6)
    fila.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST
    ancho_col = ancho(doc) / len(bloques)
    for i, (etiqueta, nota) in enumerate(bloques):
        celda = t.rows[0].cells[i]
        celda.width = Cm(ancho_col)
        p = celda.paragraphs[0]
        p.paragraph_format.space_before = Pt(30)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.0
        texto(p, " ", 12)
        _borde(p, ("bottom",), sz="8", color="404040")
        p2 = celda.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.paragraph_format.space_after = Pt(0)
        p2.paragraph_format.line_spacing = 1.0
        texto(p2, etiqueta, 11)
        if nota:
            _nota(p2, nota, 9)
    for col in t.columns:
        col.width = Cm(ancho_col)


def pagina_nueva(doc):
    doc.add_page_break()
