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
- **Dark mode desde el MVP**, con toggle y preferencia persistida.
- **Logotipo:** dedo índice señalando un chip de código.

## Stack

Vanilla HTML + CSS + JS (módulos ES), **sin build**, desplegado en Cloudflare Pages.
La lógica (motor de examen, buscador, navegación por código) es independiente del framework por diseño: si una fase futura exige framework o APK, se porta — los datos versionados no cambian.

---

## Estado del proyecto (fases)

| Fase | Alcance | Estado |
|------|---------|--------|
| 0.0 | Estructura de directorios + Constitución | ✅ Completada |
| 0 | Extracción del PDF → `data/` (31 secciones + 91 plantillas + constantes + fuentes + 6 preguntas + puntos de golpe; verificación por muestreo) | ✅ Completada — pendiente validación humana de los auditores |
| 1 | Entrada (puerta única): hero, badge de vigencia, preview de pregunta, 3 CTAs, instalar sin internet, dark mode | ✅ Completada (verificada en claro/oscuro con capturas) |
| 2 | Shell de consulta: navegación por código, plantillas, buscador, glosario, plazos, educarse, progreso, fuentes (verificada en claro/oscuro con capturas) | ✅ Completada |
| 3 | Examen con retroalimentación (chip → sección exacta del Manual): motor en `core/examen.js`, sesión persistente, exámenes por punto de golpe | ✅ Completada (verificada con capturas del flujo completo) |
| 4 | Offline (Service Worker) + prueba en condiciones reales (despliegue: Cloudflare Pages ✅) | ✅ Hecha (`al-dedillo-v3`, 38 entradas) |
