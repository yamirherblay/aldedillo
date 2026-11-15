// ============================================================
// core/texto.js — recompone los párrafos que el PDF partió en
// líneas cortas. Lógica pura: los datos (data/) quedan intactos;
// esta capa solo decide cómo se agrupan al presentarlos.
//
// Reglas:
//  · línea que termina en «-» → palabra cortada: se une sin espacio
//  · línea que termina en puntuación de fin (.:;!?) → cierra párrafo
//  · línea corta, sin puntuación final y que empieza por mayúscula
//    → es un título de bloque (Propósito, Emisión y archivo, …)
// ============================================================

const FIN_ORACION = /[.:;!?»"]$/;
const INICIA_MINUSCULA = /^[a-záéíóúüñ(«"]/;
const LARGO_TITULO = 42;

/* Compuestos con guion legítimos del dominio (no son palabras partidas). */
const COMPUESTOS = [
  "causa-efecto", "costo-beneficio", "costo-rendimiento",
  "contable-financiero", "contable-financieros", "contables-financieros",
  "económico-financiero", "económico-financieros", "económica-financiera",
  "económica-financieras", "económicos-financieros",
  "decretos-leyes", "hombre-medioambiente", "hombres-días",
  "día-mes-año", "día-mes", "curso-hito",
];
const RE_GUION_INTERNO = /([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,})-([a-záéíóúüñ]{2,})/g;

/** Quita los guiones que el PDF dejó dentro de palabras («Repú-blica» → «República»),
 *  preservando los compuestos legítimos de la lista. */
export function desguionar(bloque) {
  const protegidos = [];
  let texto = bloque;
  for (const c of COMPUESTOS) {
    const re = new RegExp(c.replace(/-/g, "[-‐‑­]?"), "gi");
    texto = texto.replace(re, (m) => {
      protegidos.push(m);
      return `\u0000${protegidos.length - 1}\u0000`;
    });
  }
  texto = texto.replace(RE_GUION_INTERNO, (m, a, b) => a + b);
  return texto.replace(/\u0000(\d+)\u0000/g, (_, i) => protegidos[Number(i)]);
}

/** ¿Es un título de bloque y no una línea cortada de un párrafo? */
export function esTitulo(linea) {
  const t = linea.trim();
  if (!t || t.length > LARGO_TITULO) return false;
  if (FIN_ORACION.test(t) || t.endsWith("-")) return false;
  if (INICIA_MINUSCULA.test(t)) return false;
  return true;
}

/** Devuelve el texto recompuesto: párrafos separados por «\n». */
export function reflujo(texto) {
  const lineas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
  const bloques = [];
  let actual = "";
  const cerrar = () => {
    if (actual) bloques.push(actual);
    actual = "";
  };

  for (const linea of lineas) {
    if (esTitulo(linea)) {
      cerrar();
      bloques.push(linea);
      continue;
    }
    if (actual.endsWith("-")) {
      actual = actual.slice(0, -1) + linea; // palabra partida por el guion del PDF
    } else {
      actual += (actual ? " " : "") + linea;
    }
    if (FIN_ORACION.test(linea)) cerrar();
  }
  cerrar();
  return bloques.map(desguionar).join("\n");
}
