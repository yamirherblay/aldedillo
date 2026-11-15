// ============================================================
// core/buscador.js — búsqueda de texto completo offline.
// normalizar() conserva la longitud del texto (quita acentos, baja a
// minúsculas), así que las posiciones en el texto normalizado
// coinciden con las del original: el resaltado es exacto.
// ============================================================
import { indiceTextosBusqueda } from "./datos.js";

/** minúsculas sin acentos, longitud idéntica al texto original */
export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

let cache = null;
function indice() {
  if (cache) return cache;
  cache = indiceTextosBusqueda().map((e) => {
    const original = `${e.codigo} ${e.nombre} ${e.texto}`;
    return { ...e, original, busca: normalizar(original) };
  });
  return cache;
}

/**
 * Busca por términos (todos deben estar presentes).
 * Devuelve [{tipo, codigo, nombre, pagina, fragmento, resaltar}] ordenado por
 * relevancia: fragmento es texto original alrededor del primer acierto,
 * resaltar = [inicio, fin] del acierto en coordenadas del fragmento.
 */
export function buscar(consulta, limite = 30) {
  const terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (terminos.length === 0) return [];

  const resultados = [];
  for (const e of indice()) {
    let puntaje = 0;
    let primero = -1;
    let valido = true;
    for (const t of terminos) {
      const pos = e.busca.indexOf(t);
      if (pos === -1) { valido = false; break; }
      if (primero === -1 || pos < primero) primero = pos;
      puntaje += 1 + Math.min(e.busca.split(t).length - 1, 5);
      // aciertos en el código o el nombre pesan más
      if (pos < normalizar(`${e.codigo} ${e.nombre}`).length) puntaje += 4;
    }
    if (!valido) continue;

    const CONTEXTO = 90;
    const desde = Math.max(0, primero - CONTEXTO);
    const hasta = Math.min(e.original.length, primero + CONTEXTO * 2);
    const tresPuntos = desde > 0 ? "…" : "";
    resultados.push({
      tipo: e.tipo,
      codigo: e.codigo,
      nombre: e.nombre,
      pagina: e.pagina,
      fragmento: `${tresPuntos}${e.original.slice(desde, hasta).trimEnd()}`,
      resaltar: [
        primero - desde + tresPuntos.length,
        primero - desde + (terminos.reduce((a, t) => Math.max(a, t.length), 0)) + tresPuntos.length,
      ],
      href: e.tipo === "glosario" ? "#glosario" : `${e.tipo === "manual" ? "#manual/" : "#plantillas/"}${e.codigo}`,
    });
  }
  resultados.sort((a, b) => b.puntaje - a.puntaje);
  return resultados.slice(0, limite);
}
