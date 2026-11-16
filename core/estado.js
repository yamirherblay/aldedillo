// ============================================================
// core/estado.js — EL store central (Patrón 2 de la CONSTITUCION.md).
// Prohibido repartir estado en variables sueltas por módulo.
// ============================================================
import { sesionEsValida } from "./examen.js";

const CLAVES = {
  tema: "al-dedillo-tema",
  vistos: "al-dedillo-vistos",
  stats: "al-dedillo-stats",
  examenSesion: "al-dedillo-examen",
};

const estado = {
  tema: "claro",
  // progreso de consulta: códigos ya visitados
  vistos: new Set(),
  // resultados acumulados (misma clave que usa la página de entrada)
  examen: { ok: 0, ko: 0 },
  // sesión de examen en curso (persiste entre recargas)
  examenSesion: null,
};

function leer(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave));
  } catch {
    return null;
  }
}

export function iniciarEstado() {
  const temaGuardado = localStorage.getItem(CLAVES.tema);
  const preferido = window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
  // QA: ?tema=claro|oscuro en la URL tiene prioridad (igual que en la entrada)
  const porUrl = new URLSearchParams(location.search).get("tema");
  estado.tema = porUrl === "claro" || porUrl === "oscuro" ? porUrl
    : temaGuardado === "claro" || temaGuardado === "oscuro" ? temaGuardado : preferido;
  const vistosGuardados = leer(CLAVES.vistos);
  estado.vistos = new Set(Array.isArray(vistosGuardados) ? vistosGuardados : []);
  const stats = leer(CLAVES.stats);
  estado.examen = stats && typeof stats.ok === "number" ? { ok: stats.ok, ko: stats.ko } : { ok: 0, ko: 0 };
  const sesionGuardada = leer(CLAVES.examenSesion);
  estado.examenSesion = sesionEsValida(sesionGuardada) ? sesionGuardada : null;
  if (sesionGuardada && !estado.examenSesion) localStorage.removeItem(CLAVES.examenSesion);
  aplicarTema();
}

/** Único punto de cambio del estado. Persiste automáticamente lo persistible. */
export function actualizarEstado(cambios) {
  Object.assign(estado, cambios);
  if (cambios.vistos) {
    localStorage.setItem(CLAVES.vistos, JSON.stringify([...estado.vistos]));
  }
  if (cambios.examen) {
    localStorage.setItem(CLAVES.stats, JSON.stringify(estado.examen));
  }
  if (cambios.examenSesion !== undefined) {
    if (estado.examenSesion) localStorage.setItem(CLAVES.examenSesion, JSON.stringify(estado.examenSesion));
    else localStorage.removeItem(CLAVES.examenSesion);
  }
  if (cambios.tema) {
    localStorage.setItem(CLAVES.tema, estado.tema);
    aplicarTema();
  }
}

export function obtenerEstado() {
  return estado;
}

/** Registra un código como consultado (progreso). */
export function marcarVisto(codigo) {
  if (!codigo || estado.vistos.has(codigo)) return;
  estado.vistos.add(codigo);
  actualizarEstado({ vistos: estado.vistos });
}

function aplicarTema() {
  document.documentElement.dataset.tema = estado.tema;
  const oscuro = estado.tema === "oscuro";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", oscuro ? "#0d1526" : "#1e3a5f");
}

/** Alterna claro/oscuro. */
export function alternarTema() {
  actualizarEstado({ tema: estado.tema === "oscuro" ? "claro" : "oscuro" });
}
