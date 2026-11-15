// ============================================================
// ui/componentes.js — piezas de UI reutilizables (Patrón 1: solo esta
// capa toca la construcción de HTML). Devuelven strings HTML seguros.
// ============================================================
import { existeCodigo, rutaDeCodigo, seccionPorCodigo, constantes } from "../core/datos.js";
import { esTitulo, reflujo } from "../core/texto.js";

export function escapar(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Chip de código normativo: la firma visual. Es un botón si el código existe. */
export function chip(codigo, opciones = {}) {
  const c = escapar(codigo);
  if (existeCodigo(codigo) && !opciones.plano) {
    const clase = codigo.startsWith("P-") ? "chip chip-plantilla" : "chip";
    return `<a class="${clase}" href="${rutaDeCodigo(codigo)}">${c}</a>`;
  }
  return `<span class="chip">${c}</span>`;
}

/** Convierte los códigos mencionados en un texto en chips clicables. */
const RE_CODIGOS = /\b(H-\d{3}-\d{4}(?:-\d{2})?|H-\d{3}-G\d{2}(?:-\d{2})?|H-002-APC(?:\d{2})?|P-[0-9A-Z]{2,6}(?:-[0-9A-Z]{2,3})*)\b/g;
export function linkify(texto) {
  return escapar(texto).replace(RE_CODIGOS, (codigo) => {
    if (!existeCodigo(codigo)) return codigo;
    const clase = codigo.startsWith("H-") ? "chip" : "chip chip-plantilla";
    return `<a class="${clase}" href="${rutaDeCodigo(codigo)}">${codigo}</a>`;
  });
}

/** Texto del Manual y de las plantillas a bloques: párrafos recompuestos
 *  (core/texto.js) y títulos cortos («Propósito», «Anotaciones»…) como h3. */
export function parrafos(texto) {
  return reflujo(texto)
    .split("\n")
    .map((b) => (esTitulo(b) ? `<h3 class="bloque-titulo">${linkify(b)}</h3>` : `<p>${linkify(b)}</p>`))
    .join("");
}

export function badgePagina(pagina) {
  return pagina ? `<span class="pag-gaceta">Gaceta · p. ${pagina}</span>` : "";
}

/** Migas de pan para secciones profundas. */
export function breadcrumb(items) {
  return `<nav class="miga" aria-label="Ubicación">${items
    .map((i) => (i.href ? `<a href="${i.href}">${escapar(i.texto)}</a>` : `<span>${escapar(i.texto)}</span>`))
    .join('<span class="miga-sep" aria-hidden="true">›</span>')}</nav>`;
}

/** Escala visual de plazos (dolor #1): días háiles 5/10/20/30 sobre una línea. */
export function escalaPlazos() {
  const plazos = constantes().plazos.filter((p) => p.unidad === "diasHabiles");
  const max = Math.max(...plazos.map((p) => p.dias));
  const marcas = plazos
    .map((p) => {
      const x = Math.min((p.dias / max) * 100, 97);
      const alBorde = x > 90;
      return `<a class="plazo-marca" style="left:${x}%;transform:translateX(${alBorde ? "-100%" : "-50%"})" href="${rutaDeCodigo(p.codigo)}" title="${escapar(p.titulo)}"><span class="plazo-dias">${p.dias}</span><small>días</small></a>`;
    })
    .join("");
  return `<div class="escala-plazos" role="img" aria-label="Escala de plazos: ${plazos.map((p) => p.dias + " días hábiles").join(", ")}">
    <div class="escala-linea"></div>${marcas}
  </div>`;
}

/** Estado vacío reutilizable. */
export function vistaVacia(titulo, mensaje, accionHtml = "") {
  return `<div class="vacia">
    <h2>${escapar(titulo)}</h2>
    <p>${escapar(mensaje)}</p>
    ${accionHtml}
  </div>`;
}
