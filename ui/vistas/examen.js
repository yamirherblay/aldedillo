// ============================================================
// ui/vistas/examen.js — simulacro con retroalimentación (Fase 3).
// #examen        → intro o sesión en curso (persiste entre recargas)
// #examen/1..6   → simulacro enfocado en un punto de golpe
// Estados de la sesión (core/examen.js):
//   en_curso → hay preguntas por responder (la actual puede estar ya
//              respondida: entonces se muestra su retroalimentación)
//   ultima   → respondida la última: feedback y botón «Ver resultado»
//   terminado→ resultado final (ya contabilizado en el progreso)
// La sesión vive en el store central y persiste entre recargas.
// ============================================================
import { configuracion, crearSesion, responder, respondidaActual, calificar, preguntaDe, bancoFiltrado } from "../../core/examen.js";
import { actualizarEstado, obtenerEstado } from "../../core/estado.js";
import { chip, escapar } from "../componentes.js";

const reRender = () => window.dispatchEvent(new Event("dedillo:renderizar"));
const rutaSesion = (sesion) => `#examen${sesion?.punto ? "/" + sesion.punto : ""}`;

function chipReferencia(q) {
  const ref = q.referencia || {};
  const pag = ref.pagina ? `<span class="pag-gaceta">p. ${ref.pagina}</span>` : "";
  if (ref.codigo && ref.codigo !== "intro") return `${chip(ref.codigo)} ${pag}`;
  return `<span class="chip">Manual</span> ${pag}`;
}

function intro(param) {
  const conf = configuracion();
  const punto = param ? window.DEDILLO_CURSO.puntosGolpe.find((p) => p.id === Number(param)) : null;
  const cantidad = param ? bancoFiltrado(param).length : conf.preguntas;
  const puntos = Math.round(configuracion(cantidad).puntosPorPregunta * 10) / 10;
  return `
    <header class="vista-cabecera"><h1>Examen</h1>
      <p class="vista-sub">Autoevaluación con retroalimentación exacta, al estilo del examen del SNA.</p></header>
    <section class="grupo">
      <div class="examen-reglas">
        <span class="lista-fila"><b class="plazo-cifra">${cantidad}</b><b>preguntas al azar</b></span>
        <span class="lista-fila"><b class="plazo-cifra">${puntos}</b><b>puntos cada una</b></span>
        <span class="lista-fila"><b class="plazo-cifra">${conf.aprobado}</b><b>para aprobar</b></span>
      </div>
      ${punto ? `<p class="grupo-nota">Enfocado en el punto ${punto.id}: «${escapar(punto.titulo)}».</p>` : ""}
      <p class="grupo-nota">Cada respuesta se corrige al momento: aciertes o falles, verás la explicación y el chip que abre la sección exacta del Manual.</p>
      <a class="boton" data-accion="comenzar" href="${rutaSesion({ punto: punto?.id })}">Comenzar${punto ? " este punto" : " el examen"}</a>
      <p class="grupo-nota">El banco tiene ${conf.preguntas} preguntas (marcadas «borrador-pendiente-validacion»): crece cuando los auditores aprueben las restantes.</p>
    </section>`;
}

function pregunta(sesion) {
  const conf = configuracion(sesion.ids.length);
  const q = preguntaDe(sesion);
  const respondida = sesion.respuestas[sesion.actual];
  const esUltima = sesion.actual === sesion.ids.length - 1;
  const avance = Math.round((sesion.respuestas.length / sesion.ids.length) * 100);

  const opciones = q.opciones
    .map((op, i) => {
      let clase = "opcion";
      if (respondida) {
        if (i === q.correcta) clase += " opcion-correcta";
        else if (i === respondida.elegida) clase += " opcion-fallada";
      }
      return `<button class="${clase}" type="button" data-opcion="${i}" ${respondida ? "disabled" : ""}><span>${escapar(op)}</span></button>`;
    })
    .join("");

  const feedback = respondida
    ? `<div class="feedback ${respondida.acierto ? "feedback-ok" : "feedback-ko"}" role="status">
        <b>${respondida.acierto ? "Correcto." : "No es correcta."}</b>
        <p>${escapar(q.explicacion)}</p>
        <p class="feedback-ref">${chipReferencia(q)}</p>
      </div>`
    : "";

  const boton = respondida
    ? `<a class="boton" data-accion="siguiente" href="${rutaSesion(sesion)}">${esUltima ? "Ver mi resultado" : "Siguiente pregunta"}</a>
       <a class="boton boton-secundario" data-accion="abandonar" href="${rutaSesion(sesion)}">Abandonar</a>`
    : `<a class="boton boton-secundario" data-accion="abandonar" href="${rutaSesion(sesion)}">Abandonar</a>`;

  return `
    <header class="vista-cabecera"><h1>Pregunta ${sesion.actual + 1} de ${sesion.ids.length}</h1>
      <p class="vista-sub">${Math.round(conf.puntosPorPregunta * 10) / 10} puntos por pregunta · ${conf.aprobado} para aprobar${sesion.punto ? ` · punto ${sesion.punto}` : ""}</p></header>    <div class="progreso-barra examen-barra" role="progressbar" aria-valuenow="${avance}" aria-valuemin="0" aria-valuemax="100"><div class="progreso-relleno" style="width:${avance}%"></div></div>
    <article class="seccion">
      <header class="seccion-cabecera"><span class="chip">${escapar(q.id)}</span><span class="pag-gaceta">${escapar(q.dificultad)}</span></header>
      <p class="enunciado">${escapar(q.enunciado)}</p>
      <div class="opciones">${opciones}</div>
      ${feedback}
      <div class="examen-botones">${boton}</div>
    </article>`;
}

