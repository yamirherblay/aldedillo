// ============================================================
// ui/vistas/glosario.js — términos del Manual con su referencia.
// #glosario
// ============================================================
import { glosario } from "../../core/datos.js";
import { escapar, chip } from "../componentes.js";

export const render = (contenedor) => {
  const terminos = [...glosario()].sort((a, b) => a.termino.localeCompare(b.termino, "es"));
  contenedor.innerHTML = `
    <header class="vista-cabecera"><h1>Glosario</h1><p class="vista-sub">${terminos.length} términos del Manual, en orden alfabético.</p></header>
    <div class="lista">${terminos
      .map(
        (t) => `<a class="lista-item lista-item-col" href="#${t.ref.startsWith("P-") ? "plantillas" : "manual"}/${t.ref}">
          <b>${escapar(t.termino)}</b>
          <p class="lista-detalle">${escapar(t.definicion)}</p>
          ${chip(t.ref, { plano: true })}${t.pag ? `<span class="pag-gaceta">p. ${t.pag}</span>` : ""}
        </a>`,
      )
      .join("")}</div>`;
};

export const eventos = () => {};
export const titulo = () => "Glosario";
