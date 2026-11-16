# Lo que hay hasta ahora — Al Dedillo

> Documento de estado para retomar el proyecto en cualquier sesión.
> Última actualización: 2026-11-16 · Fases 0–6 completadas y verificadas.
> Las reglas del proyecto viven en `CONSTITUCION.md` (cumplirlas siempre).

---

## 1. Qué es

**Al Dedillo** — PWA para los auditores del Sistema Nacional de Auditoría (Cuba):
consultar el Manual de procedimientos (Resolución 364/2023, GOC-2023-980-O119),
educarse con los puntos que más golpean y autoexaminarse con retroalimentación exacta.

- **Vanilla** HTML + CSS + JS (módulos ES). Sin build, sin framework, sin CDNs.
- Todo el texto visible en **español**. Iconos SVG inline (nunca emoji).
- Desplegado en **Cloudflare Pages** (repo `yamirherblay/aldedillo`); APK contemplada a futuro (Fase 7+).
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
| 1 | Página de entrada (`index.html`): landing «Manual vivo», hero partido con demo de producto, CTAs, preview de pregunta, instalación y dark mode | ✅ verificada |
| 2 | App de consulta: 9 vistas, buscador offline, glosario, plazos, progreso, reflujo de texto, layout amplio | ✅ verificada |
| 3 | Examen: motor en `core/examen.js`, retroalimentación con chips, sesión persistente, exámenes por punto | ✅ verificada |
| 4 | Service Worker (`sw.js`): precache de 39 entradas, offline real verificado (despliegue en Cloudflare Pages) | ✅ verificada (`al-dedillo-v6`) |
| 5 | Plantillas del Tomo II en Word: modelo `data/formularios.js`, 151 `.docx` (65 formularios + 86 guías), descarga desde la ficha, caché offline del documento | ✅ verificada |
| 6 | Landing e identidad visual «Manual vivo» + auditoría de contraste WCAG 2.2 AA | ✅ verificada |
| 7 | (futuro) APK, banco completo de 20 preguntas, más contenido | ⬜ |

## 4. Mapa de archivos

