// Puntos de golpe: lo que más golpea al auditor en materia normativa.
// Eje de la sección de estudio y del filtrado del examen (core/examen.js filtra por puntoGolpe).
window.DEDILLO_CURSO = {
 meta: {
  fuente: "GOC-2023-980-O119",
  version: "2023",
  estado: "borrador-pendiente-validacion",
 },
 puntosGolpe: [
  {
   id: 1,
   titulo: "Plazos legales",
   detalle: "Confundir días hábiles con naturales, o mezclar los plazos del auditado con los del auditor (5, 10, 20, 30).",
   codigos: ["H-001-0004", "H-001-0004-02"],
  },
  {
   id: 2,
   titulo: "Materialidad",
   detalle: "Tratarla solo como cifra (cuantitativa) y dejar pasar lo cualitativo: fraude, ilegalidad «sin valor», alto interés público.",
   codigos: ["H-001-0001-07"],
  },
  {
   id: 3,
   titulo: "Evidencia suficiente y apropiada",
   detalle: "Confundir cantidad con calidad: mucho papel que no prueba nada.",
   codigos: ["H-001-0002", "H-001-0002-02"],
  },
  {
   id: 4,
   titulo: "Independencia y ética",
   detalle: "Aceptar cortesías, no reconocer las amenazas a la independencia.",
   codigos: ["intro", "H-001-G02"],
  },
  {
   id: 5,
   titulo: "Documentación y custodia",
   detalle: "Mal archivo de papeles de trabajo; olvidar los cinco años de conservación del Expediente.",
   codigos: ["H-001-G01"],
  },
  {
   id: 6,
   titulo: "Señalamientos y seguimiento",
   detalle: "Redactar señalamientos sin causas y condiciones; no tramitar los plazos del Plan de medidas.",
   codigos: ["H-001-0004", "H-001-0004-01"],
  },
 ],
 rutas: [
  { id: "0001", titulo: "Planeación de la auditoría", tareas: ["H-001-0001-01", "H-001-0001-06", "H-001-0001-07", "H-001-0001-08", "H-001-0001-09", "H-001-0001-10"] },
  { id: "0002", titulo: "Realización de la auditoría", tareas: ["H-001-0002-01", "H-001-0002-02"] },
  { id: "0003", titulo: "Elaboración del Informe", tareas: ["H-001-0003-01", "H-001-0003-02"] },
  { id: "0004", titulo: "Seguimiento", tareas: ["H-001-0004-01", "H-001-0004-02"] },
  { id: "transversales", titulo: "Transversales", tareas: ["H-001-G01", "H-001-G02"] },
  { id: "otras", titulo: "Otras acciones de prevención y control", tareas: ["H-002-APC01", "H-002-APC02", "H-002-APC03", "H-002-APC04", "H-002-APC05", "H-002-APC06", "H-002-APC07", "H-002-APC08"] },
 ],
};
