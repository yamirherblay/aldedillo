// ============================================================
// core/examen.js — motor del simulacro. Lógica pura: nada de DOM.
// Lee el banco de data/preguntas.js (nunca hardcodea preguntas).
// Se adapta al tamaño del banco: hoy 6 preguntas (16,7 pts c/u),
// cuando los auditores validen el banco de 20 → 20 × 5 pts.
// ============================================================
import { constantes, preguntas } from "./datos.js";

/** Configuración del examen. Sin argumento: el banco completo (20×5 cuando
 *  el banco llegue). Con n: puntos proporcionales (examen por punto de golpe). */
export function configuracion(n = null) {
  const c = constantes().examen;
  const total = n ?? Math.min(c.preguntasPorExamen, preguntas().length);
  return {
    preguntas: total,
    puntosPorPregunta: total > 0 ? 100 / total : 0,
    aprobado: c.aprobado,
  };
}

/** Preguntas por índice (o filtradas por punto de golpe 1..6). */
export function bancoFiltrado(punto = null) {
  const banco = preguntas();
  if (!punto) return banco;
  const delPunto = banco.filter((q) => q.puntoGolpe === Number(punto));
  return delPunto.length ? delPunto : banco;
}

/** Crea una sesión: baraja y toma n preguntas. rng inyectable para pruebas. */
export function crearSesion(punto = null, rng = Math.random) {
  const candidatas = [...bancoFiltrado(punto)];
  for (let i = candidatas.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [candidatas[i], candidatas[j]] = [candidatas[j], candidatas[i]];
  }
  const n = Math.min(constantes().examen.preguntasPorExamen, candidatas.length);
  return {
    punto: punto ? Number(punto) : null,
    ids: candidatas.slice(0, n).map((q) => q.id),
    actual: 0,
    respuestas: [], // {id, elegida, acierto}
    estado: "en_curso", // en_curso | terminado
  };
}

export function preguntaDe(sesion, indice = sesion.actual) {
  const banco = preguntas();
  const porId = new Map(banco.map((q) => [q.id, q]));
  return porId.get(sesion.ids[indice]) || null;
}

/** Registra la respuesta del índice actual (sin mutar: devuelve cambios).
 *  NO avanza la pregunta: la retroalimentación se muestra donde se está;
 *  el botón «Siguiente» de la vista es quien avanza (o termina). */
export function responder(sesion, elegida) {
  const q = preguntaDe(sesion);
  const acierto = q ? elegida === q.correcta : false;
  const respuestas = [...sesion.respuestas, { id: sesion.ids[sesion.actual], elegida, acierto }];
  const esUltima = sesion.respuestas.length + 1 >= sesion.ids.length;
  return {
    sesion: {
      ...sesion,
      respuestas,
      estado: esUltima ? "ultima" : "en_curso",
    },
    acierto,
  };
}

/** ¿La pregunta actual de la sesión ya fue respondida? */
export function respondidaActual(sesion) {
  return Boolean(sesion.respuestas[sesion.actual]);
}

/** Resultado de la sesión: puntaje (0..100), aprueba y desglose.
 *  Los puntos salen del tamaño de ESTA sesión (un examen por punto de
 *  golpe de 2 preguntas vale 50 cada una, no 16,7). */
export function calificar(sesion) {
  const conf = configuracion(sesion.ids.length);
  const detalle = sesion.respuestas.map((r) => ({ ...r, pregunta: preguntaDe(sesion, sesion.ids.indexOf(r.id)) }));
  const aciertos = sesion.respuestas.filter((r) => r.acierto).length;
  const puntaje = Math.round(aciertos * conf.puntosPorPregunta * 10) / 10;
  return {
    puntaje,
    maximo: 100,
    aciertos,
    fallos: sesion.respuestas.length - aciertos,
    aprueba: puntaje >= conf.aprobado,
    detalle,
  };
}