function resultado(sesion) {
  const r = calificar(sesion);
  const desglose = r.detalle
    .map((d) => `<div class="desglose-fila">
        <span class="desglose-marca ${d.acierto ? "ok" : "ko"}" aria-hidden="true">${d.acierto ? "✓" : "✗"}</span>
        <span class="desglose-cuerpo"><b>${escapar(d.pregunta.enunciado)}</b>
        <span class="feedback-ref">${chipReferencia(d.pregunta)}</span></span>
      </div>`)
    .join("");
  return `
    <header class="vista-cabecera"><h1>Resultado</h1></header>
    <section class="grupo">
      <div class="resultado-examen">
        <span class="puntaje-grande ${r.aprueba ? "aprobado" : "no-aprobado"}">${r.puntaje}</span>
        <div>
          <b>${r.aprueba ? "Aprobado" : "No aprobado"}</b>
          <p class="grupo-nota">${r.aciertos} de ${sesion.ids.length} respuestas correctas · se necesitan ${configuracion().aprobado} puntos.</p>
          ${r.aprueba ? "" : `<p class="grupo-nota">Repasa los fallos: cada chip abre la sección exacta del Manual.</p>`}
        </div>
      </div>
    </section>
    <section class="grupo"><h2>Pregunta por pregunta</h2>${desglose}</section>
    <div class="examen-botones">
      <a class="boton" data-accion="comenzar" href="${rutaSesion(sesion)}">Otro intento</a>
      <a class="boton boton-secundario" data-accion="terminado" href="#progreso">Ver mi progreso</a>
    </div>`;
}

export const render = (contenedor, estado, param) => {
  const sesion = estado.examenSesion;
  if (sesion && sesion.estado === "terminado") contenedor.innerHTML = resultado(sesion);
  else if (sesion) contenedor.innerHTML = pregunta(sesion);
  else contenedor.innerHTML = intro(param);
};

export const eventos = (contenedor, estado) => {
  contenedor.addEventListener("click", (e) => {
    const sesion = estado.examenSesion;

    // 1) responder la pregunta actual (los botones se deshabilitan al responder)
    const opcion = e.target.closest("[data-opcion]");
    if (opcion && sesion && sesion.estado !== "terminado" && !respondidaActual(sesion)) {
      actualizarEstado({ examenSesion: responder(sesion, Number(opcion.dataset.opcion)).sesion });
      reRender();
      return;
    }

    // 2) botones de acción
    const accion = e.target.closest("[data-accion]")?.dataset.accion;
    if (!accion) return;
    if (accion === "siguiente" && sesion && respondidaActual(sesion)) {
      if (sesion.estado === "ultima") {
        // único momento en que la sesión se contabiliza en el progreso
        const r = calificar(sesion);
        actualizarEstado({
          examen: { ok: estado.examen.ok + r.aciertos, ko: estado.examen.ko + r.fallos },
          examenSesion: { ...sesion, estado: "terminado" },
        });
      } else {
        actualizarEstado({ examenSesion: { ...sesion, actual: sesion.actual + 1 } });
      }
      reRender();
    } else if (accion === "comenzar") {
      const param = location.hash.split("/")[1] || null;
      actualizarEstado({ examenSesion: crearSesion(param) });
      reRender();
    } else if (accion === "abandonar") {
      if (window.confirm("¿Abandonar este examen? Se pierde el avance de esta sesión.")) {
        actualizarEstado({ examenSesion: null });
        reRender();
      }
    } else if (accion === "terminado" && sesion) {
      actualizarEstado({ examenSesion: null });
      // el enlace a #progreso navega por sí solo
    }
  });
};

export const titulo = () => "Examen";
