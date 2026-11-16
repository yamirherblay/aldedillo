// ============================================================
// ui/vistas/examen.js — simulacro con retroalimentación (Fase 3).
// #examen              → examen completo (8 situacionales + 8 contenido + 4 plazos)
// #examen/situacional  → práctica por categoría
// #examen/contenido
// #examen/plazos
// #examen/1..6         → práctica por punto de golpe
// Estados de la sesión (core/examen.js):
//   en_curso → hay preguntas por responder (la actual puede estar ya
//              respondida: entonces se muestra su retroalimentación)
//   ultima   → respondida la última: feedback y botón «Ver resultado»
//   terminado→ resultado final (ya contabilizado en el progreso)
// La sesión vive en el store central y persiste entre recargas.
// ============================================================
import {
  bancoFiltrado,
  bancoPorCategoria,
  calificar,
  configuracion,
  crearSesion,
  cuotasExamen,
  interpretarFiltro,
  preguntaDe,
  responder,
  respondidaActual,
  sesionEsValida,
  tituloCategoria,
} from "../../core/examen.js";
import { categoriasPreguntas } from "../../core/datos.js";
import { actualizarEstado } from "../../core/estado.js";
import { chip, escapar } from "../componentes.js";

const reRender = () => window.dispatchEvent(new Event("dedillo:renderizar"));
const rutaSesion = (sesion) =>
  `#examen${sesion?.punto ? "/" + sesion.punto : sesion?.categoria ? "/" + sesion.categoria : ""}`;

function chipReferencia(q) {
  const ref = q.referencia || {};
  const pag = ref.pagina ? `<span class="pag-gaceta">p. ${ref.pagina}</span>` : "";
  if (ref.codigo && ref.codigo !== "intro") return `${chip(ref.codigo)} ${pag}`;
  return `<span class="chip">Manual</span> ${pag}`;
}

function botonesCategorias() {
  return categoriasPreguntas()
    .map((c) => {
      const total = bancoPorCategoria(c.id).length;
      return `<a class="boton boton-secundario" href="#examen/${c.id}">${escapar(c.titulo)} · ${total}</a>`;
    })
    .join("");
}

function intro(param) {
  const conf = configuracion();
  const { punto, categoria } = interpretarFiltro(param);
  const puntoInfo = punto
    ? window.DEDILLO_CURSO.puntosGolpe.find((p) => p.id === Number(punto))
    : null;
  const categoriaInfo = categoria
    ? categoriasPreguntas().find((c) => c.id === categoria)
    : null;
  const disponibles = punto
    ? bancoFiltrado(punto).length
    : categoria
      ? bancoPorCategoria(categoria).length
      : conf.banco;
  const cantidad = Math.min(conf.preguntas, disponibles);
  const puntos = Math.round(configuracion(cantidad).puntosPorPregunta * 10) / 10;
  const cuotas = cuotasExamen();
  const etiquetaCantidad = categoriaInfo
    ? "preguntas de la categoría"
    : puntoInfo
      ? "preguntas del punto"
      : "preguntas (8 + 8 + 4)";
  const contexto = puntoInfo
    ? `Enfocado en el punto ${puntoInfo.id}: «${escapar(puntoInfo.titulo)}».`
    : categoriaInfo
      ? `Práctica de «${escapar(categoriaInfo.titulo)}»: ${escapar(categoriaInfo.descripcion || "")}`
      : `Cada intento mezcla ${cuotas.situacional} situacionales, ${cuotas.contenido} de contenido y ${cuotas.plazos} de plazos.`;
  const textoBoton = puntoInfo
    ? "Comenzar este punto"
    : categoriaInfo
      ? "Comenzar esta categoría"
      : "Comenzar el examen";

  return `
    <header class="vista-cabecera"><h1>Examen</h1>
      <p class="vista-sub">Autoevaluación con retroalimentación exacta, al estilo del examen del SNA.</p></header>
    <section class="grupo">
      <div class="examen-reglas">
        <span class="lista-fila"><b class="plazo-cifra">${cantidad}</b><b>${etiquetaCantidad}</b></span>
        <span class="lista-fila"><b class="plazo-cifra">${puntos}</b><b>puntos cada una</b></span>
        <span class="lista-fila"><b class="plazo-cifra">${conf.aprobado}</b><b>para aprobar</b></span>
      </div>
      <p class="grupo-nota">${contexto}</p>
      <p class="grupo-nota">Cada respuesta se corrige al momento: aciertes o falles, verás la explicación y el chip que abre la sección exacta del Manual.</p>
      <a class="boton" data-accion="comenzar" href="${rutaSesion({ punto, categoria })}">${textoBoton}</a>
    </section>
    <section class="grupo">
      <h2>Practicar por categoría</h2>
      <p class="grupo-nota">Elige una categoría para estudiar por temas, o vuelve al examen completo cuando quieras.</p>
      <div class="examen-botones">${botonesCategorias()}</div>
    </section>
    <section class="grupo">
      <p class="grupo-nota">El banco tiene ${conf.banco} preguntas (marcadas «borrador-pendiente-validacion»): la validación de contenido la harán los auditores.</p>
    </section>`;
}

