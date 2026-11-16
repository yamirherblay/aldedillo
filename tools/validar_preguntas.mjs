// ============================================================
// tools/validar_preguntas.mjs — control de calidad del banco.
// Uso: node tools/validar_preguntas.mjs
// No modifica archivos. Sale con código 1 si encuentra errores.
// ============================================================
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errores = [];
const avisos = [];

function error(mensaje) {
  errores.push(mensaje);
}
function aviso(mensaje) {
  avisos.push(mensaje);
}
function cargar(archivo, nombre) {
  const codigo = fs.readFileSync(path.join(RAIZ, archivo), "utf8");
  const contexto = { window: {} };
  vm.createContext(contexto);
  vm.runInContext(codigo, contexto);
  return contexto.window[nombre];
}
function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const banco = cargar("data/preguntas.js", "DEDILLO_PREGUNTAS");
const manual = cargar("data/manual.js", "DEDILLO_MANUAL");
const constantes = cargar("data/constantes.js", "DEDILLO_CONSTANTES");

if (!banco || !Array.isArray(banco.preguntas)) {
  error("data/preguntas.js no expone un array preguntas.");
  console.error(errores.join("\n"));
  process.exit(1);
}

const preguntas = banco.preguntas;
const categorias = banco.categorias || [];
const idsCategoria = new Set(categorias.map((c) => c.id));
const manualPorCodigo = new Map((manual.secciones || []).map((s) => [s.codigo, s]));
const fases = new Set(["intro", "0001", "0002", "0003", "0004", "transversal", "APC"]);
const dificultades = new Set(["basica", "media", "alta"]);
const prefijos = { situacional: "SIT", contenido: "CON", plazos: "PLA" };
const ids = new Set();
const enunciados = new Set();
const respuestas = [0, 0, 0, 0];
const porCategoria = { situacional: 0, contenido: 0, plazos: 0 };
const porPunto = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
const coberturaContenido = new Set();
let muestras = 0;

if (!banco.meta?.bancoVersion) error("Falta meta.bancoVersion.");
if (banco.meta?.estado !== "borrador-pendiente-validacion") {
  aviso("meta.estado no es 'borrador-pendiente-validacion'.");
}
if (categorias.length !== 3) error("Deben existir exactamente 3 categorías en el banco.");
for (const categoria of categorias) {
  if (!prefijos[categoria.id]) error(`Categoría desconocida: ${categoria.id}`);
  if (!categoria.titulo) error(`La categoría ${categoria.id} no tiene título.`);
}

if (preguntas.length !== 100) error(`El banco debe tener 100 preguntas; tiene ${preguntas.length}.`);

