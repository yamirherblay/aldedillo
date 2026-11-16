# ============================================================
# tools/texto.py — utilidades de texto compartidas por los
# generadores de Word (mismas reglas que core/texto.js).
# ============================================================
import re

FIN_ORACION = re.compile(r"[.:;!?»\"]$")
COMPUESTOS = [
    "causa-efecto", "costo-beneficio", "costo-rendimiento",
    "contable-financiero", "contable-financieros", "contables-financieros",
    "económico-financiero", "económico-financieros", "económica-financiera",
    "económica-financieras", "económicos-financieros",
    "decretos-leyes", "hombre-medioambiente", "hombres-días",
    "día-mes-año", "día-mes", "curso-hito",
]
RE_GUION = re.compile(r"([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,})-([a-záéíóúüñ]{2,})")


def desguionar(texto):
    protegidos = []

    def guardar(m):
        protegidos.append(m.group(0))
        return f"\u0000{len(protegidos) - 1}\u0000"

    for c in COMPUESTOS:
        patron = re.compile(c.replace("-", "[-]?"), re.IGNORECASE)
        texto = patron.sub(guardar, texto)
    texto = RE_GUION.sub(lambda m: m.group(1) + m.group(2), texto)
    return re.sub(r"\u0000(\d+)\u0000", lambda m: protegidos[int(m.group(1))], texto)


def unir_lineas(lineas):
    """Une líneas del PDF respetando el guion de fin de línea («ac- ción»)."""
    salida = ""
    for linea in lineas:
        if salida.endswith("-"):
            salida = salida[:-1] + linea
        else:
            salida += (" " if salida else "") + linea
    return desguionar(" ".join(salida.split()))


def es_titulo(linea, largo=42):
    t = linea.strip()
    if not t or len(t) > largo:
        return False
    if FIN_ORACION.search(t) or t.endswith("-"):
        return False
    if re.match(r"^[a-záéíóúüñ(«\"]", t):
        return False
    return True


def reflujo(texto):
    lineas = [l.strip() for l in texto.split("\n") if l.strip()]
    bloques, actual = [], ""

    def cerrar():
        nonlocal actual
        if actual:
            bloques.append(desguionar(actual))
        actual = ""

    for linea in lineas:
        if es_titulo(linea):
            cerrar()
            bloques.append(linea)
            continue
        if actual.endswith("-"):
            actual = actual[:-1] + linea
        else:
            actual += (" " if actual else "") + linea
        if FIN_ORACION.search(linea):
            cerrar()
    cerrar()
    return bloques


def normalizar(s):
    s = s.lower().replace("–", "-").replace("—", "-")
    return re.sub(r"[^a-z0-9áéíóúüñ]+", " ", s).strip()


def mayusculas(s):
    letras = [c for c in s if c.isalpha()]
    if not letras:
        return 0.0
    return sum(1 for c in letras if c.isupper()) / len(letras)


def similitud(a, b):
    ta = set(normalizar(a).split())
    tb = set(normalizar(b).split())
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / min(len(ta), len(tb))


def limpiar_notas(texto):
    """Quita las marcas (n) del final y los dos puntos sueltos."""
    texto = re.sub(r"\s*\(\d+\)\s*", " ", texto)
    return re.sub(r"\s+", " ", texto).strip()