function desgloseCategorias(detalle) {
  const mapa = new Map();
  for (const d of detalle) {
    const categoria = d.pregunta?.categoria || "otras";
    const actual = mapa.get(categoria) || { ok: 0, total: 0 };
    actual.total += 1;
    if (d.acierto) actual.ok += 1;
    mapa.set(categoria, actual);
  }
  return [...mapa.entries()]
    .map(([categoria, datos]) => `<div class="desglose-fila">
        <span class="desglose-marca ${datos.ok === datos.total ? "ok" : "ko"}" aria-hidden="true">${datos.ok === datos.total ? "✓" : "•"}</span>
        <span class="desglose-cuerpo"><b>${escapar(tituloCategoria(categoria))}</b>
        <span class="grupo-nota">${datos.ok} de ${datos.total} correctas</span></span>
      </div>`)
    .join("");
}

function pregunta(sesion) {
  const conf = configuracion(sesion.ids.length);
  const q = preguntaDe(sesion);
  if (!q) {
    return `<section class="grupo"><h1>Sesión no disponible</h1>
      <p class="grupo-nota">El banco cambió y esta sesión ya no es válida.</p>
      <a class="boton" href="#examen">Volver al examen</a></section>`;
  }
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

  const contexto = sesion.punto
    ? ` · punto ${sesion.punto}`
    : sesion.categoria
      ? ` · ${escapar(tituloCategoria(sesion.categoria))}`
      : "";

  return `
    <header class="vista-cabecera"><h1>Pregunta ${sesion.actual + 1} de ${sesion.ids.length}</h1>
      <p class="vista-sub">${Math.round(conf.puntosPorPregunta * 10) / 10} puntos por pregunta · ${conf.aprobado} para aprobar${contexto}</p></header>
    <div class="progreso-barra examen-barra" role="progressbar" aria-valuenow="${avance}" aria-valuemin="0" aria-valuemax="100"><div class="progreso-relleno" style="width:${avance}%"></div></div>
    <article class="seccion">
      <header class="seccion-cabecera"><span class="chip">${escapar(q.id)}</span><span class="pag-gaceta">${escapar(tituloCategoria(q.categoria))} · ${escapar(q.dificultad)}</span></header>
      <p class="enunciado">${escapar(q.enunciado)}</p>
      <div class="opciones">${opciones}</div>
      ${feedback}
      <div class="examen-botones">${boton}</div>
    </article>`;
}

function resultado(sesion) {
  const r = calificar(sesion);
  const desglose = r.detalle
    .map((d) => {
      if (!d.pregunta) return "";
      return `<div class="desglose-fila">
        <span class="desglose-marca ${d.acierto ? "ok" : "ko"}" aria-hidden="true">${d.acierto ? "✓" : "✗"}</span>
        <span class="desglose-cuerpo"><b>${escapar(d.pregunta.enunciado)}</b>
        <span class="feedback-ref">${chipReferencia(d.pregunta)}</span></span>
      </div>`;
    })
    .join("");
  const porCategoria = desgloseCategorias(r.detalle);
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
    <section class="grupo"><h2>Por categoría</h2>${porCategoria}</section>
    <section class="grupo"><h2>Pregunta por pregunta</h2>${desglose}</section>
    <div class="examen-botones">
      <a class="boton" data-accion="comenzar" href="${rutaSesion(sesion)}">Otro intento</a>
      <a class="boton boton-secundario" data-accion="terminado" href="#progreso">Ver mi progreso</a>
    </div>`;
}

export const render = (contenedor, estado, param) => {
  if (estado.examenSesion && !sesionEsValida(estado.examenSesion)) {
    actualizarEstado({ examenSesion: null });
  }
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
