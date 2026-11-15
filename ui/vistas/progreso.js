// ============================================================
// ui/vistas/progreso.js — avance local: secciones consultadas + examen.
// #progreso
// ============================================================
import { obtenerEstado, actualizarEstado } from "../../core/estado.js";
import { seccionesManual, plantillas } from "../../core/datos.js";
import { escapar } from "../componentes.js";

export const render = (contenedor, estado) => {
  const total = seccionesManual().length + plantillas().length;
  const vistos = estado.vistos.size;
  const porciento = Math.round((vistos / total) * 100);
  const e = estado.examen;
  const totalRespuestas = e.ok + e.ko;
  const acierto = totalRespuestas ? Math.round((e.ok / totalRespuestas) * 100) : 0;

  contenedor.innerHTML = `
    <header class="vista-cabecera"><h1>Progreso</h1><p class="vista-sub">Todo queda en tu dispositivo: nada viaja a ningún servidor.</p></header>

    <section class="grupo">
      <h2>Consulta del Manual</h2>
      <div class="progreso-caja">
        <div class="progreso-barra" role="progressbar" aria-valuenow="${porciento}" aria-valuemin="0" aria-valuemax="100">
          <div class="progreso-relleno" style="width:${porciento}%"></div>
        </div>
        <p>${vistos} de ${total} secciones y plantillas consultadas (${porciento} %)</p>
      </div>
    </section>

    <section class="grupo">
      <h2>Examen</h2>
      <div class="stats stats-fila">
        <span class="ok"><svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="m8.5 12.5 2.5 2.5 5-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ${e.ok}</span>
        <span class="ko"><svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="m9 9 6 6M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> ${e.ko}</span>
        <span>${acierto} % de acierto${totalRespuestas ? "" : " — sin exámenes aún"}</span>
      </div>
      <a class="boton" href="#examen">Ir al examen</a>
    </section>

    <section class="grupo">
      <h2>Datos</h2>
      <button class="boton boton-peligro" id="progreso-borrar" type="button">Reiniciar mi progreso</button>
      <p class="grupo-nota">Borra las secciones consultadas y los resultados de exámenes de este dispositivo.</p>
    </section>`;
};

export const eventos = (contenedor) => {
  // delegación: el botón se resuelve en cada clic (render() lo reemplaza)
  contenedor.addEventListener("click", (e) => {
    if (e.target.id !== "progreso-borrar") return;
    if (!window.confirm("¿Borrar tu progreso de consulta y exámenes?")) return;
    actualizarEstado({ vistos: new Set(), examen: { ok: 0, ko: 0 }, examenSesion: null });
    window.location.reload();
  });
};

export const titulo = () => "Progreso";
