// ============================================================
// sw.js — Service Worker de Al Dedillo (Fase 4, modo sin conexión).
//
// Estrategia: cache-first con precache completo (~1.4 MB).
// La primera visita llena el caché; a partir de ahí la app vive
// sin internet (zona muerta de Cuba).
//
// AL ACTUALIZAR CONTENIDO (data/) O CÓDIGO: subir CACHE_VERSION
// en este mismo commit — si no, los usuarios siguen viendo el
// caché viejo hasta que el SW nuevo se active.
// ============================================================

const CACHE_VERSION = "v1";
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
  "data/constantes.js",
  "data/glosario.js",
  "data/preguntas.js",
  "data/curso.js",
  "data/fuentes.js",
];

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

  // navegaciones (recargar / abrir la app sin conexión): primero caché;
  // si no está precacheada (p. ej. «/»), cae a la página que corresponde
  if (peticion.mode === "navigate") {
    evento.respondWith(
      caches.match(peticion.request).then((enCache) => {
        if (enCache) return enCache;
        return fetch(peticion.request).catch(() => {
          const esApp = new URL(peticion.request.url).pathname.includes("app.html");
          return caches.match(esApp ? "app.html" : "index.html");
        });
      })
    );
    return;
  }

  // recursos: primero el caché; si no está, la red
  evento.respondWith(
    caches.match(peticion.request, { ignoreSearch: true }).then((enCache) => enCache || fetch(peticion))
  );
});
