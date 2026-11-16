# CONSTITUCIÓN DE AL DEDILLO

Normas que gobiernan este código. Un cambio que no quepa aquí se discute antes de escribirse.

---

## Principios

1. **Offline primero.** Nada depende de la red: sin CDNs, sin fetch externos, fuente e iconos empaquetados localmente. Si funciona en zona muerta, funciona en todas partes.
2. **Solo se actualiza el contenido.** `data/` cambia; `core/` y `ui/` no. Si un cambio de contenido exige tocar lógica, el diseño de datos está mal y se corrige el diseño, no la lógica.
3. **Fidelidad normativa.** Todo texto cita su fuente (GOC-2023-O119, página de la Gaceta). Ante cualquier duda, gana la Gaceta.
4. **Aviso legal visible.** "Recopilación de estudio sin valor oficial… debe contrastarse con la legislación vigente publicada en la Gaceta Oficial de la República de Cuba."

## Los 3 patrones fijos

### Patrón 1 — Tres capas, siempre (Datos · Lógica · Render)

| Capa | Carpeta | Regla |
|------|---------|-------|
| Datos | `data/` | Solo datos (los `.js` versionados). Ninguna función toca el DOM. |
| Lógica | `core/` | Lógica pura: motor de examen, buscador, plazos. **Prohibido `document.`** — funciones que reciben datos y devuelven resultados. |
| Render | `ui/` | Lo único que toca el DOM: render y eventos. |

Mezclar capas es la señal de alarma: se refactoriza antes de continuar.

### Patrón 2 — Un solo store central, inmutable

El estado de la app (pantalla actual, progreso, resultados de examen, tema) vive en **un único objeto `estado`** en `core/estado.js`, con una sola función de cambio:

```js
actualizarEstado(cambios) // persiste en localStorage lo que corresponde
```

Prohibido repartir estado en variables sueltas por módulo.

### Patrón 3 — Registro de vistas + un solo punto de render

Cada vista es un módulo en `ui/vistas/` con dos funciones uniformes:

```js
// ui/vistas/manual.js
export const render = (contenedor, estado, data) => { /* … */ };
export const eventos = (contenedor, estado) => { /* delegación */ };
```

Un registro (`ui/router.js`) las mapea al hash (`#manual`, `#examen`, `#progreso`) y **un único router** decide qué vista se renderiza. Agregar una pantalla = registrar una entrada; nunca tocar el router.

---

## Convenciones

- **Español de dominio:** `calcularPuntaje()`, `buscarEnManual()` — se lee como se habla del producto.
- **Funciones:** un solo nivel de abstracción, máximo ~20 líneas; extraer sin piedad.
- **`const` por defecto**, funciones puras donde se pueda, módulos ES, **cero variables globales**.
- **Delegación de eventos:** un listener por contenedor, nunca uno por elemento generado.
- **Números del dominio en `data/constantes.js`:** plazos (5/10/20/30 días hábiles), 70% para aprobar, versión normativa. Una resolución futura cambia cifras sin tocar lógica.
- **Banco de preguntas:** 100 preguntas (40 situacionales + 40 de contenido + 20 de plazos y cálculo aplicado). IDs `SIT-001…`, `CON-001…`, `PLA-001…`; cada una lleva `categoria`, `puntoGolpe`, `fase`, `dificultad`, `explicacion` y `referencia` exacta (código y página). `meta.bancoVersion` invalida sesiones guardadas si el banco cambia.
- **JSDoc ligera obligatoria en `core/`** (las funciones puras merecen contrato escrito), no en todas partes.
- **ESLint + Prettier** sin build (solo dev), como cinturón de seguridad automático.
- **Iconos SVG inline** (estilo Lucide). Nada de emoji como icono estructural.

## La regla que decide todo

> ¿Cambiaste datos? → `data/` · ¿Comportamiento? → `core/` · ¿Lo que se ve? → `ui/`
>
> Si un cambio no cabe en una carpeta, se detiene y se discute.

---

## Identidad

