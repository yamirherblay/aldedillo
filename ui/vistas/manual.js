// ============================================================
// ui/vistas/manual.js — vista de consulta del Tomo I.
// #manual            → árbol por capítulos/fases
// #manual/H-001-0001 → fase (con sus tareas)
// #manual/H-001-0001-07 → tarea (texto íntegro)
// ============================================================
import { manual, seccionesManual, seccionPorCodigo, hijosDe, vecinosDe } from "../../core/datos.js";
import { marcarVisto, obtenerEstado } from "../../core/estado.js";
import { chip, escapar, linkify, parrafos, badgePagina, breadcrumb, escalaPlazos, vistaVacia } from "../componentes.js";

function itemSeccion(s) {
  return `<a class="lista-item" href="#manual/${s.codigo}">
    ${chip(s.codigo, { plano: true })}
    <span class="lista-nombre">${escapar(s.nombre || "Preámbulo")}</span>
    <span class="lista-flecha" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </a>`;
}

function arbol() {
  const secciones = seccionesManual();
  const fases = secciones.filter((s) => s.tipo === "fase" && /^H-001-\d{4}$/.test(s.codigo));
  const transversales = secciones.filter((s) => s.tipo === "transversal");
  const apc = secciones.find((s) => s.tipo === "preambulo");
  const acciones = secciones.filter((s) => s.tipo === "accion");
  return `
    ${escalaPlazos()}
    <section class="grupo"><h2>Capítulo I — Procedimientos de la auditoría</h2>
      <div class="lista">${fases.map(itemSeccion).join("")}</div></section>
    <section class="grupo"><h2>Transversales</h2>
      <div class="lista">${transversales.map(itemSeccion).join("")}</div></section>
    <section class="grupo"><h2>Capítulo II — Otras acciones de prevención y control</h2>
      ${apc ? `<p class="grupo-nota">${linkify(apc.texto.replace(/^Preámbulo\s*/, "").split("\n").slice(0, 2).join(" "))}</p>` : ""}
      <div class="lista">${acciones.map(itemSeccion).join("")}</div></section>`;
}

function detalle(codigo) {
  const s = seccionPorCodigo(codigo);
  if (!s) return vistaVacia("No encontrada", `El código ${codigo} no existe en el Manual.`, `<a class="boton" href="#manual">Volver al Manual</a>`);
  marcarVisto(codigo);

  const esTarea = s.tipo === "tarea";
  const fase = seccionPorCodigo(esTarea ? s.codigo.slice(0, 10) : s.codigo);
  const miga = esTarea
    ? breadcrumb([
        { texto: "Manual", href: "#manual" },
        { texto: fase?.nombre || "", href: `#manual/${fase?.codigo}` },
        { texto: s.nombre || s.codigo },
      ])
    : breadcrumb([{ texto: "Manual", href: "#manual" }, { texto: s.nombre || "Preámbulo" }]);

  const vecinos = vecinosDe(codigo);
  const navVecinos = (vecinos.anterior || vecinos.siguiente)
    ? `<nav class="vecinos">
        ${vecinos.anterior ? `<a class="vecino" href="#manual/${vecinos.anterior.codigo}"><span>‹</span> ${escapar(vecinos.anterior.nombre)}</a>` : "<span></span>"}
        ${vecinos.siguiente ? `<a class="vecino vecino-sig" href="#manual/${vecinos.siguiente.codigo}">${escapar(vecinos.siguiente.nombre)} <span>›</span></a>` : "<span></span>"}
      </nav>`
    : "";

  const tareas = !esTarea && s.codigo.startsWith("H-") ? hijosDe(s.codigo) : [];
  const listaTareas = tareas.length
    ? `<section class="grupo"><h2>Tareas de esta fase</h2><div class="lista">${tareas.map(itemSeccion).join("")}</div></section>`
    : "";

  return `
    ${miga}
    <article class="seccion">
      <header class="seccion-cabecera">
        ${chip(s.codigo, { plano: true })}
        <h1>${escapar(s.nombre || "Preámbulo")}</h1>
        ${badgePagina(s.pagina)}
      </header>
      ${s.faseNombre && esTarea ? `<p class="seccion-fase">Fase: ${escapar(s.faseNombre)}</p>` : ""}
      <div class="seccion-texto">${parrafos(s.texto)}</div>
    </article>
    ${navVecinos}
    ${listaTareas}`;
}

export const render = (contenedor, estado, param) => {
  contenedor.innerHTML = param ? detalle(param) : arbol();
  const activo = contenedor.querySelector(".seccion-texto");
  if (activo) activo.scrollTop = 0;
};

export const eventos = () => {};
export const titulo = (param) => (param ? (seccionPorCodigo(param)?.nombre || "Manual") : "Manual");