for (const [indice, q] of preguntas.entries()) {
  const etiqueta = q.id || `índice ${indice}`;
  if (!q.id || !/^(SIT|CON|PLA)-\d{3}$/.test(q.id)) {
    error(`${etiqueta}: ID con formato inválido.`);
  } else if (ids.has(q.id)) {
    error(`${etiqueta}: ID duplicado.`);
  } else {
    ids.add(q.id);
  }
  if (!idsCategoria.has(q.categoria)) error(`${etiqueta}: categoría inválida (${q.categoria}).`);
  else {
    porCategoria[q.categoria] += 1;
    const prefijo = prefijos[q.categoria];
    if (q.id && !q.id.startsWith(`${prefijo}-`)) {
      error(`${etiqueta}: el prefijo no corresponde a la categoría ${q.categoria}.`);
    }
  }
  if (!q.tema || typeof q.tema !== "string") error(`${etiqueta}: falta tema.`);
  if (!Number.isInteger(q.puntoGolpe) || q.puntoGolpe < 1 || q.puntoGolpe > 6) {
    error(`${etiqueta}: puntoGolpe debe ser entero 1..6.`);
  } else {
    porPunto[q.puntoGolpe] += 1;
  }
  if (!fases.has(q.fase)) error(`${etiqueta}: fase inválida (${q.fase}).`);
  if (!dificultades.has(q.dificultad)) error(`${etiqueta}: dificultad inválida (${q.dificultad}).`);
  if (!q.enunciado || q.enunciado.length < 25) error(`${etiqueta}: enunciado demasiado corto.`);
  if (q.enunciado && q.enunciado.length > 420) aviso(`${etiqueta}: enunciado largo (${q.enunciado.length} caracteres).`);
  if (q.enunciado) {
    const clave = normalizar(q.enunciado);
    if (enunciados.has(clave)) error(`${etiqueta}: enunciado duplicado.`);
    enunciados.add(clave);
  }
  if (!Array.isArray(q.opciones) || q.opciones.length !== 4) {
    error(`${etiqueta}: debe tener exactamente 4 opciones.`);
  } else {
    const opcionesNormalizadas = q.opciones.map(normalizar);
    if (new Set(opcionesNormalizadas).size !== 4) error(`${etiqueta}: opciones duplicadas.`);
    if (q.opciones.some((o) => !String(o).trim())) error(`${etiqueta}: hay una opción vacía.`);
    const juntas = opcionesNormalizadas.join(" ");
    if (juntas.includes("todas las anteriores") || juntas.includes("ninguna de las anteriores")) {
      aviso(`${etiqueta}: usa una opción del tipo 'todas/ninguna de las anteriores'.`);
    }
  }
  if (!Number.isInteger(q.correcta) || q.correcta < 0 || q.correcta > 3) {
    error(`${etiqueta}: correcta debe ser un índice 0..3.`);
  } else {
    respuestas[q.correcta] += 1;
  }
  if (!q.explicacion || q.explicacion.length < 20) error(`${etiqueta}: explicación demasiado corta.`);
  const ref = q.referencia || {};
  if (ref.tomo !== "I") error(`${etiqueta}: referencia.tomo debe ser 'I'.`);
  if (!ref.codigo) error(`${etiqueta}: falta referencia.codigo.`);
  if (!Number.isInteger(ref.pagina)) error(`${etiqueta}: referencia.pagina debe ser un entero.`);
  if (ref.codigo && ref.codigo !== "intro") {
    const seccion = manualPorCodigo.get(ref.codigo);
    if (!seccion) error(`${etiqueta}: el código ${ref.codigo} no existe en el Manual.`);
    else if (seccion.pagina !== ref.pagina) {
      error(`${etiqueta}: página ${ref.pagina} no coincide con ${ref.codigo} (${seccion.pagina}).`);
    }
    if (q.categoria === "contenido") coberturaContenido.add(ref.codigo);
  } else if (ref.codigo === "intro" && ref.pagina !== 3252) {
    aviso(`${etiqueta}: la introducción se referencia con página ${ref.pagina}; se esperaba 3252.`);
  }
  if (q.muestra === true) muestras += 1;
}

const esperadoCategoria = { situacional: 40, contenido: 40, plazos: 20 };
for (const [categoria, esperado] of Object.entries(esperadoCategoria)) {
  if (porCategoria[categoria] !== esperado) {
    error(`Categoría ${categoria}: ${porCategoria[categoria]} preguntas; se esperaban ${esperado}.`);
  }
}
for (const [punto, cantidad] of Object.entries(porPunto)) {
  if (cantidad === 0) error(`El punto de golpe ${punto} no tiene preguntas.`);
  if (cantidad > 20) aviso(`El punto de golpe ${punto} tiene ${cantidad} preguntas; la práctica tomará 20.`);
}
if (muestras !== 1) error(`Debe haber exactamente una pregunta con muestra:true; hay ${muestras}.`);

const secciones = manual.secciones || [];
const faltantes = secciones.map((s) => s.codigo).filter((codigo) => !coberturaContenido.has(codigo));
if (faltantes.length) {
  error(`Cobertura de contenido incompleta. Faltan: ${faltantes.join(", ")}`);
}

for (let i = 0; i < respuestas.length; i++) {
  if (respuestas[i] < 15 || respuestas[i] > 35) {
    error(`Respuesta correcta ${String.fromCharCode(97 + i)}: ${respuestas[i]} preguntas (se esperaba entre 15 y 35).`);
  }
}

