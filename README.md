# Al Dedillo

**El SNA al dedillo: consulta, examina, certifícate.**

Herramienta de estudio y consulta para auditores del Sistema Nacional de Auditoría (Cuba),
basada en la Resolución 364/2023 de la Contraloría General de la República
(GOC-2023-980-O119): *Manual de procedimientos de las acciones de prevención y control*.

> Recopilación de estudio **sin valor oficial**. Toda información debe verificarse y
> contrastarse con la legislación vigente publicada en la Gaceta Oficial de la República de Cuba.

## Reglas del proyecto

Lee [`CONSTITUCION.md`](CONSTITUCION.md) antes de tocar el código.

## Estructura

```
al-dedillo/
├── index.html        ← Entrada (puerta única)
├── app.html          ← Shell de consulta
├── css/              tokens.css (claro/oscuro), entrada.css, app.css
├── js/               entrada.js (lógica de la puerta de entrada)
├── data/             manual.js, plantillas.js, preguntas.js, curso.js, constantes.js, fuentes.js
├── core/             Lógica pura (sin DOM): estado.js, examen.js, buscador.js, plazos.js
├── ui/               router.js, vistas/, componentes.js
├── tools/            extraer.py (genera data/ desde la Gaceta)
├── fonts/  icons/    Todo local — cero CDNs
└── sw.js             Service Worker (offline total)
```

## Stack

Vanilla HTML + CSS + JS (módulos ES). **Sin build.**

## Despliegue (Cloudflare Pages)

1. Conectar el repo `yamirherblay/aldedillo` en Cloudflare Pages.
2. Framework preset: **None** (no hay build). Build output directory: `/` (la raíz del repo es la raíz del sitio).
3. Desplegar. La actualización de contenido es reemplazar un archivo en `data/` y `git push` — sin recompilar.

## Actualización de contenido normativo

Los datos viven en `data/` con `version` y `fuente` en cada registro (p. ej. `GOC-2023-O119`).
Al cambiar la norma se actualiza el archivo de datos correspondiente; la lógica no se toca.
