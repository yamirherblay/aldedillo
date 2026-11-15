// ============================================================
// ui/vistas/curso.js — «Educarse»: los puntos que más golpean + rutas.
// #curso                → los 6 puntos de golpe
// #curso/1..6           → detalle de un punto con sus códigos y simulacro
// ============================================================
import { seccionPorCodigo } from "../../core/datos.js";
import { chip, escapar, breadcrumb, vistaVacia } from "../componentes.js";

function itemSeccion(codigo) {
  const s = seccionPorCodigo(codigo);
  const nombre = s?.nombre || (s?.tipo === "preambulo" ? "Preámbulo del capítulo" : "Abrir la sección");
  return `<a class="lista-item" href="#manual/${codigo}">
    ${chip(codigo, { plano: true })}
    <span class="lista-nombre">${escapar(nombre)}</span>
    <span class="lista-flecha" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </a>`;
}

function tarjetaPunto(p) {
  return `<a class="punto" href="#curso/${p.id}">
    <span class="punto-num" aria-hidden="true">${p.id}</span>
    <span class="punto-cuerpo">
      <b>${escapar(p.titulo)}</b>
      <small>${escapar(p.detalle)}</small>
    </span>
    <span class="lista-flecha" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </a>`;
}

function listado() {
  const curso = window.DEDILLO_CURSO;
  return `
    <header class="vista-cabecera"><h1>Educarse</h1><p class="vista-sub">Lo que más golpea al auditor en materia normativa, según el Manual.</p></header>
    <div class="lista">${curso.puntosGolpe.map(tarjetaPunto).join("")}</div>
    <section class="grupo"><h2>Rutas de estudio por fase</h2>
      <div class="lista">${curso.rutas
        .map(
          (r) => `<a class="lista-item lista-item-col" href="#manual/${r.tareas[0]}">
            <b>${escapar(r.titulo)}</b>
            <span class="chips">${r.tareas.map((t) => chip(t, { plano: true })).join("")}</span>
          </a>`,
        )
        .join("")}</div></section>`;
}

function detalle(id) {
  const punto = window.DEDILLO_CURSO.puntosGolpe.find((p) => p.id === Number(id));
  if (!punto) return vistaVacia("Punto no encontrado", "Elige uno de los seis puntos de golpe.", `<a class="boton" href="#curso">Volver</a>`);
  return `
    ${breadcrumb([{ texto: "Educarse", href: "#curso" }, { texto: punto.titulo }])}
    <article class="seccion punto-detalle">
      <header class="seccion-cabecera"><span class="punto-num punto-num-grande" aria-hidden="true">${punto.id}</span>
        <h1>${escapar(punto.titulo)}</h1></header>
      <p class="seccion-fase">${escapar(punto.detalle)}</p>
      <section class="grupo"><h2>Dónde está la norma</h2>
        <div class="lista">${punto.codigos.map(itemSeccion).join("")}</div></section>
      <section class="grupo"><h2>Examinar este punto</h2>
        <a class="boton" href="#examen/${punto.id}">Simulacro de «${escapar(punto.titulo)}»</a>
        <p class="grupo-nota">El simulacro puntúa y te devuelve a la sección exacta cuando fallas.</p></section>
    </article>`;
}

export const render = (contenedor, estado, param) => {
  contenedor.innerHTML = param ? detalle(param) : listado();
};

export const eventos = () => {};
export const titulo = () => "Educarse";
