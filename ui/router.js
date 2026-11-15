// ============================================================
// ui/router.js — EL único punto de render (Patrón 3 de la CONSTITUCION.md).
// Registro de vistas: cada módulo exporta render + eventos + titulo.
// Nueva pantalla = nueva entrada en este registro; nunca se toca el router.
// ============================================================
import { iniciarEstado, obtenerEstado, actualizarEstado } from "../core/estado.js";
import { crearSesion, responder, preguntaDe } from "../core/examen.js";
import * as vistaManual from "./vistas/manual.js";
import * as vistaPlantillas from "./vistas/plantillas.js";
import * as vistaBuscar from "./vistas/buscar.js";
import * as vistaCurso from "./vistas/curso.js";
import * as vistaPlazos from "./vistas/plazos.js";
import * as vistaGlosario from "./vistas/glosario.js";
import * as vistaProgreso from "./vistas/progreso.js";
import * as vistaExamen from "./vistas/examen.js";
import * as vistaFuentes from "./vistas/fuentes.js";

const REGISTRO = {
  manual: vistaManual,
  plantillas: vistaPlantillas,
  buscar: vistaBuscar,
  curso: vistaCurso,
  plazos: vistaPlazos,
  glosario: vistaGlosario,
  progreso: vistaProgreso,
  examen: vistaExamen,
  fuentes: vistaFuentes,
};

const VISTAS_NAV = ["manual", "plantillas", "buscar", "curso", "plazos", "glosario", "examen", "progreso", "fuentes"];

/** "#manual/H-001-0001" → { vista: "manual", param: "H-001-0001" } */
function leerHash() {
  const partes = location.hash.replace(/^#/, "").split("/");
  const vista = partes[0] || "manual";
  return { vista: REGISTRO[vista] ? vista : "manual", param: partes[1] ? decodeURIComponent(partes[1]) : "" };
}

function actualizarNavegacion(vista) {
  document.querySelectorAll("[data-v]").forEach((a) => {
    const activo = a.dataset.v === vista;
    a.classList.toggle("activo", activo);
    if (activo) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

let ultimaClave = null;
// eventos conectados una sola vez por (contenedor, vista): sin duplicados
// y sin dejar vistas sin conectar (el bug del buscador de la Fase 3)
const conectados = new WeakMap();

function renderizar() {
  const { vista, param } = leerHash();
  const modulo = REGISTRO[vista];
  const contenedor = document.getElementById("main");
  const clave = `${vista}/${param}`;

  modulo.render(contenedor, obtenerEstado(), param);
  if (modulo.eventos) {
    const ya = conectados.get(contenedor) || new Set();
    if (!ya.has(vista)) {
      modulo.eventos(contenedor, obtenerEstado());
      ya.add(vista);
      conectados.set(contenedor, ya);
    }
  }
  document.title = `${modulo.titulo?.(param) || "Al Dedillo"} · Al Dedillo`;
  actualizarNavegacion(vista);

  // restituir el scroll solo al volver a la misma vista; si se cambia de vista o parámetro, arriba
  if (ultimaClave !== clave) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  ultimaClave = clave;
}

function conectarNavegacion() {
  window.addEventListener("hashchange", renderizar);
  // las vistas piden re-render con un evento (nunca importan al router)
  window.addEventListener("dedillo:renderizar", renderizar);
  // panel «Más» en móvil
  const boton = document.getElementById("boton-mas");
  boton?.addEventListener("click", () => {
    const panel = document.getElementById("panel-mas");
    const abierto = panel.hidden;
    panel.hidden = !abierto;
    boton.setAttribute("aria-expanded", String(abierto));
  });
  document.addEventListener("click", (e) => {
    // alternar tema desde cualquier toggle con data-tema-toggle
    if (e.target.closest("[data-tema-toggle]")) {
      import("../core/estado.js").then((m) => m.alternarTema());
    }
    // cerrar el panel «Más» al navegar
    if (e.target.closest("a") && !document.getElementById("panel-mas")?.hidden) {
      document.getElementById("panel-mas").hidden = true;
    }
  });
}

iniciarEstado();
sembrarDemo();
conectarNavegacion();
renderizar();

/** QA: ?examen=demo|ko|fin siembra una sesión para verificar el flujo sin clics. */
function sembrarDemo() {
  const demo = new URLSearchParams(location.search).get("examen");
  if (!demo || obtenerEstado().examenSesion) return;
  let sesion = crearSesion(null, () => 0.5);
  if (demo === "demo" || demo === "ok" || demo === "ko") {
    const q = preguntaDe(sesion);
    const elegida = demo === "ko" ? (q.correcta + 1) % q.opciones.length : q.correcta;
    sesion = responder(sesion, elegida).sesion;
  } else if (demo === "fin") {
    for (let i = 0; i < sesion.ids.length; i++) {
      sesion = { ...sesion, actual: i };
      const q = preguntaDe(sesion);
      const elegida = i % 3 === 0 ? (q.correcta + 1) % q.opciones.length : q.correcta;
      sesion = responder(sesion, elegida).sesion;
    }
    sesion = { ...sesion, estado: "terminado", actual: sesion.ids.length - 1 };
  }
  actualizarEstado({ examenSesion: sesion });
}
