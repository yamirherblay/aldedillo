// ============================================================
// ui/vistas/plantillas.js — vista del Tomo II.
// #plantillas                → listado agrupado por familia de códigos
// #plantillas/P-001-G01      → guía de la plantilla
// ============================================================
import { plantillas, plantillaPorCodigo, formularioPorCodigo } from "../../core/datos.js";
import { marcarVisto } from "../../core/estado.js";
import { chip, escapar, linkify, parrafos, badgePagina, breadcrumb, vistaVacia } from "../componentes.js";

function familiaDe(codigo) {
  // P-001-G* generales · P-0001..0004 por fase · P-D* metodológicas · P-G01/G02 transversales · P-PCxx otras acciones
  if (codigo.startsWith("P-001-G")) return { nombre: "Generales del proceso", orden: 1 };
  if (codigo.startsWith("P-0001")) return { nombre: "Fase 0001 · Planeación", orden: 2 };
  if (codigo.startsWith("P-0002")) return { nombre: "Fase 0002 · Realización", orden: 3 };
  if (codigo.startsWith("P-0003")) return { nombre: "Fase 0003 · Informe", orden: 4 };
  if (codigo.startsWith("P-0004")) return { nombre: "Fase 0004 · Seguimiento", orden: 5 };
  if (codigo.startsWith("P-D0001")) return { nombre: "Metodológicas · auditoría", orden: 6 };
  if (codigo.startsWith("P-D0002")) return { nombre: "Metodológicas · pruebas", orden: 7 };
  if (codigo.startsWith("P-D0003")) return { nombre: "Metodológicas · informes", orden: 8 };
  if (codigo.startsWith("P-G0")) return { nombre: "Transversales", orden: 9 };
  if (codigo.startsWith("P-PC")) return { nombre: "Otras acciones de prevención y control", orden: 10 };
  return { nombre: "Otras", orden: 99 };
}

function listado() {
  const grupos = new Map();
  for (const p of plantillas()) {
    const f = familiaDe(p.codigo);
    if (!grupos.has(f.orden)) grupos.set(f.orden, { nombre: f.nombre, items: [] });
    grupos.get(f.orden).items.push(p);
  }
  return [...grupos.values()]
    .sort((a, b) => a.orden - b.orden)
    .map(
      (g) => `<section class="grupo"><h2>${escapar(g.nombre)}</h2>
        <div class="lista">${g.items
          .map(
            (p) => `<a class="lista-item" href="#plantillas/${p.codigo}">
              ${chip(p.codigo, { plano: true })}
              <span class="lista-nombre">${escapar(p.nombre)}</span>
              <span class="lista-flecha" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </a>`,
          )
          .join("")}</div></section>`,
    )
    .join("");
}

function documentos(codigo) {
  const f = formularioPorCodigo(codigo);
  if (!f || !f.archivos) return "";
  const botones = [];
  if (f.archivos.formulario) {
    botones.push(
      `<a class="boton" href="plantillas/${encodeURIComponent(f.archivos.formulario)}" download>Descargar formulario (Word)</a>`,
    );
  }
  if (f.archivos.guia) {
    botones.push(
      `<a class="boton boton-secundario" href="plantillas/${encodeURIComponent(f.archivos.guia)}" download>Descargar guía (Word)</a>`,
    );
  }
  if (!botones.length) return "";
  return `<section class="documentos">
    <h2>Documentos de trabajo</h2>
    <p class="vista-sub">Editables en Microsoft Word, Arial 12, listos para imprimir. El formulario es la plantilla para llenar; la guía explica cómo usarla.</p>
    <div class="documentos-acciones">${botones.join("")}</div>
  </section>`;
}

function detalle(codigo) {
  const p = plantillaPorCodigo(codigo);
  if (!p) return vistaVacia("No encontrada", `La plantilla ${codigo} no existe en el Tomo II.`, `<a class="boton" href="#plantillas">Volver a Plantillas</a>`);
  marcarVisto(codigo);
  return `
    ${breadcrumb([{ texto: "Plantillas", href: "#plantillas" }, { texto: p.codigo }])}
    <article class="seccion">
      <header class="seccion-cabecera">
        ${chip(p.codigo, { plano: true })}
        <h1>${escapar(p.nombre)}</h1>
        ${badgePagina(p.pagina)}
      </header>
      ${documentos(p.codigo)}
      <details class="seccion-gaceta">
        <summary>Texto de la Gaceta (referencia)</summary>
        <div class="seccion-texto">${parrafos(p.texto)}</div>
      </details>
    </article>`;
}

export const render = (contenedor, estado, param) => {
  contenedor.innerHTML = param ? detalle(param) : `<header class="vista-cabecera"><h1>Plantillas</h1><p class="vista-sub">Tomo II del Manual, agrupadas por familia. Cada plantilla incluye su formulario y su guía en Word.</p></header>${listado()}`;
};

export const eventos = () => {};
export const titulo = (param) => (param ? (plantillaPorCodigo(param)?.nombre || "Plantilla") : "Plantillas");
