# Lo que hay hasta ahora — Al Dedillo

> Documento de estado para retomar el proyecto en cualquier sesión.
> Última actualización: 2026-11-14 · Fases 0–3 completadas y verificadas.
> Las reglas del proyecto viven en `CONSTITUCION.md` (cumplirlas siempre).

---

## 1. Qué es

**Al Dedillo** — PWA para los auditores del Sistema Nacional de Auditoría (Cuba):
consultar el Manual de procedimientos (Resolución 364/2023, GOC-2023-980-O119),
educarse con los puntos que más golpean y autoexaminarse con retroalimentación exacta.

- **Vanilla** HTML + CSS + JS (módulos ES). Sin build, sin framework, sin CDNs.
- Todo el texto visible en **español**. Iconos SVG inline (nunca emoji).
- Desplegable directo en Vercel; APK contemplada a futuro (Fase 5+).
- **El contenido se actualiza solo editando `data/`** — la lógica nunca necesita cambios para eso.

## 2. Cómo ejecutarlo

```bash
cd "al-dedillo"
python3 -m http.server 8642        # cualquier servidor estático sirve
# abrir: http://localhost:8642/index.html   (página de entrada)
#        http://localhost:8642/app.html     (app de consulta)
```

**Nunca abrir con doble clic (`file://`)**: los módulos ES no cargan; `app.html` ya muestra un aviso explicándolo.

Parámetros de QA (solo verificación, no afectan uso normal):

| Parám. | Efecto |
|---|---|
| `?tema=claro\|oscuro` | fuerza el tema (igual en entrada y app) |
| `?q=texto` + `#buscar` | enlaza directo a resultados de búsqueda |
| `?examen=demo\|ko\|fin` | siembra una sesión de examen para verificar el flujo sin clics |

## 3. Estado por fases

| Fase | Alcance | Estado |
|---|---|---|
| 0.0 | Estructura + Constitución | ✅ |
| 0 | Extracción del PDF → `data/` (31 secciones Tomo I, 91 plantillas Tomo II, constantes, fuentes, 6 preguntas, curso) | ✅ — pendiente validación humana |
| 1 | Página de entrada (`index.html`): hero, vigencia, preview de pregunta, CTAs, dark mode | ✅ verificada |
| 2 | App de consulta: 9 vistas, buscador offline, glosario, plazos, progreso, reflujo de texto, layout amplio | ✅ verificada |
| 3 | Examen: motor en `core/examen.js`, retroalimentación con chips, sesión persistente, exámenes por punto | ✅ verificada |
| 4 | **SIGUIENTE**: Service Worker (`sw.js`) + Vercel + prueba offline real | ⬜ |
| 5 | (futuro) APK, banco completo de 20 preguntas, más contenido | ⬜ |

## 4. Mapa de archivos

