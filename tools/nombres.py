# ============================================================
# tools/nombres.py — nombres de archivo de las plantillas.
# El modelo (data/formularios.js) y el generador (generar_docx.py)
# deben coincidir exactamente: ambos usan esta función.
# ============================================================
import re

PROHIBIDOS = re.compile(r'[\\/:*?"<>|]')


def nombre_archivo(codigo, nombre, tipo):
    limpio = PROHIBIDOS.sub("-", " ".join(nombre.split())).strip(" .")
    if len(limpio) > 80:
        limpio = limpio[:77].rstrip(" ,;:-") + "…"
    return f"{codigo} - {limpio} - {tipo}.docx"
