// ============================================================
// core/datos.js — acceso e índices sobre los datos de data/ (patrón data-as-JS).
// Lógica pura: nada de DOM aquí.
// ============================================================

let indiceManual = null;
let indicePlantillas = null;
let indiceTextos = null;
let fusion = null;

export function manual() {
  return window.DEDILLO_MANUAL;
}

export function seccionesManual() {
  return manual().secciones;
}

export function plantillas() {
  return fusionarDuplicados();
}

/** El Tomo II tiene formularios que la Gaceta publicó en dos partes (mismo
 *  código, distinta página). Se presentan como una sola plantilla con la
 *  segunda parte a continuación; los archivos de data/ no se tocan. */
function fusionarDuplicados() {
  if (!fusion) {
    const porCodigo = new Map();
    fusion = [];
    for (const p of window.DEDILLO_PLANTILLAS) {
      const previa = porCodigo.get(p.codigo);
      if (!previa) {
        porCodigo.set(p.codigo, p);
        fusion.push(p);
      } else {
        previa.texto += `\nGaceta, página ${p.pagina}\n${p.texto}`;
      }
    }
  }
  return fusion;
}

export function glosario() {
  return window.DEDILLO_GLOSARIO.terminos;
}

export function preguntas() {
  return window.DEDILLO_PREGUNTAS.preguntas;
}

export function constantes() {
  return window.DEDILLO_CONSTANTES;
}

export function fuentes() {
  return window.DEDILLO_FUENTES;
}

/** Sección del Tomo I por código exacto. */
export function seccionPorCodigo(codigo) {
  if (!indiceManual) {
    indiceManual = new Map(seccionesManual().map((s) => [s.codigo, s]));
  }
  return indiceManual.get(codigo) || null;
}

/** Plantilla por código exacto. */
export function plantillaPorCodigo(codigo) {
  if (!indicePlantillas) {
    indicePlantillas = new Map(plantillas().map((p) => [p.codigo, p]));
  }
  return indicePlantillas.get(codigo) || null;
}

/** ¿Existe el código en cualquiera de los dos tomos? */
export function existeCodigo(codigo) {
  return Boolean(seccionPorCodigo(codigo) || plantillaPorCodigo(codigo));
}

/** Destino de navegación de un código (chip clicable). */
export function rutaDeCodigo(codigo) {
  return seccionPorCodigo(codigo) ? `#manual/${codigo}` : `#plantillas/${codigo}`;
}

/** Todos los códigos válidos (para detectar menciones dentro de los textos). */
export function codigosValidos() {
  return new Set([...seccionesManual().map((s) => s.codigo), ...plantillas().map((p) => p.codigo)]);
}

/** Índice plano para el buscador: {tipo, codigo, nombre, texto, pagina}. */
export function indiceTextosBusqueda() {
  if (indiceTextos) return indiceTextos;
  indiceTextos = [
    ...seccionesManual().map((s) => ({
      tipo: "manual", codigo: s.codigo, nombre: s.nombre || s.codigo,
      texto: s.texto || "", pagina: s.pagina,
    })),
    ...plantillas().map((p) => ({
      tipo: "plantilla", codigo: p.codigo, nombre: p.nombre,
      texto: p.texto || "", pagina: p.pagina,
    })),
    ...glosario().map((t) => ({
      tipo: "glosario", codigo: t.ref, nombre: t.termino,
      texto: t.definicion, pagina: t.pag,
    })),
  ];
  return indiceTextos;
}

/** Hijos de una sección del Tomo I (tareas de una fase, acciones del capítulo). */
export function hijosDe(codigo) {
  const secciones = seccionesManual();
  const i = secciones.findIndex((s) => s.codigo === codigo);
  const siguientes = [];
  for (let k = i + 1; k < secciones.length; k++) {
    const s = secciones[k];
    if (!s.codigo.startsWith(codigo + "-")) break;
    siguientes.push(s);
  }
  return siguientes;
}

/** Predecesor y sucesor de una sección dentro de su grupo (hermanos). */
export function vecinosDe(codigo) {
  let base = null;
  if (/^H-001-\d{4}-\d{2}$/.test(codigo)) base = codigo.slice(0, 10);        // tareas de una fase
  else if (/^H-002-APC\d{2}$/.test(codigo)) base = "H-002-APC";               // acciones del capítulo II
  else if (/^H-001-\d{4}$/.test(codigo)) base = "H-001";                      // fases entre sí
  if (!base) return { anterior: null, siguiente: null };
  const grupo = hijosDe(base);
  const i = grupo.findIndex((s) => s.codigo === codigo);
  if (i === -1) return { anterior: null, siguiente: null };
  return { anterior: i > 0 ? grupo[i - 1] : null, siguiente: i < grupo.length - 1 ? grupo[i + 1] : null };
}
