// ============================================================
// ui/vistas/plazos.js — «Plazos»: la escala visual (dolor #1).
// #plazos
// ============================================================
import { constantes } from "../../core/datos.js";
import { chip, escapar, escalaPlazos, parrafos } from "../componentes.js";

export const render = (contenedor) => {
  const c = constantes();
  const plazos = c.plazos;
  contenedor.innerHTML = `
    <header class="vista-cabecera"><h1>Plazos</h1><p class="vista-sub">Los términos del Manual, en días hábiles salvo indicación. Toca una marca o un chip para abrir la norma.</p></header>
    ${escalaPlazos()}
    <div class="lista">${plazos
      .map(
        (p) => `<a class="lista-item lista-item-col" href="${p.codigo.startsWith("H-") ? "#manual/" : "#plantillas/"}${p.codigo}">
          <span class="lista-fila">
            <b class="plazo-cifra">${p.dias}<small> ${p.unidad === "anios" ? "años" : "días háb."}</small></b>
            <b>${escapar(p.titulo)}</b>
          </span>
          <p class="lista-detalle">${escapar(p.detalle)}</p>
          ${chip(p.codigo, { plano: true })}
        </a>`,
      )
      .join("")}</div>`;
};

export const eventos = () => {};
export const titulo = () => "Plazos";