- **Nombre:** Al Dedillo
- **Slogan:** "El SNA al dedillo: consulta, examina, certifícate"
- **Piel:** institucional — azul marino `#1E3A5F`, tipografía **Atkinson Hyperlegible** (autoalojada), **chips de código** (`001 · 0002 · Tarea 07`, `H-001-0001-07`) como firma visual, **escala de plazos** (5/10/20/30 días hábiles) como pieza única del producto.
- **Landing (Fase 6):** dirección **«Manual vivo»**: el producto como argumento visual, con una demo en HTML/CSS (buscador, chip, descarga Word y escala de plazos). Mobile first; hero partido desde 768 px; sin imágenes externas ni CDNs.
- **Contraste WCAG 2.2 AA:** `#047857` (claro) / `#34d399` (oscuro) para texto verde; `#059669` solo para iconos, fondos y estados no textuales. Bordes de controles con `--color-control-border` (`#64748b` / `#6b82a8`). Los bordes de tarjetas y separadores son decorativos.
- **Dark mode desde el MVP**, con toggle y preferencia persistida.
- **Logotipo:** dedo índice señalando un chip de código.

## Stack

Vanilla HTML + CSS + JS (módulos ES), **sin build**, desplegado en Cloudflare Pages.
La lógica (motor de examen, buscador, navegación por código) es independiente del framework por diseño: si una fase futura exige framework o APK, se porta — los datos versionados no cambian.

### Plantillas en Word (Tomo II)

- `data/formularios.js` es el **modelo estructurado** de los 89 códigos (`guia`, `formulario`, `archivos`). Es dato generado: no se edita a mano.
- `tools/estructurar_todo.py` lo reconstruye desde `data/plantillas.js`, los parsers automáticos y las formas curadas de `tools/formas_especificas.py`.
- `tools/generar_docx.py` + `tools/docx_plantillas.py` escriben `plantillas/*.docx`: A4, **Arial 12**, márgenes 2,5 cm (2 cm apaisado), encabezado con código y página de la Gaceta, pie `Modelo P-xxx · Res. 364/2023 · Página X de Y`.
- **El cliente no genera Word**: los `.docx` son estáticos y se descargan desde la ficha de la plantilla; la app solo enlaza `archivos.formulario` / `archivos.guia`.
- Fidelidad al modelo de la Gaceta: líneas y tablas vacías (sin controles de formulario), sin marca de la app dentro del documento, formulario y guía como documentos separados.
- El extractor produce un bloque por línea del PDF; `_unir_continuaciones()` vuelve a unir las líneas que son el mismo párrafo (la anterior no cierra frase y la siguiente empieza en minúscula o coma). Es lo que mantiene legibles las cartas y actas.
- Regla: si cambia el modelo o los specs, regenerar con `python3 tools/estructurar_todo.py && python3 tools/generar_docx.py`. Nunca editar un `.docx` a mano: el siguiente build lo pisa.

---

## Estado del proyecto (fases)

| Fase | Alcance | Estado |
|------|---------|--------|
| 0.0 | Estructura de directorios + Constitución | ✅ Completada |
| 0 | Extracción del PDF → `data/` (31 secciones + 91 plantillas + constantes + fuentes + 100 preguntas 40/40/20 + puntos de golpe; verificación por muestreo) | ✅ Completada — pendiente validación humana de los auditores |
| 1 | Entrada (puerta única): landing «Manual vivo», hero partido con demo de producto, badge de vigencia, preview de pregunta, CTAs, instalar sin internet, dark mode | ✅ Completada (verificada en claro/oscuro con capturas) |
| 2 | Shell de consulta: navegación por código, plantillas, buscador, glosario, plazos, educarse, progreso, fuentes (verificada en claro/oscuro con capturas) | ✅ Completada |
| 3 | Examen con retroalimentación (chip → sección exacta del Manual): motor en `core/examen.js`, sesión persistente, banco 40/40/20, examen 20×5 (8/8/4), práctica por categoría y por punto de golpe | ✅ Completada (verificada con capturas del flujo completo) |
| 4 | Offline (Service Worker) + prueba en condiciones reales (despliegue: Cloudflare Pages ✅) | ✅ Hecha (`al-dedillo-v7`, 39 entradas + `.docx` en caché de uso) |
| 5 | Plantillas del Tomo II en Word: 89 códigos · 65 formularios · 86 guías (151 `.docx`), descarga desde la ficha y caché offline del documento | ✅ Hecha (verificada en navegador) |
| 6 | Landing «Manual vivo» + auditoría de contraste WCAG 2.2 AA | ✅ Hecha (320–1280 px, claro/oscuro) |
