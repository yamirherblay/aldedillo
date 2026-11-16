// ============================================================
// Al Dedillo — lógica de la página de entrada (index.html)
// Patrones de CONSTITUCION.md: datos → core → ui, estado mínimo local,
// delegación de eventos, sin variables globales.
// ============================================================
"use strict";

// ---------- constantes ----------
const CLAVE_TEMA = "al-dedillo-tema";
const CLAVE_STATS = "al-dedillo-stats";

// ---------- estado (mínimo local; el store central vive en app.html) ----------
function cargarStats() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STATS)) || { ok: 0, ko: 0 };
  } catch {
    return { ok: 0, ko: 0 };
  }
}

// ---------- tema claro/oscuro ----------
function aplicarTema(tema) {
  const raiz = document.documentElement;
  raiz.dataset.tema = tema;
  const oscuro = tema === "oscuro";
  document.querySelector('meta[name="theme-color"]')
    .setAttribute("content", oscuro ? "#0d1526" : "#1e3a5f");
  const boton = document.getElementById("boton-tema");
  boton.setAttribute("aria-pressed", String(oscuro));
  document.getElementById("tema-texto").textContent = oscuro ? "Modo claro" : "Modo oscuro";
}

function temaInicial() {
  // parámetro ?tema=claro|oscuro: ayuda de QA para verificar ambos modos
  const param = new URLSearchParams(location.search).get("tema");
  if (param === "claro" || param === "oscuro") return param;
  const guardado = localStorage.getItem(CLAVE_TEMA);
  if (guardado === "claro" || guardado === "oscuro") return guardado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
}

function alternarTema() {
  const nuevo = document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro";
  aplicarTema(nuevo);
  localStorage.setItem(CLAVE_TEMA, nuevo);
}

// ---------- preview: la pregunta de muestra, leída del banco (data/preguntas.js) ----------
function letrasDe(opciones) {
  return opciones.map((texto) => {
    const m = texto.match(/^([a-dA-D])\)\s*(.*)$/);
    return m ? { letra: m[1].toUpperCase(), texto: m[2] } : { letra: "•", texto };
  });
}

function chipDeReferencia(ref) {
  if (ref.codigo === "intro") return "GOC-2023-O119 · p." + ref.pagina;
  return ref.codigo + " · p." + ref.pagina;
}

function renderizarPreview() {
  const pregunta = window.DEDILLO_PREGUNTAS.preguntas
    .find((p) => p.id === "P2") || window.DEDILLO_PREGUNTAS.preguntas[0];

  document.getElementById("preview-codigo").textContent =
    pregunta.referencia.codigo === "intro" ? "Introducción" : pregunta.referencia.codigo;
  document.getElementById("preview-enunciado").textContent = pregunta.enunciado;
  document.getElementById("preview-explicacion").textContent = pregunta.explicacion;
  document.getElementById("preview-ref").textContent = chipDeReferencia(pregunta.referencia);

  const contenedor = document.getElementById("preview-opciones");
  contenedor.replaceChildren(
    ...letrasDe(pregunta.opciones).map((op, i) => {
      const div = document.createElement("div");
      div.className = "preview-opt";
      if (i === pregunta.correcta) {
        div.dataset.correcta = "true";
        div.insertAdjacentHTML(
          "beforeend",
          `<span class="opt-letra">${op.letra})</span><span>${op.texto}</span>` +
          `<span class="sello" aria-label="Respuesta correcta"><svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="m8.5 12.5 2.5 2.5 5-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`,
        );
      } else {
        div.insertAdjacentHTML("beforeend", `<span class="opt-letra">${op.letra})</span><span>${op.texto}</span>`);
      }
      return div;
    }),
  );
}

// ---------- estadísticas locales ----------
function renderizarStats() {
  const stats = cargarStats();
  const zona = document.getElementById("stats");
  if (stats.ok + stats.ko === 0) {
    zona.hidden = true;
    return;
  }
  zona.hidden = false;
  document.getElementById("stats-ok").textContent = String(stats.ok);
  document.getElementById("stats-ko").textContent = String(stats.ko);
}

// ---------- instalar sin internet ----------
let eventoInstalacion = null;

function prepararInstalacion() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    eventoInstalacion = e;
    document.getElementById("boton-instalar").classList.add("visible");
  });
  // iOS no dispara beforeinstallprompt: siempre mostramos el modal con las instrucciones
  if (esIOS()) {
    document.getElementById("boton-instalar").classList.add("visible");
  }
}

function esIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function alPedirInstalacion() {
  if (eventoInstalacion) {
    eventoInstalacion.prompt();
    eventoInstalacion = null;
  } else {
    abrirModal("modal-instalar");
  }
}

// ---------- modales ----------
let focoAnterior = null;

function abrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal || modal.classList.contains("abierto")) return;
  focoAnterior = document.activeElement;
  modal.classList.add("abierto");
  const primero = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (primero) primero.focus();
}

function cerrarModales() {
  const abiertos = document.querySelectorAll(".modal.abierto");
  if (!abiertos.length) return;
  abiertos.forEach((m) => m.classList.remove("abierto"));
  if (focoAnterior && focoAnterior.isConnected) focoAnterior.focus();
  focoAnterior = null;
}

// ---------- eventos (delegación: un listener por contenedor) ----------
function conectarEventos() {
  document.body.addEventListener("click", (e) => {
    const target = e.target;

    if (target.closest("#boton-tema")) {
      alternarTema();
      return;
    }
    if (target.closest("#boton-instalar")) {
      alPedirInstalacion();
      return;
    }
    if (target.closest("#stats-borrar")) {
      localStorage.removeItem(CLAVE_STATS);
      renderizarStats();
      return;
    }
    if (target.closest("[data-cerrar-modal]") || target.classList.contains("modal")) {
      cerrarModales();
      return;
    }
  });
  document.addEventListener("keydown", (e) => {
    const modal = document.querySelector(".modal.abierto");
    if (!modal) return;
    if (e.key === "Escape") {
      cerrarModales();
      return;
    }
    if (e.key !== "Tab") return;
    const enfocables = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  });
}

// ---------- arranque ----------
aplicarTema(temaInicial());
renderizarPreview();
renderizarStats();
prepararInstalacion();
conectarEventos();
