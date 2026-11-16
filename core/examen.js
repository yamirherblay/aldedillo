// ============================================================
// core/examen.js — motor del simulacro. Lógica pura: nada de DOM.
// Lee el banco de data/preguntas.js (nunca hardcodea preguntas).
// El examen completo mezcla 8 situacionales, 8 de contenido y
// 4 de plazos; las prácticas por categoría o punto toman hasta 20.
// ============================================================
import { categoriasPreguntas, constantes, metaPreguntas, preguntas } from "./datos.js";

const CUOTAS_EXAMEN = Object.freeze({ situacional: 8, contenido: 8, plazos: 4 });
const CATEGORIAS = new Set(categoriasPreguntas().map((c) => c.id));

/** Configuración del examen. Sin argumento: 20 preguntas a 5 puntos.
 *  Con n: puntos proporcionales para una práctica filtrada. */
export function configuracion(n = null) {
  const c = constantes().examen;
  const banco = preguntas().length;
  const total = n ?? Math.min(c.preguntasPorExamen, banco);
  return {
    preguntas: total,
    puntosPorPregunta: total > 0 ? 100 / total : 0,
    aprobado: c.aprobado,
    banco,
  };
}

/** Cuotas del examen completo. Se exponen para que la vista explique la mezcla. */
export function cuotasExamen() {
  return { ...CUOTAS_EXAMEN };
}

/** Preguntas por índice (o filtradas por punto de golpe 1..6). */
export function bancoFiltrado(punto = null) {
  const banco = preguntas();
  if (!punto) return banco;
  const delPunto = banco.filter((q) => q.puntoGolpe === Number(punto));
  return delPunto.length ? delPunto : banco;
}

/** Preguntas de una categoría. Si la categoría no existe, devuelve el banco
 *  completo para que una ruta antigua no deje la sesión vacía. */
export function bancoPorCategoria(categoria = null) {
  const banco = preguntas();
  if (!categoria) return banco;
  const deCategoria = banco.filter((q) => q.categoria === categoria);
  return deCategoria.length ? deCategoria : banco;
}

/** Interpreta el parámetro del hash: un número es punto de golpe; un texto
 *  conocido es categoría. Devuelve ambos campos normalizados. */
export function interpretarFiltro(param = null) {
  if (param === null || param === undefined || param === "") return { punto: null, categoria: null };
  const texto = String(param);
  if (/^\d+$/.test(texto)) {
    const punto = Number(texto);
    return { punto: punto >= 1 && punto <= 6 ? punto : null, categoria: null };
  }
  return { punto: null, categoria: CATEGORIAS.has(texto) ? texto : null };
}

/** Título legible de una categoría. */
export function tituloCategoria(categoria) {
  return categoriasPreguntas().find((c) => c.id === categoria)?.titulo || categoria;
}

/** Versión del banco: sirve para invalidar sesiones guardadas con IDs viejos. */
export function versionBanco() {
  return metaPreguntas().bancoVersion || "0";
}

/** Una sesión guardada solo es reutilizable si pertenece a este banco y todos
 *  sus IDs siguen existiendo. Evita pantallas rotas tras cambiar preguntas. */
export function sesionEsValida(sesion) {
  if (!sesion || !Array.isArray(sesion.ids) || sesion.ids.length === 0) return false;
  if (sesion.bancoVersion !== versionBanco()) return false;
  const ids = new Set(preguntas().map((q) => q.id));
  return sesion.ids.every((id) => ids.has(id));
}

function barajar(lista, rng) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function tomar(lista, cantidad) {
  return lista.slice(0, Math.max(0, cantidad));
}

/** Mezcla estratificada del examen completo. Si una categoría no alcanza su
 *  cuota, el faltante se completa con preguntas del resto del banco. */
function seleccionarExamenCompleto(rng) {
  const total = Math.min(constantes().examen.preguntasPorExamen, preguntas().length);
  const elegidas = [];
  const usados = new Set();

  for (const [categoria, cuota] of Object.entries(CUOTAS_EXAMEN)) {
    const disponibles = barajar(
      preguntas().filter((q) => q.categoria === categoria && !usados.has(q.id)),
      rng,
    );
    for (const q of tomar(disponibles, cuota)) {
      elegidas.push(q);
      usados.add(q.id);
    }
  }

  if (elegidas.length < total) {
    const resto = barajar(preguntas().filter((q) => !usados.has(q.id)), rng);
    elegidas.push(...tomar(resto, total - elegidas.length));
  }

  return barajar(elegidas, rng).slice(0, total);
}

/** Crea una sesión: baraja y toma hasta 20 preguntas del filtro. Sin filtro,
 *  usa la mezcla 8/8/4. rng es inyectable para las pruebas. */
export function crearSesion(filtro = null, rng = Math.random) {
  const { punto, categoria } = interpretarFiltro(filtro);
  const total = constantes().examen.preguntasPorExamen;
  let seleccion;

  if (punto || categoria) {
    const candidatas = punto ? bancoFiltrado(punto) : bancoPorCategoria(categoria);
    seleccion = tomar(barajar(candidatas, rng), Math.min(total, candidatas.length));
  } else {
    seleccion = seleccionarExamenCompleto(rng);
  }

  return {
    punto,
    categoria,
    bancoVersion: versionBanco(),
    ids: seleccion.map((q) => q.id),
    actual: 0,
    respuestas: [], // {id, elegida, acierto}
    estado: "en_curso", // en_curso | ultima | terminado
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
 *  Los puntos salen del tamaño de ESTA sesión (una práctica de 2 preguntas
 *  vale 50 cada una, no 5). */
export function calificar(sesion) {
  const conf = configuracion(sesion.ids.length);
  const detalle = sesion.respuestas.map((r) => ({
    ...r,
    pregunta: preguntaDe(sesion, sesion.ids.indexOf(r.id)),
  }));
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