// ------- simulación del motor (transformando el módulo para vm) -------
function probarMotor() {
  const fuente = fs
    .readFileSync(path.join(RAIZ, "core/examen.js"), "utf8")
    .replace(/^import[^\n]+\n/m, "")
    .replace(/\bexport function /g, "function ");
  const contexto = {
    preguntas: () => banco.preguntas,
    constantes: () => constantes,
    categoriasPreguntas: () => banco.categorias || [],
    metaPreguntas: () => banco.meta || {},
  };
  vm.createContext(contexto);
  vm.runInContext(
    `${fuente}\nthis.__api = { configuracion, cuotasExamen, bancoFiltrado, bancoPorCategoria, interpretarFiltro, versionBanco, sesionEsValida, crearSesion, preguntaDe, responder, respondidaActual, calificar };`,
    contexto,
  );
  const api = contexto.__api;
  let semilla = 123456789;
  const rng = () => {
    semilla = (1103515245 * semilla + 12345) % 2147483648;
    return semilla / 2147483648;
  };
  const conf = api.configuracion();
  if (conf.preguntas !== 20) error(`Motor: examen completo debería tener 20 preguntas; tiene ${conf.preguntas}.`);
  if (Math.abs(conf.puntosPorPregunta - 5) > 0.0001) error("Motor: el examen completo debería valer 5 puntos por pregunta.");
  if (conf.banco !== 100) error(`Motor: el banco debería tener 100 preguntas; tiene ${conf.banco}.`);

  const sesion = api.crearSesion(null, rng);
  if (sesion.ids.length !== 20) error(`Motor: la sesión completa tiene ${sesion.ids.length} preguntas.`);
  if (new Set(sesion.ids).size !== sesion.ids.length) error("Motor: la sesión completa tiene IDs repetidos.");
  const cuenta = { situacional: 0, contenido: 0, plazos: 0 };
  for (const id of sesion.ids) {
    const q = banco.preguntas.find((p) => p.id === id);
    if (!q) error(`Motor: la sesión incluye un ID inexistente (${id}).`);
    else cuenta[q.categoria] += 1;
  }
  if (cuenta.situacional !== 8 || cuenta.contenido !== 8 || cuenta.plazos !== 4) {
    error(`Motor: mezcla completa incorrecta (${JSON.stringify(cuenta)}).`);
  }
  if (!api.sesionEsValida(sesion)) error("Motor: la sesión recién creada no pasa la validación.");
  if (api.sesionEsValida({ ...sesion, bancoVersion: "vieja" })) error("Motor: no invalida una sesión de otra versión.");
  if (api.sesionEsValida({ ...sesion, ids: ["SIT-999"] })) error("Motor: no invalida una sesión con IDs inexistentes.");

  const sesionCategoria = api.crearSesion("situacional", rng);
  if (!sesionCategoria.ids.every((id) => banco.preguntas.find((q) => q.id === id)?.categoria === "situacional")) {
    error("Motor: la práctica por categoría mezcla categorías.");
  }
  if (sesionCategoria.ids.length !== 20) error("Motor: la práctica por categoría debería tomar 20 preguntas.");

  const sesionPunto = api.crearSesion("2", rng);
  if (!sesionPunto.ids.every((id) => banco.preguntas.find((q) => q.id === id)?.puntoGolpe === 2)) {
    error("Motor: la práctica por punto mezcla puntos.");
  }

  const respuestasPerfectas = sesion.ids.map((id) => {
    const q = banco.preguntas.find((p) => p.id === id);
    return { id, elegida: q.correcta, acierto: true };
  });
  const perfecta = api.calificar({ ...sesion, respuestas: respuestasPerfectas });
  if (perfecta.puntaje !== 100 || !perfecta.aprueba || perfecta.aciertos !== 20) {
    error(`Motor: una sesión perfecta debería dar 100 y aprobar (${JSON.stringify(perfecta)}).`);
  }
  const cero = api.calificar({
    ...sesion,
    respuestas: sesion.ids.map((id, i) => ({ id, elegida: -1, acierto: false, i })),
  });
  if (cero.puntaje !== 0 || cero.aprueba) error("Motor: una sesión con todo mal debería dar 0 y no aprobar.");
  const catorce = sesion.ids.map((id, i) => {
    const q = banco.preguntas.find((p) => p.id === id);
    return { id, elegida: i < 14 ? q.correcta : -1, acierto: i < 14 };
  });
  const justo = api.calificar({ ...sesion, respuestas: catorce });
  if (justo.puntaje !== 70 || !justo.aprueba) {
    error(`Motor: 14 de 20 debería dar 70 y aprobar (${justo.puntaje}, ${justo.aprueba}).`);
  }
}

probarMotor();

console.log("Banco:", preguntas.length, "preguntas");
console.log("Categorías:", porCategoria);
console.log("Puntos:", porPunto);
console.log("Respuestas correctas por letra:", respuestas);
console.log("Cobertura de contenido:", `${coberturaContenido.size}/${secciones.length}`, "secciones");
if (avisos.length) {
  console.log("\nAvisos:");
  for (const mensaje of avisos) console.log("  -", mensaje);
}
if (errores.length) {
  console.error("\nErrores:");
  for (const mensaje of errores) console.error("  -", mensaje);
  process.exit(1);
}
console.log("\nOK: esquema, referencias, cobertura y motor.");
