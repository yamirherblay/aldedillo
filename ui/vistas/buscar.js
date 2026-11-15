// ============================================================
// ui/vistas/buscar.js — buscador de texto completo offline.
// #buscar (+ estado.termino se mantiene mientras se navega)
// ============================================================
import { buscar } from "../../core/buscador.js";
import { actualizarEstado, obtenerEstado } from "../../core/estado.js";
import { escapar, chip } from "../componentes.js";

function resultadoHtml(r) {
  const [ini, fin] = r.resaltar;
  const frag = escapar(r.fragmento);
  const marcado = `${frag.slice(0, ini)}<mark>${frag.slice(ini, fin)}</mark>${frag.slice(fin)}`;
  const tipoEtiqueta = r.tipo === "manual" ? "Manual" : r.tipo === "plantilla" ? "Plantilla" : "Glosario";
  return `<a class="resultado" href="${r.href}">
    <span class="resultado-meta">${chip(r.codigo, { plano: true })}<small>${tipoEtiqueta}${r.pagina ? " · p. " + r.pagina : ""}</small></span>
    <b>${escapar(r.nombre)}</b>
    <p>${marcado}</p>
  </a>`;
}

export const render = (contenedor, estado) => {
  // ?q= permite enlaces directos a la búsqueda (p. ej. desde el examen)
  const desdeUrl = new URLSearchParams(location.search).get("q");
  const termino = estado.termino || desdeUrl || "";
  const resultados = termino.trim().length >= 2 ? buscar(termino) : [];
  contenedor.innerHTML = `
    <header class="vista-cabecera"><h1>Buscar</h1><p class="vista-sub">En el Manual completo, las plantillas y el glosario — sin internet.</p></header>
    <div class="busca-caja">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15 15l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      <input id="busca-entrada" type="search" placeholder="Ej.: materialidad, cinco años, recurso de apelación…"
             value="${escapar(termino)}" autocomplete="off" enterkeyhint="search" aria-label="Buscar en el Manual">
    </div>
    <div id="busca-resultados" aria-live="polite">
      ${
        termino.trim().length < 2
          ? `<p class="busca-pista">Escribe al menos dos letras. Los resultados abren la sección exacta.</p>`
          : resultados.length
            ? resultados.map(resultadoHtml).join("")
            : `<p class="busca-pista">Sin resultados para «${escapar(termino)}». Prueba con otra palabra del Manual.</p>`
      }
    </div>`;
};

export const eventos = (contenedor) => {
  // delegación: los nodos se resuelven en cada evento (render() los reemplaza)
  contenedor.addEventListener("input", (e) => {
    if (e.target.id !== "busca-entrada") return;
    const entrada = e.target;
    const resultados = contenedor.querySelector("#busca-resultados");
    if (!resultados) return;
    clearTimeout(entrada._reloj);
    entrada._reloj = setTimeout(() => {
      const termino = entrada.value;
      actualizarEstado({ termino });
      const lista = termino.trim().length >= 2 ? buscar(termino) : [];
      resultados.innerHTML = lista.length
        ? lista.map(resultadoHtml).join("")
        : `<p class="busca-pista">Sin resultados para «${escapar(termino)}».</p>`;
    }, 120); // debounce según la constitución (entradas de alta frecuencia)
  });
};

export const titulo = () => "Buscar";