```
al-dedillo/
├── CONSTITUCION.md          ← reglas + tabla de fases (actualizar al avanzar)
├── README.md
├── index.html + js/entrada.js + css/entrada.css   ← página de entrada (Fase 1)
├── app.html                 ← shell de la app (Fase 2): sidebar + tabs móviles + panel «Más»
├── manifest.webmanifest + icons/ (icono.svg, 180/192/512 png)
├── css/
│   ├── tokens.css           ← design tokens (claro/oscuro JUNTOS), fuentes locales, [hidden] gana
│   ├── entrada.css          ← solo página de entrada
│   └── app.css              ← shell + 9 vistas + examen; desktop amplio (≥960px), texto a 2 columnas
├── fonts/                   ← EB Garamond (600/700) + Atkinson Hyperlegible (400/700) woff2
├── data/                    ← data-as-JS: window.DEDILLO_*, lo único que se edita para actualizar contenido
│   ├── manual.js   (530 KB · 31 secciones: H-001-0001…-10 tareas, H-001-G01/G02, H-002-APC…APC08)
│   ├── plantillas.js (425 KB · 91 entradas, 89 códigos únicos: P-…)
│   ├── constantes.js (plazos 5/10/20/30 días hábiles + 5 años; examen 20×5=70; error tolerable 50/75 %)
│   ├── preguntas.js  (6 preguntas P1–P6 con puntoGolpe, correcta, explicacion, referencia)
│   ├── curso.js      (6 puntos de golpe + 6 rutas de estudio)
│   ├── glosario.js   (18 términos, páginas verificadas)
│   └── fuentes.js    (cita de la norma + disclaimer)
├── core/                    ← lógica pura, SIN DOM
│   ├── datos.js      (acceso + índices; FUSIONA plantillas duplicadas; preguntas(), vecinosDe)
│   ├── estado.js     (store central; persiste tema, vistos, stats, sesión de examen)
│   ├── buscador.js   (búsqueda sin acentos, longitud preservada → resaltado exacto)
│   ├── texto.js      (reflujo: recompone párrafos partidos por el PDF; desguionar con lista blanca)
│   └── examen.js     (motor: crearSesion/responder/respondidaActual/calificar; RNG inyectable)
├── ui/                      ← única capa que construye HTML y escucha eventos
│   ├── router.js     (REGISTRO de vistas; único punto de render; conecta eventos UNA vez por contenedor)
│   ├── componentes.js(chip, linkify (códigos → chips clicables), parrafos (usa reflujo), escalaPlazos…)
│   └── vistas/       manual · plantillas · buscar · curso · plazos · glosario · progreso · examen · fuentes
└── tools/extraer.py         ← extractor reproducible PDF → data/ (python3 tools/extraer.py)
```

## 5. Patrones de la Constitución (resumen operativo)

1. **Tres capas**: `data/` (texto plano con `window.DEDILLO_*`) → `core/` (puro) → `ui/` (DOM).
2. **Estado central único** (`core/estado.js`): se cambia solo con `actualizarEstado({…})`, que persiste lo persistible. Prohibido repartir estado en variables sueltas.
3. **Router único** (`ui/router.js`): hash `#vista/param` → vista del REGISTRO → `render(contenedor, estado, param)` + `eventos(contenedor, estado)` (delegados; se conectan **una sola vez** por elemento, ver WeakSet). Nueva pantalla = nuevo módulo con `render/eventos/titulo` + entrada en REGISTRO. Las vistas piden re-render con `window.dispatchEvent(new Event("dedillo:renderizar"))` (nunca importan al router).
4. **Números de dominio** en `data/constantes.js`, nunca hardcodeados en lógica.
5. **Delegación de eventos** + debounce en entradas de alta frecuencia (buscador: 120 ms).

## 6. Llaves de localStorage

| Clave | Contenido |
|---|---|
| `al-dedillo-tema` | `claro\|oscuro` (default: `prefers-color-scheme`) |
| `al-dedillo-vistos` | códigos consultados (array) |
| `al-dedillo-stats` | `{ok, ko}` — aciertos/fallos de preguntas; **compartida con la página de entrada** |
| `al-dedillo-examen` | sesión en curso (`en_curso/ultima/terminado`) — persiste entre recargas |

## 7. Decisiones tomadas (no reabrir sin motivo)

