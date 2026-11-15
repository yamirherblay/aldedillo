// ============================================================
// ui/vistas/fuentes.js — cita de la norma + aviso legal.
// #fuentes
// ============================================================
import { fuentes } from "../../core/datos.js";
import { escapar } from "../componentes.js";

export const render = (contenedor) => {
  const f = fuentes();
  contenedor.innerHTML = `
    <header class="vista-cabecera"><h1>Fuentes</h1></header>
    <section class="grupo">
      <div class="lista-item lista-item-col fuente-principal">
        <b>${escapar(f.principal.titulo)}</b>
        <p class="lista-detalle">${escapar(f.principal.organismo)}</p>
        <p class="lista-detalle">${escapar(f.principal.publicacion)}</p>
        <p class="lista-detalle">${escapar(f.principal.notas || "")}</p>
        <a class="boton" href="${f.principal.descarga}" target="_blank" rel="noopener">Gaceta Oficial de Cuba</a>
      </div>
    </section>
    <section class="grupo">
      <p class="grupo-nota">${escapar(f.disclaimer)}</p>
    </section>`;
};

export const eventos = () => {};
export const titulo = () => "Fuentes";