```
al-dedillo/
├── CONSTITUCION.md          ← reglas + tabla de fases (actualizar al avanzar)
├── README.md
├── index.html + js/entrada.js + css/entrada.css   ← landing «Manual vivo» (Fase 6)
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
│   ├── formularios.js (596 KB · modelo estructurado de los 89 códigos: bloques de la guía y del formulario + nombres de archivo Word)
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
├── plantillas/              ← 151 .docx estáticos (65 formularios + 86 guías), Arial 12, listos para imprimir
└── tools/                   ← cadena de generación (Python; no se ejecuta en el navegador)
    ├── extraer.py           ← PDF → data/manual.js y data/plantillas.js
    ├── texto.py / nombres.py ← limpieza de texto y nombres de archivo
    ├── formas_especificas.py ← 46 formularios con geometría curada (tablas, matrices, actas)
    ├── estructurar_todo.py  ← data/plantillas.js → data/formularios.js (bloques)
    ├── docx_plantillas.py   ← constructor .docx (estilos, campos PAGE/NUMPAGES, tablas, apaisado)
    └── generar_docx.py      ← data/formularios.js → plantillas/*.docx
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
- **Plantillas Word (Fase 5)**: `data/plantillas.js` (texto de la Gaceta) manda; `data/formularios.js` es el modelo de bloques generado y `plantillas/*.docx` la salida estática. Nada de librerías docx en el cliente (el navegador solo descarga).
  - Fidelidad al modelo oficial: Arial 12, A4, 2,5 cm de margen (2 cm apaisado), encabezado `código` + `Res. 364/2023 · Gaceta pág. N`, pie con campos reales `Página X de Y`; líneas de escritura con tabulación y relleno subrayado, no controles de formulario.
  - Dos documentos por código: **formulario** (para llenar) y **guía** (instrucciones y anotaciones). Nombres `P-xxx - <nombre> - formulario.docx` / `… - guia.docx`, guardados en `archivos` para que la UI no invente rutas.
  - Códigos duplicados: se usa la primera aparición (`setdefault`); P-0001-07 y P-0002-07 no duplican plantilla. Formularios que el extractor ve como texto plano se reclasifican como guía; `sin_guia` elimina guías de una línea en códigos que solo son tablas de referencia.
  - Tablas anchas → sección apaisada; cabeceras largas en columnas estrechas → guion manual (`Asevera-\nción`) y 8 pt en las matrices densas; filas con altura mínima `AT_LEAST` para que el texto no se recorte.
  - La ficha de plantilla muestra una tarjeta **Documentos de trabajo** con las descargas Word y deja el texto crudo de la Gaceta dentro de un `<details>` de referencia.
- **Landing e identidad visual (Fase 6)**: `index.html` + `css/entrada.css` con dirección **«Manual vivo»**. Hero partido en desktop, una columna en móvil; demo de producto en HTML/CSS (buscador, chip `P-0001-01`, descarga Word y escala de plazos 5/10/20/30), sin capturas ni imágenes externas. La pregunta de muestra baja a «Pruébalo»; la instalación y el aliado quedan al final.
  - **Mobile first**: a 320/360 px se ven el CTA principal y el inicio de la demo; la demo completa aparece desde 560 px y el hero partido desde 768 px. El botón de instalar es visible siempre y abre el modal genérico si el navegador no ofrece `beforeinstallprompt`.
  - **Contraste WCAG 2.2 AA**: tokens `--color-accent-text` (`#047857` / `#34d399`), `--color-accent-strong` (hover de chips verdes), `--color-control-border` (`#64748b` / `#6b82a8`) y `--color-destructive-text` (`#b91c1c` / `#f87171`). Corregidos el chip de plantilla (3.25:1 → 4.63:1), su hover, el botón peligro en oscuro (2.77:1 → 6.07:1) y los bordes de controles (1.24:1 → 4.55:1). Los bordes de tarjetas y separadores siguen siendo decorativos.

## 8. Pendiente / siguiente

1. **Fase 4 — offline + despliegue: ✅ hecha.**
   - `sw.js`: precache de 39 entradas (páginas, CSS, fuentes, iconos, `core/`, `ui/`, `data/` incluido `formularios.js`), navegaciones red-primero con caída al caché y recursos caché-primero; versión en el nombre del caché (`al-dedillo-v6`); `skipWaiting` + `claim` y recarga automática al cambiar el controlador (`controllerchange`).
   - Los `.docx` **no** entran en el precache (151 archivos, ~6 MB): se guardan en el caché de uso la primera vez que se descargan (`plantillas/*.docx`), así quedan disponibles sin conexión.
   - Despliegue: ✅ en Cloudflare Pages desde `yamirherblay/aldedillo` (sin build; la raíz del repo es la raíz del sitio).
   - **Bug de navegación corregido** (el que rompía el sitio desplegado): `peticion` ya es el `Request`; `peticion.request` era `undefined`, así que `fetch(undefined)` pedía `GET /undefined` y el 404 se servía como la página (la URL no cambiaba, sin error en consola). Además la variante con `peticion.request.url` lanzaba `TypeError` → página de error. Regla: en el SW usar `peticion.url` (texto) y `peticion` (Request), nunca `peticion.request`.
2. **Fase 5 — plantillas Word: ✅ hecha.** 89 códigos con al menos un documento (151 en total), cero archivos faltantes. Quedan como aproximaciones editables (no bloquean): el detalle de aspectos de P-G02-11, las matrices simplificadas P-0001-04 y P-PC01-12, y las tablas de referencia P-D0001-12/14.
3. **Re-extracción de tablas del Tomo I con `pdftotext -layout`**: las tablas complejas (escala de materialidad en H-001-0001-07, «Tareas y su descripción») quedan entremezcladas. `-layout` las recupera mucho mejor, pero exige regenerar `data/manual.js` y repetir las verificaciones de fidelidad (31/31 secciones, 89/91 plantillas). Off: página impresa 3252 = página PDF 3 (offset 3249).
4. **Validación por auditores** (contenido): 6 preguntas del banco, 6 puntos de golpe, 18 términos del glosario y los 151 documentos Word — todos marcados `borrador-pendiente-validacion` en sus `meta`.
5. **Completar el banco a 20 preguntas** → el examen pasa a 20×5 automáticamente.
6. Menor: unificar cuándo el chip de referencia de P1 («intro») podría enlazarse si se crea la sección del preámbulo.

## 9. Quirks técnicos (para no redescubrirlos)

- **Headless Chrome** para capturas: `--headless=new --disable-gpu --force-device-scale-factor=1 --virtual-time-budget=3000` + `--window-size` **antes** de `--screenshot`; ancho mínimo ~500 px (menos ignora el ancho). Una carrera conocida hizo capturar a 780×493: repetir el comando lo arregla.
- **Probar core en Node v16**: los módulos ES requieren copias `.mjs` en /tmp con el import `./datos.js` reescrito a ruta absoluta; los `data/` se importan por `file://` y setean `global.window`.
- `pdftotext` paginación: los números de página del texto son los **impresos de la Gaceta** (3252–3612), no los del PDF (361 páginas).
- Generar PNG del logo por captura del SVG es racy: mejor re-escalar del 512 con LANCZOS.
- **Service Worker**:
  - `peticion` ya ES el `Request`. `peticion.request` es `undefined`: `fetch(undefined)` termina en `GET /undefined` (404 que sustituye a la página) y `peticion.request.url` lanza `TypeError`. Usar `peticion.url` (texto) para `fetch`/`caches.match` y `peticion` para `fetch` de recursos.
  - Un Request de modo `navigate` no sirve para `fetch()`; siempre pasar la URL como texto.
  - Los errores del SW **no salen en la consola de la página**: descubrirlos con CDP `ServiceWorker.enable` (evento `ServiceWorker.workerErrorReported`, con línea exacta).
  - `Network.emulateNetworkConditions(offline)` **no es fiable con SW**: a veces ni despacha el evento `fetch`. Para probar offline de verdad: matar el servidor (fallo de red auténtico) y luego recargar/navegar.
  - En una página de error de Chrome no corre JS (`caches` no se puede inspeccionar ahí): volver a una página válida para leer el caché.
  - `Page.reload` es la prueba dura: no usa el caché HTTP, obliga al SW a servir la navegación. Las navegaciones pueden «colar» por el caché HTTP y ocultar fallos del SW.
- **Generación de Word**:
  - `docx` con `AT_LEAST` en las filas: `EXACTLY` recorta las cabeceras de varias líneas; con `AT_LEAST` la fila crece lo necesario.
  - Una tabla al final del cuerpo **necesita** un párrafo después en OOXML; si ese párrafo sobra empuja una página en blanco. `generar_docx._sin_cola_vacia()` borra los párrafos vacíos finales.
  - Las líneas de escritura son tabulaciones con relleno subrayado (`_borde` + tab leader), no bordes de párrafo: así se imprimen y se llenan igual que el modelo.
  - En columnas estrechas, Arial no parte palabras largas: se guionizan a mano en la cabecera (`Asevera-\nción`) y las matrices densas bajan a 8 pt.
  - El PDF parte los párrafos en líneas; `_unir_continuaciones()` recompone las que continúan la frase (sin puntuación final + inicio en minúscula/coma). Solo se aplica a formas automáticas, nunca a los specs curados.
  - `python-docx` no calcula anchos: los cm de `_anchos` se escriben en `tblGrid` y `tblLayout=fixed`; el total debe cuadrar con 16 cm (vertical) o 25,7 cm (apaisado).
  - Para revisar sin abrir Word: `soffice --headless --convert-to pdf` + `pdftoppm -png -r 70` + `montage` (LibreOffice 25.8, python-docx 1.2).
- Probar el SW con **perfil de Chrome limpio** en cada corrida; un SW viejo del mismo origen enmascara los resultados.
- Repo git en `main`, remoto `AlDEDILLO` (GitHub `yamirherblay/aldedillo`); Cloudflare Pages redespliega al hacer push. Tras cambiar `sw.js`, subir `CACHE_VERSION`.
- El `logo.svg` no tiene `id`, por eso `app.html` lo lleva inline (no `<use>`).

## 10. Verificado hasta ahora

- Fase 1: entrada en claro/oscuro (capturas).
- Fase 2: las 9 vistas en claro/oscuro, desktop 1200/1480 y móvil 500; búsqueda («materialidad» → 19 resultados; «recurso apelación», «expediente cinco años» correctos); reflujo (0 guiones rotos de 785; compuestos preservados); fusión de P-0001-07.
- Fase 3: motor simulado en Node (banco 5/6 → 83,3 aprueba; punto 2 → 2/2 = 100, 1/2 = 50 no aprueba); capturas del flujo completo (intro, fallo, acierto, resultado con desglose correcto) en claro/oscuro/móvil.
- Fase 4 (Chrome por CDP, perfil limpio):
  - Con red: `index.html` instala el SW y precachea 39/39; `app.html?marcador=E#manual` → «Manual · Al Dedillo»; buscador «materialidad» → 19 resultados y «expediente cinco años» → 4, ida y vuelta manual↔buscar; recarga correcta.
  - Sin red (servidor matado): recarga → «Buscar · Al Dedillo» con la app pintada; «materialidad» → 19 resultados; `#examen` → «Examen · Al Dedillo»; `/` e `index.html` → entrada. Cero peticiones a `/undefined`.
- Fase 5 (Word + UI, Playwright con Chrome del sistema):
  - 89 códigos · 65 formularios · 86 guías = **151 `.docx`**, 0 faltantes y 0 códigos sin documento; modelo de 596 KB.
  - Ficha `#plantillas/P-0001-01`: tarjeta «Documentos de trabajo», dos botones, descarga real del formulario (39 KB) y de la guía; texto de la Gaceta plegado; cero errores de consola.
  - SW `v6`: el `.docx` descargado entra en `al-dedillo-v6`; con `context.set_offline(True)` la ficha vuelve a pintar los dos botones y el documento responde 200 desde el caché.
  - Como los `.docx` se guardan por URL, **cada cambio de plantillas exige subir `CACHE_VERSION`** (igual que `data/`): si no, los usuarios con el documento ya cacheado siguen viendo la versión vieja.
  - Revisión visual (LibreOffice → PDF → PNG) de los 46 formularios curados y de las guías; corregidos recortes de cabecera, páginas en blanco finales y tablas apaisadas.
  - Cartas y actas: las líneas que el PDF partía se recomponen en párrafos continuos (P-0002-01, P-0001-03, P-0002-03/04, P-G02-07, P-D0001-14); las tablas de referencia y los formularios curados no se tocan.
- Fase 6 (landing + contraste, Playwright con Chrome del sistema):
  - `index.html` y `css/entrada.css` reescritos con dirección «Manual vivo»; probados en **320, 360, 375, 560, 768, 1024 y 1280 px**, claro y oscuro. Sin desbordamiento horizontal, cero errores de consola.
  - Primer scroll móvil: CTA principal visible y demo de producto empezando; a 360 px el botón primario está en y≈282 y la demo en y≈470.
  - Skip link funcional (primer Tab → «Saltar al contenido»), foco al `main`, modal con foco inicial en «Entendido», trampa de Tab, cierre con Escape y retorno de foco al botón de instalar.
  - Contraste medido sobre estilos computados: todos los textos de la landing ≥4.5:1 (la mayoría ≥7:1); bordes de controles 4.55:1 (claro) y 4.67:1 (oscuro). En la app: chip de plantilla 4.73:1, hover 5.48/8.73:1, botón peligro 6.07:1 en oscuro, buscador/opciones con borde ≥4:1.
  - `sw.js` sube a `v6`: 39 entradas precacheadas; recarga de `index.html` sin red verificada (título, hero y demo presentes).
