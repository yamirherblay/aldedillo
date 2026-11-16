// ============================================================
// sw.js — Service Worker de Al Dedillo (Fase 4, modo sin conexión).
//
// Estrategia: precache completo (~1.4 MB) en la primera visita.
// A partir de ahí la app vive sin internet (zona muerta de Cuba).
//
// AL ACTUALIZAR CONTENIDO (data/) O CÓDIGO: subir CACHE_VERSION
// en este mismo commit — si no, los usuarios siguen viendo el
// caché viejo hasta que el SW nuevo se active.
// ============================================================

const CACHE_VERSION = "v7";
const CACHE_NOMBRE = `al-dedillo-${CACHE_VERSION}`;

const PRECACHE = [
  // páginas
  "index.html",
  "app.html",
  "manifest.webmanifest",
  // estilos y fuentes
  "css/tokens.css",
  "css/entrada.css",
  "css/app.css",
  "fonts/eb-garamond-600.woff2",
  "fonts/eb-garamond-700.woff2",
  "fonts/atkinson-hyperlegible-400.woff2",
  "fonts/atkinson-hyperlegible-700.woff2",
  // iconos
  "icons/icono.svg",
  "icons/icono-180.png",
  "icons/icono-192.png",
  "icons/icono-512.png",
  // lógica (entrada + core + ui)
  "js/entrada.js",
  "core/datos.js",
  "core/estado.js",
  "core/buscador.js",
  "core/texto.js",
  "core/examen.js",
  "ui/router.js",
  "ui/componentes.js",
  "ui/vistas/manual.js",
  "ui/vistas/plantillas.js",
  "ui/vistas/buscar.js",
  "ui/vistas/curso.js",
  "ui/vistas/plazos.js",
  "ui/vistas/glosario.js",
  "ui/vistas/progreso.js",
  "ui/vistas/examen.js",
  "ui/vistas/fuentes.js",
  // contenido (data-as-JS)
  "data/manual.js",
  "data/plantillas.js",
  "data/formularios.js",
  "data/constantes.js",
  "data/glosario.js",
  "data/preguntas.js",
  "data/curso.js",
  "data/fuentes.js",
];

// Página que corresponde a una navegación, como clave del caché.
// «/» y cualquier ruta desconocida caen en la entrada (index.html).
function paginaDe(url) {
  const ruta = new URL(url).pathname;
  return ruta.includes("app.html") ? "app.html" : "index.html";
}

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_NOMBRE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(claves.filter((k) => k !== CACHE_NOMBRE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const peticion = evento.request;

  if (peticion.method !== "GET") return;

  // ---- navegaciones (abrir o recargar una página) ----
  // Red primero: así el contenido se refresca en cuanto hay conexión.
  // Sin conexión, se sirve la página guardada en el caché.
  //
  // OJO: `peticion` YA es el Request. Nunca usar `peticion.request`
  // (es undefined): `fetch(undefined)` pedía «/undefined» y el 404 se
  // servía como la propia navegación (la página no cambiaba y no
  // había error en consola). Además, un Request de modo «navigate»
  // no es válido para fetch(): siempre pasar su URL como texto.
  if (peticion.mode === "navigate") {
    evento.respondWith(
      fetch(peticion.url)
        .then((respuesta) => {
          // refrescar la copia guardada de la página (sin query ni hash)
          if (respuesta && respuesta.ok) {
            const copia = respuesta.clone();
            caches
              .open(CACHE_NOMBRE)
              .then((cache) => cache.put(paginaDe(peticion.url), copia))
              .catch(() => {});
          }
          return respuesta;
        })
        .catch(() =>
          caches
            .match(peticion.url, { ignoreSearch: true })
            .then((enCache) => enCache || caches.match(paginaDe(peticion.url)))
            .then((respuesta) => respuesta || Response.error())
        )
    );
    return;
  }

  // ---- documentos Word de las plantillas (plantillas/*.docx) ----
  // Se guardan la primera vez que se descargan: así quedan disponibles
  // sin conexión sin inflar el precache inicial (son ~150 archivos).
  if (new URL(peticion.url).pathname.includes("/plantillas/")) {
    evento.respondWith(
      caches.match(peticion, { ignoreSearch: true }).then(
        (enCache) =>
          enCache ||
          fetch(peticion).then((respuesta) => {
            if (respuesta && respuesta.ok) {
              const copia = respuesta.clone();
              caches
                .open(CACHE_NOMBRE)
                .then((cache) => cache.put(peticion, copia))
                .catch(() => {});
            }
            return respuesta;
          })
      )
    );
    return;
  }

  // ---- recursos (js, css, fuentes, iconos, manifest) ----
  // Caché primero; si no está, la red.
  evento.respondWith(
    caches
      .match(peticion, { ignoreSearch: true })
      .then((enCache) => enCache || fetch(peticion))
  );
});