- **Nombre/logo**: cursor señalando un chip «001»; navy `#1E3A5F` + verde `#059669` + dorado `#B45309` (badge vigencia). Tipografía EB Garamond (títulos) + Atkinson Hyperlegible (cuerpo), locales.
- **El código normativo es un botón**: los H-codes/P-codes mencionados en cualquier texto se vuelven chips clicables (`ui/componentes.js` → `linkify`) que navegan a la sección/plantilla exacta.
- **Reflujo de texto** (`core/texto.js`): los PDF parten líneas y palabras; se recompone al presentar (unión de líneas, guiones internos fuera de una lista blanca de compuestos legítimos: `contable-financiero`, `costo-beneficio`, `día-mes-año`…). Los `data/` no se tocan.
- **Plantillas duplicadas**: la Gaceta publicó 2 formularios en dos páginas (P-0001-07, P-0002-07). `core/datos.js` los fusiona con rótulo «Gaceta, página N»; 91 entradas → 89 códigos. Total del índice de búsqueda: 138 (31 manual + 89 plantillas + 18 glosario).
- **Examen**: n = min(20, banco) → hoy 6 × 16,7 pts, 70 aprueba. En exámenes por punto, los puntos son **100/n de esa sesión** (2 preguntas = 50 c/u) para que aprobar sea alcanzable. Retroalimentación inmediata; el botón «Siguiente» avanza (responder() NO avanza). Contabilización única en el progreso, al pasar de `ultima` a `terminado`.
- **Navegación móvil**: pestañas ≤ 5 (Manual/Buscar/Examen/Progreso/Más) + panel «Más» (Plantillas/Educarse/Plazos/Glosario/Fuentes/tema).
- **Desktop amplio**: contenido pegado a la sidebar (hasta 1480 px, no centrado), listas en rejilla, texto de detalle a 2 columnas.

## 8. Pendiente / siguiente

1. **Fase 4 — offline + despliegue**:
   - `sw.js`: precache de HTML/CSS/JS/fonts/icons/data (~1.2 MB), estrategia cache-first con versión en el nombre del caché; actualizar `manifest` si hace falta; probar en modo avión.
   - Vercel: subir carpeta tal cual (sin build); headers correctos no imprescindibles.
   - Prueba real sin conexión (zona muerta).
2. **Re-extracción de tablas del Tomo I con `pdftotext -layout`**: las tablas complejas (escala de materialidad en H-001-0001-07, «Tareas y su descripción») quedan entremezcladas. `-layout` las recupera mucho mejor, pero exige regenerar `data/manual.js` y repetir las verificaciones de fidelidad (31/31 secciones, 89/91 plantillas). Off: página impresa 3252 = página PDF 3 (offset 3249).
3. **Validación por auditores** (contenido): 6 preguntas del banco, 6 puntos de golpe, 18 términos del glosario — todos marcados `borrador-pendiente-validacion` en sus `meta`.
4. **Completar el banco a 20 preguntas** → el examen pasa a 20×5 automáticamente.
5. Menor: unificar cuándo el chip de referencia de P1 («intro») podría enlazarse si se crea la sección del preámbulo.

## 9. Quirks técnicos (para no redescubrirlos)

- **Headless Chrome** para capturas: `--headless=new --disable-gpu --force-device-scale-factor=1 --virtual-time-budget=3000` + `--window-size` **antes** de `--screenshot`; ancho mínimo ~500 px (menos ignora el ancho). Una carrera conocida hizo capturar a 780×493: repetir el comando lo arregla.
- **Probar core en Node v16**: los módulos ES requieren copias `.mjs` en /tmp con el import `./datos.js` reescrito a ruta absoluta; los `data/` se importan por `file://` y setean `global.window`.
- `pdftotext` paginación: los números de página del texto son los **impresos de la Gaceta** (3252–3612), no los del PDF (361 páginas).
- Generar PNG del logo por captura del SVG es racy: mejor re-escalar del 512 con LANCZOS.
- El proyecto **no es un repo git** (nada versionado aún): considerar `git init` antes de desplegar.
- El `logo.svg` no tiene `id`, por eso `app.html` lo lleva inline (no `<use>`).

## 10. Verificado hasta ahora

- Fase 1: entrada en claro/oscuro (capturas).
- Fase 2: las 9 vistas en claro/oscuro, desktop 1200/1480 y móvil 500; búsqueda («materialidad» → 19 resultados; «recurso apelación», «expediente cinco años» correctos); reflujo (0 guiones rotos de 785; compuestos preservados); fusión de P-0001-07.
- Fase 3: motor simulado en Node (banco 5/6 → 83,3 aprueba; punto 2 → 2/2 = 100, 1/2 = 50 no aprueba); capturas del flujo completo (intro, fallo, acierto, resultado con desglose correcto) en claro/oscuro/móvil.
