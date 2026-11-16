// Banco de 100 preguntas — borrador para validación de los auditores.
// Esquema en CONSTITUCION.md: cada fallo retroalimenta con la referencia exacta al Manual.
// La lógica (core/examen.js) NO hardcodea preguntas: solo lee este archivo.
// 40 situacionales + 40 de contenido + 20 de plazos y cálculo aplicado.
window.DEDILLO_PREGUNTAS = {
  "meta": {
    "fuente": "GOC-2023-980-O119",
    "version": "2023",
    "bancoVersion": "100-v1",
    "estado": "borrador-pendiente-validacion",
    "total": 100,
    "distribucion": {
      "situacional": 40,
      "contenido": 40,
      "plazos": 20
    }
  },
  "categorias": [
    {
      "id": "situacional",
      "titulo": "Situacionales",
      "descripcion": "Casos con una decisión correcta: materialidad, evidencia, ética, informe, seguimiento y documentación."
    },
    {
      "id": "contenido",
      "titulo": "De contenido",
      "descripcion": "Definiciones, procedimientos, responsabilidades, documentos y diferencias entre figuras del Manual."
    },
    {
      "id": "plazos",
      "titulo": "Plazos y cálculo aplicado",
      "descripcion": "Términos, hechos que los activan y responsables; sin aritmética de calendario."
    }
  ],
  "preguntas": [
    {
      "id": "SIT-001",
      "categoria": "situacional",
      "tema": "materialidad",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "media",
      "muestra": true,
      "enunciado": "En la planeación, el auditor determina la materialidad predeterminada y decide fijar el error tolerable en el 75 %. Al calcular el umbral de resumen de diferencias, un miembro del grupo propone utilizar el 5 % de la materialidad. ¿Qué debe hacer el auditor?",
      "opciones": [
        "a) Aplicar el 5 %, porque es el porcentaje previsto con independencia del error tolerable elegido.",
        "b) Aplicar el 10 %, para no acumular diferencias menores que puedan distorsionar el informe.",
        "c) Aplicar el 3 % de la materialidad predeterminada, por corresponder al error tolerable del 75 %.",
        "d) Posponer el cálculo del umbral hasta la fase de realización, cuando se conozcan los saldos."
      ],
      "correcta": 2,
      "explicacion": "El procedimiento fija el umbral de resumen de diferencias en 5 % de la materialidad cuando el error tolerable es del 50 %, y en 3 % cuando el error tolerable es del 75 %. Elegido el 75 %, corresponde aplicar el 3 %.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "SIT-002",
      "categoria": "situacional",
      "tema": "materialidad",
      "puntoGolpe": 2,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "Durante la realización, el auditor calcula un nuevo nivel de materialidad para un grupo de transacciones y obtiene un importe superior a la materialidad predeterminada en la planeación. ¿Qué debe hacer?",
      "opciones": [
        "a) Ajustar el nuevo nivel para que no supere la materialidad predeterminada en la planeación.",
        "b) Mantener el importe, porque el área seleccionada presenta un riesgo más alto.",
        "c) Elevarlo solo si la calificación del control interno del área es satisfactoria.",
        "d) Sustituir la materialidad de planeación por el nuevo importe en todas las áreas."
      ],
      "correcta": 0,
      "explicacion": "El auditor puede determinar nuevos niveles de materialidad para tipos de transacciones, saldos o revelaciones, pero el nuevo nivel no puede superar el valor de la materialidad predeterminada en la fase de planeación.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "SIT-003",
      "categoria": "situacional",
      "tema": "materialidad",
      "puntoGolpe": 2,
      "fase": "0003",
      "dificultad": "media",
      "enunciado": "Al evaluar los resultados, el auditor detecta un pago indebido por un importe inferior al umbral cuantitativo de materialidad, pero vinculado con posible falsificación de documentos. Un auditor propone omitirlo por inmaterial. ¿Qué procede?",
      "opciones": [
        "a) Omitirlo, porque su cuantía no alcanza el umbral establecido para el informe.",
        "b) Acumularlo con otros errores y omitirlo si el total tampoco supera el umbral.",
        "c) Consultar al sujeto auditado y omitirlo si este no ofrece una explicación.",
        "d) Considerarlo material por naturaleza y reflejarlo en el informe de la auditoría."
      ],
      "correcta": 3,
      "explicacion": "La materialidad cualitativa comprende lo material por naturaleza, que incluye cualquier sospecha de fraude, ilegalidad o falsificación intencional, independientemente de su valor monetario; esos asuntos deben reflejarse en el informe.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "SIT-004",
      "categoria": "situacional",
      "tema": "materialidad",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "alta",
      "enunciado": "La evaluación del riesgo de incorrección material arroja un nivel alto. Para reducir la cantidad de pruebas, un auditor propone aplicar el porcentaje más alto de materialidad permitido. ¿Qué debe hacer el grupo?",
      "opciones": [
        "a) Aplicar el porcentaje más alto, porque el riesgo alto exige menos procedimientos.",
        "b) Aplicar el porcentaje más bajo y ampliar las pruebas de control o sustantivas.",
        "c) Mantener siempre un porcentaje medio, con independencia del riesgo evaluado.",
        "d) Determinar la materialidad después del trabajo de campo, cuando existan resultados."
      ],
      "correcta": 1,
      "explicacion": "Existe una relación inversa entre materialidad y riesgo: a mayor riesgo de error material, menor nivel de materialidad, lo que conduce a efectuar más pruebas de control o procedimientos sustanciales.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "SIT-005",
      "categoria": "situacional",
      "tema": "materialidad",
      "puntoGolpe": 2,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "Para decidir qué saldos de cuentas someter a prueba, un auditor compara directamente cada saldo con la materialidad predeterminada y no calcula el error tolerable. ¿Qué debió hacer?",
      "opciones": [
        "a) Utilizar la materialidad predeterminada tal como está, sin ningún ajuste por cuenta.",
        "b) Sustituir la materialidad por el umbral de resumen de diferencias en todos los saldos.",
        "c) Determinar el error tolerable y aplicarlo a los saldos individuales de las cuentas.",
        "d) Calcular únicamente la materialidad cualitativa y dejar los saldos para la realización."
      ],
      "correcta": 2,
      "explicacion": "El error tolerable es un porcentaje de la materialidad que permite aplicarla a los niveles de los saldos de cuentas individuales; contribuye a determinar las cuentas significativas y a precisar el alcance del muestreo o de las pruebas sobre partidas clave.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "SIT-006",
      "categoria": "situacional",
      "tema": "materialidad",
      "puntoGolpe": 2,
      "fase": "0003",
      "dificultad": "alta",
      "enunciado": "Al acumular errores para el informe, el auditor compensa una sobrevaloración de ingresos con una infravaloración de gastos de importe similar y concluye que no existe efecto material. ¿Qué proceder es correcto?",
      "opciones": [
        "a) No compensar errores de ingresos con errores de gastos; deben acumularse por separado.",
        "b) Compensarlos si el efecto neto queda por debajo de la materialidad predeterminada.",
        "c) Compensarlos solo cuando ambos errores afecten al mismo período contable.",
        "d) Trasladar la compensación a la siguiente auditoría y no reflejarla en este informe."
      ],
      "correcta": 0,
      "explicacion": "Entre las pautas para la acumulación y compensación de errores se establece que no se compensan errores en Ingresos con errores en Gastos, ni errores en el Activo con errores en el Pasivo y el Patrimonio; tampoco se compensan infravaloraciones de una partida con sobrevaloraciones de otra.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "SIT-007",
      "categoria": "situacional",
      "tema": "materialidad",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "En una auditoría de cumplimiento, el incumplimiento de un proceso no puede cuantificarse en valores monetarios y el auditor no logra fijar un umbral cuantitativo. ¿Qué debe hacer?",
      "opciones": [
        "a) Aplicar el 5 % del presupuesto del área como materialidad supletoria.",
        "b) Declarar una limitación de alcance y suspender la evaluación del proceso.",
        "c) Reutilizar la materialidad cuantitativa de la auditoría anterior sin cambios.",
        "d) Establecer un umbral cualitativo o un nivel tolerable de incumplimiento."
      ],
      "correcta": 3,
      "explicacion": "Cuando no se puede establecer un umbral cuantitativo porque el incumplimiento no siempre se cuantifica en valores monetarios, el grupo de auditoría puede fijar como umbral una tasa tolerable de incumplimiento y debe definir claramente cuándo la desviación es material.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "SIT-008",
      "categoria": "situacional",
      "tema": "evidencia",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "Al confirmar saldos de cuentas por cobrar, la máxima autoridad de la entidad confirmante se niega a permitir que el auditor realice la confirmación externa. ¿Qué debe hacer el auditor?",
      "opciones": [
        "a) Sustituir la confirmación por una indagación verbal al personal de la entidad.",
        "b) Investigar las causas y, si procede, informar a su unidad y a la Contraloría General.",
        "c) Documentar la negativa de la entidad confirmante y cerrar el procedimiento sin más evidencia.",
        "d) Solicitar al sujeto auditado que confirme por escrito los saldos en lugar del tercero."
      ],
      "correcta": 1,
      "explicacion": "Ante la negativa de la máxima autoridad de la entidad confirmante, el auditor debe investigar las causas y sus implicaciones; de ser necesario, comunica a la unidad organizativa de auditoría a la que se subordina y a la Contraloría General para analizar y determinar el proceder.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-01",
        "pagina": 3313
      }
    },
    {
      "id": "SIT-009",
      "categoria": "situacional",
      "tema": "evidencia",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "basica",
      "enunciado": "El auditor sustenta un hallazgo únicamente en entrevistas y cuestionarios aplicados al personal del área auditada. Antes de incluirlo en el informe, ¿qué debe hacer?",
      "opciones": [
        "a) Mantenerlo, porque los testimonios recogidos son evidencia directa de los hechos.",
        "b) Ampliar el número de entrevistados hasta que todos coincidan en la misma versión.",
        "c) Complementarlo con inspección, documentación u otras técnicas de recolección de evidencia.",
        "d) Pedir al máximo jefe de la entidad una declaración escrita que respalde el hallazgo."
      ],
      "correcta": 2,
      "explicacion": "La indagación, por sí sola, no aportará evidencia suficiente y apropiada en la mayoría de los casos; se utiliza de forma amplia durante la auditoría, pero complementa otros procedimientos como la inspección y la documentación escrita.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-01",
        "pagina": 3313
      }
    },
    {
      "id": "SIT-010",
      "categoria": "situacional",
      "tema": "evidencia",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "alta",
      "enunciado": "Durante la ejecución, la evidencia obtenida difiere de forma significativa de la información sobre la que se evaluaron los riesgos al inicio de la auditoría. ¿Qué debe hacer el auditor?",
      "opciones": [
        "a) Reevaluar los procedimientos planificados y ajustar su naturaleza, oportunidad o alcance.",
        "b) Continuar con el programa aprobado para no alterar el plan de trabajo general.",
        "c) Descartar la nueva evidencia por no haber sido prevista en la fase de planeación.",
        "d) Ampliar la muestra sin modificar los procedimientos diseñados originalmente."
      ],
      "correcta": 0,
      "explicacion": "Cuando la evidencia difiere significativamente de la información sobre la cual se basaron las evaluaciones de riesgos, el auditor debe volver a evaluar los procedimientos de auditoría planificados.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-01",
        "pagina": 3313
      }
    },
    {
      "id": "SIT-011",
      "categoria": "situacional",
      "tema": "evidencia",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "basica",
      "enunciado": "Por limitaciones de tiempo, el auditor pretende sustentar la conclusión de un tema solo con procedimientos analíticos. ¿Qué debe hacer?",
      "opciones": [
        "a) Aceptarlo, siempre que los datos utilizados sean internos y estén actualizados.",
        "b) Sustituir los procedimientos analíticos por una indagación con los directivos.",
        "c) Utilizar solo pruebas de tendencias, que son las más confiables para concluir.",
        "d) Combinarlos con otras técnicas, pues los analíticos no deben ser la única técnica."
      ],
      "correcta": 3,
      "explicacion": "Los procedimientos analíticos pueden usarse en el análisis de riesgos y en la recopilación de evidencia, pero nunca deben ser la única técnica utilizada; requieren además fiabilidad de los datos.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-01",
        "pagina": 3313
      }
    },
    {
      "id": "SIT-012",
      "categoria": "situacional",
      "tema": "evidencia",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "alta",
      "enunciado": "En una muestra aparece un error y el auditor lo califica de inmediato como una anomalía, lo excluye y concluye sobre la población. ¿Qué debió hacer?",
      "opciones": [
        "a) Excluirlo si aparece una sola vez y no vuelve a repetirse en la misma prueba.",
        "b) Aplicar procedimientos adicionales que confirmen que el error no es representativo.",
        "c) Extrapolarlo a toda la población y calificarlo como incumplimiento sistemático.",
        "d) Reportarlo como material sin realizar ninguna comprobación complementaria."
      ],
      "correcta": 1,
      "explicacion": "Para considerar una instancia de incumplimiento como anomalía, el auditor debe tener un alto grado de certeza de que no es representativa de la población; obtiene esa certeza mediante procedimientos de auditoría adicionales.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-02",
        "pagina": 3334
      }
    },
    {
      "id": "SIT-013",
      "categoria": "situacional",
      "tema": "evidencia",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "Las pruebas de control muestran que los controles no funcionaron durante el período revisado. ¿Qué debe hacer el auditor?",
      "opciones": [
        "a) Mantener el enfoque de auditoría adoptado en la fase de planeación.",
        "b) Reducir las pruebas sustantivas porque el riesgo de control ya está medido.",
        "c) Obtener evidencia exclusivamente de las pruebas sustantivas.",
        "d) Confiar en los controles si las debilidades observadas son pocas."
      ],
      "correcta": 2,
      "explicacion": "Si los controles no están funcionando, el auditor debe obtener evidencia de auditoría exclusivamente de las pruebas sustantivas, sin mantener la confianza prevista en los controles.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-02",
        "pagina": 3334
      }
    },
    {
      "id": "SIT-014",
      "categoria": "situacional",
      "tema": "evidencia",
      "puntoGolpe": 3,
      "fase": "0001",
      "dificultad": "alta",
      "enunciado": "El auditor selecciona una muestra por juicio y, con sus resultados, pretende sacar conclusiones sobre el total de la población. ¿Qué debe hacer?",
      "opciones": [
        "a) No extrapolar el resultado; si necesita extrapolar, debe emplear muestreo estadístico.",
        "b) Extrapolar el resultado, siempre que documente los criterios de selección utilizados.",
        "c) Aumentar el tamaño de la muestra por juicio hasta cubrir la mayor parte de la población.",
        "d) Presentar los resultados como representativos si no se detectaron desviaciones."
      ],
      "correcta": 0,
      "explicacion": "El muestreo intencional, por juicio u opinático, no se puede usar si el objetivo es extrapolar los resultados; para extrapolar se requiere un método de muestreo estadístico que asegure representatividad.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-08",
        "pagina": 3295
      }
    },
    {
      "id": "SIT-015",
      "categoria": "situacional",
      "tema": "independencia/ética",
      "puntoGolpe": 4,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "Un auditor asignado descubre a mitad de la auditoría que su cuñado es el contador principal del sujeto auditado. ¿Qué debe hacer?",
      "opciones": [
        "a) Continuar el trabajo y comunicarlo al jefe de grupo al concluir la auditoría.",
        "b) Dejar la situación documentada en un papel de trabajo y no informar a nadie.",
        "c) Pedir al sujeto auditado que sustituya al contador durante la auditoría.",
        "d) Declarar la incompatibilidad a su jefe inmediato para que se adopten medidas."
      ],
      "correcta": 3,
      "explicacion": "El Acta de declaración de incompatibilidad se actualiza en el transcurso de la auditoría; cualquier auditor puede declarar a su jefe inmediato su incompatibilidad con el sujeto auditado para que se tomen las medidas correspondientes.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-01",
        "pagina": 3256
      }
    },
    {
      "id": "SIT-016",
      "categoria": "situacional",
      "tema": "independencia/ética",
      "puntoGolpe": 4,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "El jefe de grupo conoce que un auditor mantiene una amistad cercana con el directivo cuya área será examinada. ¿Qué debe hacer?",
      "opciones": [
        "a) Exigirle una declaración escrita de objetividad y mantenerlo en la misma área.",
        "b) Eliminar la amenaza a la independencia, incluso mediante la reasignación del auditor.",
        "c) Mantenerlo, porque la amistad no está incluida entre las causales de incompatibilidad.",
        "d) Consultar al sujeto auditado si acepta que ese auditor permanezca en el grupo."
      ],
      "correcta": 1,
      "explicacion": "Entre las responsabilidades del jefe de grupo está realizar acciones para eliminar cualquier amenaza a la independencia del auditor y del experto, y garantizar que la auditoría se ejecute por auditores en los que no concurran causales de incompatibilidad.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G02",
        "pagina": 3379
      }
    },
    {
      "id": "SIT-017",
      "categoria": "situacional",
      "tema": "independencia/ética",
      "puntoGolpe": 4,
      "fase": "0002",
      "dificultad": "alta",
      "enunciado": "El auditor prevé utilizar el trabajo de la auditoría interna, pero el auditor interno responde directamente ante el directivo cuya gestión se examina y la administración limitó su alcance. ¿Qué debe hacer?",
      "opciones": [
        "a) Utilizar el trabajo, porque el auditor interno conoce mejor la entidad.",
        "b) Utilizarlo solo si sus conclusiones coinciden con las del auditor externo.",
        "c) Evaluar la independencia, la objetividad y las restricciones antes de utilizarlo.",
        "d) Sustituir el trabajo interno por el de un experto sin realizar ninguna valoración."
      ],
      "correcta": 2,
      "explicacion": "Al utilizar el trabajo del auditor interno se debe tener en cuenta su independencia y objetividad, competencia, alcance del trabajo, relación costo-rendimiento, comportamiento ético, y el efecto de cualquier restricción impuesta por la administración.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-02",
        "pagina": 3334
      }
    },
    {
      "id": "SIT-018",
      "categoria": "situacional",
      "tema": "independencia/ética",
      "puntoGolpe": 4,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "Se constituye la comisión técnica para resolver un recurso de apelación y se propone integrarla con un auditor que participó en la acción de control impugnada. ¿Qué debe hacer la autoridad facultada?",
      "opciones": [
        "a) Excluirlo y designar auditores o supervisores que no hayan participado en la acción.",
        "b) Incluirlo como asesor técnico, sin derecho a voto en las deliberaciones.",
        "c) Mantenerlo si el recurrente manifiesta expresamente que no tiene objeción alguna.",
        "d) Encargarle solo la revisión documental, para evitar un conflicto de intereses."
      ],
      "correcta": 0,
      "explicacion": "La comisión técnica es un grupo temporal que puede estar constituido por auditores y supervisores que no participaron en la acción de control; sus integrantes suscriben el Acta de declaración de incompatibilidad.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "SIT-019",
      "categoria": "situacional",
      "tema": "independencia/ética",
      "puntoGolpe": 4,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "Para valorar un aspecto técnico se propone un experto que mantiene un contrato comercial con el proveedor involucrado en los hechos. ¿Qué debe hacer el auditor?",
      "opciones": [
        "a) Utilizarlo con un acuerdo de confidencialidad sobre la información de la auditoría.",
        "b) Utilizarlo solo para el análisis de datos y reservar la opinión al grupo de auditoría.",
        "c) Dejar la decisión al sujeto auditado, que es quien conoce al proveedor.",
        "d) Evaluar la ausencia de conflictos de intereses y no utilizarlo si el conflicto persiste."
      ],
      "correcta": 3,
      "explicacion": "Durante la utilización del trabajo de un experto es necesario evaluar la ausencia de conflictos de intereses para los fines de la auditoría; si el conflicto se mantiene, no procede utilizar su trabajo.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-02",
        "pagina": 3334
      }
    },
    {
      "id": "SIT-020",
      "categoria": "situacional",
      "tema": "independencia/ética",
      "puntoGolpe": 4,
      "fase": "transversal",
      "dificultad": "alta",
      "enunciado": "El auditor adopta decisiones clave sobre el muestreo y la evaluación de un hallazgo, pero no deja constancia del razonamiento seguido. El supervisor le señala que debe poder demostrar su imparcialidad. ¿Qué debe hacer?",
      "opciones": [
        "a) Firmar una nueva acta de incompatibilidad y archivar el asunto.",
        "b) Documentar las decisiones clave y el razonamiento que las sustenta.",
        "c) Explicar oralmente esas decisiones en la reunión final con el auditado.",
        "d) Retirar del expediente las notas que puedan suscitar dudas sobre su criterio."
      ],
      "correcta": 1,
      "explicacion": "Es importante documentar las decisiones claves tomadas para demostrar la independencia e imparcialidad del auditor en su análisis, así como los hechos relevantes considerados y las acciones realizadas al respecto.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-021",
      "categoria": "situacional",
      "tema": "documentación/custodia",
      "puntoGolpe": 5,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "Transcurridos tres años desde que concluyó una auditoría, un directivo propone eliminar el expediente para liberar espacio en el archivo. ¿Qué debe hacer la unidad de auditoría?",
      "opciones": [
        "a) Eliminarlo, pues no existe litigio ni reclamación pendiente sobre esa auditoría.",
        "b) Conservarlo hasta cumplir los cinco años y después transferirlo al Archivo central.",
        "c) Digitalizarlo y destruir los originales para reducir el volumen documental.",
        "d) Conservar solo el informe final y eliminar los papeles de trabajo."
      ],
      "correcta": 1,
      "explicacion": "El Expediente de la auditoría se conserva durante cinco años en el archivo de la unidad organizativa de auditoría; el plazo se extiende cuando el contenido o uso frecuente lo justifique y, transcurrido el término, se transfiere al Archivo central.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-022",
      "categoria": "situacional",
      "tema": "documentación/custodia",
      "puntoGolpe": 5,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "Un expediente está formado por tres legajos. El auditor numera las hojas de cada legajo por separado, comenzando por el 1 en cada uno. ¿Qué corrección procede?",
      "opciones": [
        "a) Mantener la numeración por legajo y añadir el número del legajo al lado.",
        "b) Numerar solo las hojas del primer legajo y dejar los otros sin numerar.",
        "c) Numerar las hojas en el extremo superior derecho, comenzando por el último legajo.",
        "d) Numerar todas las hojas de forma consecutiva, por única vez y en el margen inferior."
      ],
      "correcta": 3,
      "explicacion": "Concluida la confección del Expediente, todas las hojas que lo conforman se enumeran de abajo hacia arriba, por única vez, consecutivamente en el margen inferior, a tinta o bolígrafo, independientemente de la cantidad de legajos.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-023",
      "categoria": "situacional",
      "tema": "documentación/custodia",
      "puntoGolpe": 5,
      "fase": "0002",
      "dificultad": "basica",
      "enunciado": "Después de numerado un tema, es necesario intercalar dos hojas entre la X-3/14 y la X-4/14. ¿Cómo deben identificarse?",
      "opciones": [
        "a) Como X-3.a/14 y X-3.b/14, añadiendo una letra al número anterior.",
        "b) Como X-3.1/14 y X-3.2/14, para conservar el orden decimal.",
        "c) Renumerando todas las hojas siguientes y ajustando el total del tema.",
        "d) Como X-4/14 y X-5/14, y desplazar las demás una posición."
      ],
      "correcta": 0,
      "explicacion": "Si después de numerada la documentación de un tema surge la necesidad de intercalar hojas, se les asigna el número de orden de la hoja inmediata anterior a donde se desean ubicar y se adiciona una letra; en el ejemplo, X-3.a/14 y X-3.b/14.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-024",
      "categoria": "situacional",
      "tema": "documentación/custodia",
      "puntoGolpe": 5,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "Se levantan actas de declaración y se realiza un muestreo físico de inventarios. Un auditor propone elaborar esos documentos a lápiz para corregir errores con facilidad. ¿Qué debe hacer?",
      "opciones": [
        "a) Usar lápiz y luego pasar los documentos a limpio al finalizar la auditoría.",
        "b) Elaborarlos en formato digital sin firma y guardarlos en el expediente.",
        "c) Imprimirlos y no usar lápiz, porque llevan firma de los responsables.",
        "d) Permitir el lápiz si el jefe de grupo revisa y firma cada hoja."
      ],
      "correcta": 2,
      "explicacion": "Las actas de declaración, los arqueos del efectivo, el muestreo físico de inventarios, de activos fijos tangibles y otros que deben ser firmados por los responsables tienen que ser impresos y no se pueden hacer a lápiz de grafito.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-025",
      "categoria": "situacional",
      "tema": "documentación/custodia",
      "puntoGolpe": 5,
      "fase": "0003",
      "dificultad": "media",
      "enunciado": "El expediente de una auditoría contiene un informe con información oficial clasificada. ¿Qué debe hacer el auditor?",
      "opciones": [
        "a) Excluir el informe del expediente para evitar cualquier riesgo de divulgación.",
        "b) Guardarlo sin registrarlo en el índice y limitar su conocimiento al jefe de grupo.",
        "c) Incluir una copia en cada legajo para facilitar su consulta por el grupo.",
        "d) Dejar evidencia en el índice y aplicar las normas sobre información clasificada."
      ],
      "correcta": 3,
      "explicacion": "Cuando el Informe, documentos o papeles de trabajo contengan información que exija ser clasificada, además de dejar evidencia en el Índice del Expediente sobre su ubicación, se aplican las normas y procedimientos para el registro, tramitación y control de la información oficial clasificada.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-026",
      "categoria": "situacional",
      "tema": "documentación/custodia",
      "puntoGolpe": 5,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "Los papeles de trabajo se elaboran en formato digital y no se gestionan mediante una aplicación específica para expedientes. ¿Qué requisito deben cumplir?",
      "opciones": [
        "a) Guardarse en formato editable para que cualquier auditor pueda actualizarlos.",
        "b) Imprimirse todos antes de cerrar la auditoría y descartar los archivos digitales.",
        "c) Guardarse en PDF con seguridad para acceso, copias y modificaciones, y con respaldo.",
        "d) Almacenarse en un correo institucional para asegurar su disponibilidad."
      ],
      "correcta": 2,
      "explicacion": "Los documentos y papeles de trabajo que se llevan al Expediente en formato digital, no gestionados por aplicaciones específicas, se guardan en PDF con su correspondiente nivel de seguridad para acceso, copias y modificaciones; si el medio no es papel deben tomarse medidas para obtener copias de seguridad.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-027",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "El sujeto auditado presenta la consulta de medidas disciplinarias y el grupo de auditoría no coincide con la propuesta. El sujeto no acompaña la fundamentación escrita de sus nuevos análisis. ¿Qué procede?",
      "opciones": [
        "a) Aceptar la propuesta para no retrasar el cierre de la fase de seguimiento.",
        "b) Requerir la fundamentación por escrito y, sin consenso, elevar el caso al jefe máximo.",
        "c) Aplicar directamente las medidas que considere el grupo, sin nueva consulta.",
        "d) Archivar la consulta y dejar constancia de que no hubo acuerdo entre las partes."
      ],
      "correcta": 1,
      "explicacion": "De existir discrepancia con la consulta de las medidas disciplinarias, el sujeto auditado debe presentar por escrito la fundamentación de los nuevos análisis y propuestas; si no coinciden los criterios y no se alcanza consenso, el jefe de la unidad interesa a su jefe máximo para valorar el hecho y llegar a una conclusión.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "SIT-028",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "Agotadas las gestiones de la unidad, el sujeto auditado no presenta las propuestas de medidas disciplinarias ni el Plan de medidas. ¿Qué debe hacer la unidad organizativa de auditoría?",
      "opciones": [
        "a) Informar a su jefe máximo para los análisis pertinentes, a fin de lograr el cumplimiento.",
        "b) Elaborar y aprobar el Plan de medidas desde la unidad, sin intervención del sujeto.",
        "c) Informar directamente a los trabajadores para que exijan su cumplimiento.",
        "d) Archivar el expediente y esperar a la próxima auditoría para reiterar el señalamiento."
      ],
      "correcta": 0,
      "explicacion": "Cuando el sujeto auditado no presenta las propuestas de las medidas disciplinarias o del Plan de medidas, la unidad organizativa de auditoría, una vez agotadas las acciones que le corresponden, informa a su jefe máximo para los análisis pertinentes, con el empeño de lograr que cumpla lo establecido.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "SIT-029",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "basica",
      "enunciado": "El sujeto auditado entrega el Plan de medidas aprobado para dar solución a los señalamientos. ¿Qué debe hacer la unidad que ejecutó la auditoría?",
      "opciones": [
        "a) Retenerlo hasta la siguiente auditoría para comprobar su cumplimiento.",
        "b) Remitirlo a la Contraloría General sin revisarlo ni dejar constancia.",
        "c) Recibirlo, archivarlo en el Expediente y enviar por escrito la aceptación.",
        "d) Devolverlo para que el sujeto lo apruebe nuevamente antes de archivarlo."
      ],
      "correcta": 2,
      "explicacion": "Entre las actividades del primer paso del seguimiento está la recepción y archivo en el Expediente de la auditoría del Plan de medidas aprobado; cuando lo recibe, la unidad envía por escrito al sujeto la aceptación mediante la Carta al sujeto de la acción de prevención y control.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "SIT-030",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "basica",
      "enunciado": "El jefe máximo del sujeto auditado informa por escrito que ya aplicó las medidas disciplinarias. ¿Qué corresponde al jefe de la unidad organizativa de auditoría?",
      "opciones": [
        "a) Indicar una visita al centro para verificar su aplicación y dejar constancia.",
        "b) Aceptar la información como prueba suficiente y cerrar el seguimiento.",
        "c) Esperar la próxima auditoría ordinaria para comprobar la aplicación de las medidas.",
        "d) Solicitar únicamente una certificación del departamento de recursos humanos."
      ],
      "correcta": 0,
      "explicacion": "En el segundo paso del seguimiento, el jefe de la unidad organizativa, tras recibir del jefe máximo del sujeto la notificación de las medidas disciplinarias aplicadas, indica una visita al centro auditado para verificarlas y deja constancia en el Expediente de la auditoría.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "SIT-031",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "alta",
      "enunciado": "Ha transcurrido cuatro meses desde la entrega del Plan de medidas y se requiere verificar su cumplimiento e impacto. ¿Qué procede?",
      "opciones": [
        "a) Realizar la verificación de inmediato, dentro de los treinta días siguientes.",
        "b) Esperar dos años para que el sujeto pueda ejecutar la totalidad de las acciones.",
        "c) Limitarse a revisar por escrito el estado de cumplimiento enviado por el sujeto.",
        "d) Programar una comprobación especial entre seis meses y un año desde la entrega."
      ],
      "correcta": 3,
      "explicacion": "Para las auditorías que lo requieran, según los objetivos o temas evaluados, se puede llevar a cabo una comprobación especial para el seguimiento del Plan de medidas, recomendaciones e impactos, en un término de seis meses y hasta un año a partir de la entrega del Plan de medidas.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "SIT-032",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "La comisión técnica necesita realizar verificaciones en la entidad para corroborar lo expuesto por el recurrente. ¿Qué debe hacer antes de efectuarlas?",
      "opciones": [
        "a) Ejecutarlas sin aviso, para evitar que se alteren las pruebas disponibles.",
        "b) Obtener autorización previa de la autoridad facultada y dejar evidencia.",
        "c) Realizarlas y solicitar la autorización correspondiente al concluir la revisión.",
        "d) Delegarlas en el jefe de la entidad y limitarse a recibir su informe."
      ],
      "correcta": 1,
      "explicacion": "La comisión técnica puede realizar verificaciones con el propósito de corroborar lo expuesto por el recurrente, previa autorización de la autoridad facultada, de lo que debe quedar evidencia en el expediente del recurso de apelación.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "SIT-033",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "La comisión técnica concluye que algunos de los aspectos impugnados son procedentes y otros no. ¿Cómo debe declararse la inconformidad en el dictamen?",
      "opciones": [
        "a) Con lugar en parte, y proponer la modificación parcial del informe de la acción de control.",
        "b) Sin lugar, y ratificar en su totalidad el informe de la acción de control impugnado.",
        "c) Con lugar, y proponer la invalidación total del informe de la acción de control.",
        "d) Improcedente, y archivar el recurso sin emitir pronunciamiento sobre los hechos."
      ],
      "correcta": 0,
      "explicacion": "En las conclusiones del dictamen se declara con lugar, con lugar en parte o sin lugar la inconformidad, y la decisión de ratificar, modificar parcialmente el informe o proponer su invalidación se argumenta con evidencias suficientes y apropiadas.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "SIT-034",
      "categoria": "situacional",
      "tema": "señalamientos/seguimiento",
      "puntoGolpe": 6,
      "fase": "0003",
      "dificultad": "alta",
      "enunciado": "Durante la auditoría se detecta un presunto hecho delictivo y se elabora el Informe especial. El jefe de grupo pregunta si debe entregarlo al máximo jefe administrativo junto con el informe de la auditoría. ¿Qué procede?",
      "opciones": [
        "a) Entregar ambos informes al máximo jefe administrativo y dejar constancia escrita.",
        "b) Presentarlo al órgano penal antes de informar al sujeto, no al jefe administrativo.",
        "c) Notificar primero al sujeto los resultados finales y después remitir el Informe especial.",
        "d) Enviar copia del Informe especial al Consejo de Dirección para que adopte medidas."
      ],
      "correcta": 1,
      "explicacion": "El Informe especial solo se entrega al órgano de instrucción penal correspondiente o a la autoridad facultada; el jefe de grupo lo presenta antes de informar al sujeto los resultados finales y sin hacer entrega del referido informe al jefe administrativo.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0003-01",
        "pagina": 3350
      }
    },
    {
      "id": "SIT-035",
      "categoria": "situacional",
      "tema": "plazos/oportunidad",
      "puntoGolpe": 1,
      "fase": "0003",
      "dificultad": "media",
      "enunciado": "Ya se realizó la reunión de información de los resultados finales al Consejo de Dirección. ¿En qué término debe el jefe de grupo notificar el informe al máximo nivel de dirección del sujeto auditado?",
      "opciones": [
        "a) Dentro de los cinco días naturales siguientes a la reunión.",
        "b) Dentro de los treinta días hábiles siguientes a la reunión.",
        "c) Dentro de los diez días hábiles siguientes a la reunión.",
        "d) Dentro de las veinticuatro horas siguientes a la reunión."
      ],
      "correcta": 2,
      "explicacion": "El resultado de la auditoría se notifica mediante informe que presenta el jefe de grupo al máximo nivel de dirección del sujeto auditado, dentro del término de hasta diez días hábiles siguientes a la reunión de información de resultado al Consejo de Dirección.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "SIT-036",
      "categoria": "situacional",
      "tema": "plazos/oportunidad",
      "puntoGolpe": 1,
      "fase": "0001",
      "dificultad": "basica",
      "enunciado": "Un auditor arriba a una entidad cubana con intereses en el exterior para iniciar una auditoría. ¿En qué plazo debe informar al embajador o jefe de misión los objetivos y el alcance del trabajo?",
      "opciones": [
        "a) Dentro de los tres días hábiles siguientes a su arribo.",
        "b) Dentro de los diez días hábiles siguientes a su arribo.",
        "c) Antes de concluir la primera semana de trabajo en la entidad.",
        "d) Dentro de las veinticuatro horas posteriores a su arribo."
      ],
      "correcta": 3,
      "explicacion": "En las auditorías a entidades con intereses en el extranjero, el auditor debe informar, en un plazo de 24 horas después de su arribo, los objetivos y el alcance del trabajo al embajador o jefe de la misión del Estado cubano y a los representantes de las entidades cubanas.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-01",
        "pagina": 3256
      }
    },
    {
      "id": "SIT-037",
      "categoria": "situacional",
      "tema": "plazos/oportunidad",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "La Dirección de Calidad recibe el borrador del informe, el expediente y los documentos requeridos para iniciar la supervisión superior. ¿En qué plazo debe garantizarla?",
      "opciones": [
        "a) En un plazo de hasta tres días hábiles desde la recepción de esos documentos.",
        "b) En un plazo de hasta diez días hábiles desde la recepción de esos documentos.",
        "c) En un plazo de hasta veinte días naturales desde la recepción de esos documentos.",
        "d) En un plazo de hasta treinta días hábiles desde la recepción de esos documentos."
      ],
      "correcta": 1,
      "explicacion": "Los auditores de la dirección, departamentos y Comité de Control de Calidad deben garantizar la supervisión superior en un plazo de hasta 10 días hábiles, contados a partir de la recepción del borrador del informe, del informe especial y los expedientes correspondientes.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G02",
        "pagina": 3379
      }
    },
    {
      "id": "SIT-038",
      "categoria": "situacional",
      "tema": "plazos/oportunidad",
      "puntoGolpe": 1,
      "fase": "0004",
      "dificultad": "basica",
      "enunciado": "El sujeto auditado presenta la consulta de la propuesta de medidas disciplinarias. ¿Dentro de qué término debe el auditor evaluarla y emitir sus criterios?",
      "opciones": [
        "a) Dentro de los diez días hábiles subsiguientes a la presentación.",
        "b) Dentro de los veinte días hábiles subsiguientes a la presentación.",
        "c) Dentro de los treinta días naturales subsiguientes a la presentación.",
        "d) Dentro de los cinco días hábiles subsiguientes a la presentación."
      ],
      "correcta": 3,
      "explicacion": "El auditor evalúa y emite criterios tras recibir la consulta de la propuesta de las medidas disciplinarias a aplicar por la administración, dentro del término de los cinco días hábiles subsiguientes a la presentación de estas.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "SIT-039",
      "categoria": "situacional",
      "tema": "plazos/oportunidad",
      "puntoGolpe": 1,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "El informe de la auditoría fue notificado al sujeto auditado y este decide presentar un recurso de apelación. ¿Cuál es el término para hacerlo?",
      "opciones": [
        "a) Veinte días hábiles siguientes a la notificación del informe.",
        "b) Veinte días naturales siguientes a la notificación del informe.",
        "c) Diez días hábiles siguientes a la notificación del informe.",
        "d) Treinta días hábiles siguientes a la notificación del informe."
      ],
      "correcta": 0,
      "explicacion": "El jefe de la entidad sujeto de la acción de control recibe y tramita los recursos de apelación y los presenta dentro del término de veinte días hábiles siguientes a la notificación del informe, ante la autoridad que corresponda.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "SIT-040",
      "categoria": "situacional",
      "tema": "plazos/oportunidad",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "alta",
      "enunciado": "El sujeto auditado incumple sus obligaciones y el jefe de la unidad organizativa de auditoría informa por escrito al jefe inmediato superior de aquel. ¿En qué término debe resolverse lo dispuesto?",
      "opciones": [
        "a) En un plazo de hasta cinco días hábiles a partir de su recepción.",
        "b) En un plazo de hasta diez días hábiles a partir de su recepción.",
        "c) En un plazo de hasta tres días hábiles a partir de su recepción.",
        "d) En un plazo de hasta veinticuatro horas a partir de su recepción."
      ],
      "correcta": 2,
      "explicacion": "Ante el incumplimiento de las obligaciones de los sujetos de la auditoría, el jefe de la unidad organizativa que la ejecuta informa por escrito al jefe inmediato superior del referido sujeto sobre la violación en que incurrió, para que se resuelva lo dispuesto en el término de hasta tres días hábiles a partir de su recepción.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "CON-001",
      "categoria": "contenido",
      "tema": "planeación/estrategia",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "Al iniciar la fase de planeación, el auditor debe decidir cómo organizará el trabajo. ¿Cuál es la secuencia que establece el procedimiento?",
      "opciones": [
        "a) Preparar el programa, el plan general y el plan individual y, a partir de ellos, definir la estrategia.",
        "b) Elaborar la matriz de planeación y, solo al concluir la realización, definir la estrategia.",
        "c) Desarrollar primero una estrategia sobre alcance, tiempo y realización y, sobre esa base, preparar el programa o matriz y los planes de trabajo.",
        "d) Redactar el borrador del informe y, según sus resultados, fijar la estrategia y el programa."
      ],
      "correcta": 2,
      "explicacion": "La planeación tiene dos momentos: primero el auditor desarrolla una estrategia que indique alcance, tiempo y realización; segundo, sobre esa estrategia, prepara el programa de auditoría o matriz de planeación, el plan de trabajo general y el plan de trabajo individual.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001",
        "pagina": 3254
      }
    },
    {
      "id": "CON-002",
      "categoria": "contenido",
      "tema": "planeación/orden de trabajo",
      "puntoGolpe": 5,
      "fase": "0001",
      "dificultad": "basica",
      "enunciado": "¿Qué sujetos están exentos de emitir la Orden de trabajo?",
      "opciones": [
        "a) Las sociedades que realizan la auditoría externa y el auditor interno de base.",
        "b) Las unidades centrales de auditoría interna y los supervisores.",
        "c) La Contraloría General y las contralorías provinciales.",
        "d) Los grupos multidisciplinarios y los expertos convocados."
      ],
      "correcta": 0,
      "explicacion": "Las sociedades que realizan la auditoría externa, así como el auditor interno de base, están exentos de emitir la Orden de trabajo. Los demás sujetos la elaboran y firman mediante la plantilla P-0001-02.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-01",
        "pagina": 3256
      }
    },
    {
      "id": "CON-003",
      "categoria": "contenido",
      "tema": "planeación/reunión de inicio",
      "puntoGolpe": 4,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "En la reunión de inicio, además de entregar y leer la Carta de presentación, ¿qué aspecto ético debe dar a conocer el jefe de grupo?",
      "opciones": [
        "a) El régimen disciplinario aplicable a los trabajadores de la entidad.",
        "b) El comportamiento ético que deben asumir los auditores en su conducta y en las relaciones con el personal auditado.",
        "c) El monto estimado de los daños y perjuicios que se informarán.",
        "d) La identidad de los presuntos responsables de las deficiencias."
      ],
      "correcta": 1,
      "explicacion": "El jefe de grupo da a conocer el comportamiento ético que deben asumir los auditores en cuanto a conducta durante su trabajo y en sus relaciones con el personal auditado, e informa sobre otros aspectos de interés.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-02",
        "pagina": 3260
      }
    },
    {
      "id": "CON-004",
      "categoria": "contenido",
      "tema": "planeación/visión sistémica",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "En el análisis de la visión sistémica de la entidad, ¿cómo se clasifican los factores externos?",
      "opciones": [
        "a) Administrativos, financieros y comerciales.",
        "b) Internos, externos y estratégicos.",
        "c) De producción, información y recursos humanos.",
        "d) Del entorno próximo (actores) y del entorno remoto (fuerzas)."
      ],
      "correcta": 3,
      "explicacion": "El análisis de la visión sistémica contempla factores internos y externos. Los externos se dividen en factores del entorno próximo (actores) y factores del entorno remoto (fuerzas de tipo social, económico, político, demográfico o regulatorio).",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-03",
        "pagina": 3262
      }
    },
    {
      "id": "CON-005",
      "categoria": "contenido",
      "tema": "planeación/disposiciones jurídicas",
      "puntoGolpe": 4,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "Ante la detección de situaciones indicativas de presuntos hechos delictivos o de corrupción, ¿qué plantilla se utiliza para informar?",
      "opciones": [
        "a) P-001-G07 Nota informativa.",
        "b) P-001-G03 Acta de declaración.",
        "c) P-0001-02 Orden de trabajo.",
        "d) P-G02-02 Acta de supervisión."
      ],
      "correcta": 0,
      "explicacion": "El auditor debe estar alerta a situaciones indicativas de presuntos hechos delictivos y de corrupción; ante su presencia, el jefe de grupo y el auditor interno de base informan conforme a la legislación vigente utilizando la plantilla P-001-G07 Nota informativa.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-04",
        "pagina": 3264
      }
    },
    {
      "id": "CON-006",
      "categoria": "contenido",
      "tema": "planeación/tipo de compromiso",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "¿Qué tipo de compromiso corresponde siempre a la auditoría financiera?",
      "opciones": [
        "a) Compromiso directo, porque el auditor selecciona la materia controlada.",
        "b) Compromiso mixto, según el nivel de aseguramiento acordado.",
        "c) Compromiso de certificación, porque se basa en la información financiera presentada por la parte responsable.",
        "d) Compromiso de cumplimiento, por los criterios legales aplicables."
      ],
      "correcta": 2,
      "explicacion": "La auditoría financiera siempre es un compromiso de certificación, ya que se basa en la información financiera presentada por la parte responsable. Las auditorías de desempeño, fiscal y forense normalmente son compromisos directos.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-05",
        "pagina": 3266
      }
    },
    {
      "id": "CON-007",
      "categoria": "contenido",
      "tema": "planeación/riesgo de auditoría",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "¿Cuál es la expresión del modelo de riesgo de auditoría y el nivel habitual para una seguridad razonable?",
      "opciones": [
        "a) RA = RI + RC + RD; riesgo de 95 % y confianza de 5 %.",
        "b) RA = RI × RC ÷ RD; riesgo de 10 % y confianza de 90 %.",
        "c) RA = (RI + RC) × RD; riesgo de 1 % y confianza de 99 %.",
        "d) RA = RI × RC × RD; riesgo de 5 % y confianza de 95 %."
      ],
      "correcta": 3,
      "explicacion": "El riesgo de auditoría se obtiene multiplicando el riesgo inherente, el riesgo de control y el riesgo de detección. Normalmente es del 5 % para auditorías con seguridad razonable, de lo que resulta un nivel de confianza del 95 %.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-06",
        "pagina": 3270
      }
    },
    {
      "id": "CON-008",
      "categoria": "contenido",
      "tema": "materialidad/error tolerable",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "basica",
      "enunciado": "El auditor fija el error tolerable en 50 % de la materialidad predeterminada. ¿Qué porcentaje corresponde al umbral de resumen de diferencias?",
      "opciones": [
        "a) 3 % de la materialidad predeterminada.",
        "b) 5 % de la materialidad predeterminada.",
        "c) 10 % de la materialidad predeterminada.",
        "d) 50 % de la materialidad predeterminada."
      ],
      "correcta": 1,
      "explicacion": "Cuando el error tolerable se establece al 50 % de la materialidad predeterminada, el umbral de resumen de diferencias es el 5 % de esa materialidad. Si el error tolerable fuera del 75 %, correspondería el 3 %.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "CON-009",
      "categoria": "contenido",
      "tema": "materialidad/cualitativa",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "alta",
      "enunciado": "¿Qué caracteriza a la materialidad cualitativa por naturaleza?",
      "opciones": [
        "a) Depende solo del importe monetario y se calcula con un porcentaje de una base.",
        "b) Comprende incumplimientos materiales por sus características inherentes, como fraude, ilegalidad o alto interés público, aunque su cuantía sea menor.",
        "c) Se refiere exclusivamente a errores de clasificación contable sin efecto en las decisiones.",
        "d) Solo se aplica en la fase de seguimiento para evaluar el Plan de medidas."
      ],
      "correcta": 1,
      "explicacion": "La materialidad por naturaleza se relaciona con las características inherentes del asunto e incluye cualquier sospecha de mala gestión, fraude, ilegalidad, irregularidad, tergiversación o falsificación intencional, así como incumplimientos en áreas de alto interés público, con independencia de su valor monetario.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "CON-010",
      "categoria": "contenido",
      "tema": "materialidad/riesgo",
      "puntoGolpe": 2,
      "fase": "0001",
      "dificultad": "alta",
      "enunciado": "¿Cómo es la relación entre el riesgo de error material y el nivel de materialidad?",
      "opciones": [
        "a) Directa: a mayor riesgo, mayor materialidad y menos pruebas.",
        "b) Inversa: a mayor riesgo, menor materialidad y más pruebas de control o procedimientos sustanciales.",
        "c) Independiente: el riesgo no incide en la selección del porcentaje de materialidad.",
        "d) Proporcional al tamaño de la muestra, sin relación con las pruebas."
      ],
      "correcta": 1,
      "explicacion": "Existe una relación inversa entre materialidad y riesgo: a mayor riesgo de error material, menor nivel de materialidad, lo que conduce a efectuar más pruebas de control o procedimientos sustanciales, y viceversa.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-07",
        "pagina": 3285
      }
    },
    {
      "id": "CON-011",
      "categoria": "contenido",
      "tema": "muestreo",
      "puntoGolpe": 3,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "¿Qué condición debe cumplir una selección para considerarse muestreo de auditoría?",
      "opciones": [
        "a) Examinar cuando menos el 50 % de las unidades de la población.",
        "b) Seleccionar únicamente las partidas de mayor importe.",
        "c) Aplicar procedimientos a menos del 100 % de las unidades y dar a todas la oportunidad de ser seleccionadas.",
        "d) Elegir las unidades según la disponibilidad de documentación."
      ],
      "correcta": 2,
      "explicacion": "El muestreo de auditoría es la aplicación de procedimientos a menos del ciento por ciento de las partidas de una población, de tal modo que todas las unidades tengan una oportunidad de selección y el auditor obtenga una base razonable para concluir sobre la población entera.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-08",
        "pagina": 3295
      }
    },
    {
      "id": "CON-012",
      "categoria": "contenido",
      "tema": "planeación/matriz",
      "puntoGolpe": 3,
      "fase": "0001",
      "dificultad": "media",
      "enunciado": "Al elaborar la matriz de planeación, ¿cómo deben ser las preguntas de auditoría?",
      "opciones": [
        "a) Abiertas y redundantes, para cubrir varios objetivos a la vez.",
        "b) Complementarias y excluyentes entre sí, estructuradas en forma de pirámide.",
        "c) Independientes del objetivo general y centradas solo en los riesgos.",
        "d) Cerradas y limitadas a un único tema, sin subpreguntas."
      ],
      "correcta": 1,
      "explicacion": "Las preguntas deben ser complementarias y excluyentes entre sí. La mejor forma de establecerlas es presentarlas como una pirámide: una pregunta principal que responde al objetivo general y un número limitado de subpreguntas centradas en un solo tema que responden a los objetivos específicos.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-09",
        "pagina": 3305
      }
    },
    {
      "id": "CON-013",
      "categoria": "contenido",
      "tema": "planeación/plan individual",
      "puntoGolpe": 1,
      "fase": "0001",
      "dificultad": "basica",
      "enunciado": "¿Qué período abarca el Plan de trabajo individual?",
      "opciones": [
        "a) Todas las tareas a cumplir en el período de un mes.",
        "b) Las tareas de toda la fase de planeación.",
        "c) El período anual aprobado en el Plan anual de actividades.",
        "d) El tiempo total de ejecución de la auditoría."
      ],
      "correcta": 0,
      "explicacion": "En el Plan de trabajo individual se recogen todas las tareas a cumplir en el período de un mes, utilizando el modelo y término establecido para su aprobación en la legislación vigente.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0001-10",
        "pagina": 3309
      }
    },
    {
      "id": "CON-014",
      "categoria": "contenido",
      "tema": "evidencia/suficiencia y adecuación",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "basica",
      "enunciado": "¿Qué mide la suficiencia y qué mide la adecuación de la evidencia de auditoría?",
      "opciones": [
        "a) La suficiencia mide la calidad y la adecuación mide la cantidad.",
        "b) Ambas miden la cantidad, pero la adecuación se refiere al costo.",
        "c) La suficiencia mide la relevancia y la adecuación la oportunidad.",
        "d) La suficiencia mide la cantidad y la adecuación la calidad, esto es, relevancia, validez y confiabilidad."
      ],
      "correcta": 3,
      "explicacion": "La suficiencia es una medida de la cantidad de evidencia necesaria para sustentar resultados, hallazgos y conclusiones. La adecuación es una medición de la calidad de la evidencia y comprende relevancia, validez y confiabilidad.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002",
        "pagina": 3311
      }
    },
    {
      "id": "CON-015",
      "categoria": "contenido",
      "tema": "evidencia/procedimientos analíticos",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "¿Cuál es la limitación establecida para los procedimientos analíticos?",
      "opciones": [
        "a) Nunca deben ser la única técnica utilizada.",
        "b) Solo pueden aplicarse en la fase de seguimiento.",
        "c) Sustituyen a la confirmación externa cuando los datos son internos.",
        "d) No requieren evaluar la fiabilidad de los datos."
      ],
      "correcta": 0,
      "explicacion": "Los procedimientos analíticos pueden usarse en el análisis de riesgos y en la recopilación de evidencia, pero nunca deben ser la única técnica utilizada. Además, requieren de la fiabilidad de los datos internos o externos empleados.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-01",
        "pagina": 3313
      }
    },
    {
      "id": "CON-016",
      "categoria": "contenido",
      "tema": "evidencia/confirmación externa",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "¿Qué se entiende por confirmación externa?",
      "opciones": [
        "a) La comparación de saldos con los registros contables de la entidad.",
        "b) La evidencia obtenida como respuesta escrita directa de un tercero, en papel, medio electrónico u otro soporte.",
        "c) La declaración verbal del máximo dirigente durante la reunión de inicio.",
        "d) La revisión física de los documentos internos de la entidad."
      ],
      "correcta": 1,
      "explicacion": "La confirmación externa es la evidencia que se obtiene como respuesta escrita directa de un tercero, en papel, medio electrónico u otro soporte, sobre información que sustenta la opinión del auditor.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-01",
        "pagina": 3313
      }
    },
    {
      "id": "CON-017",
      "categoria": "contenido",
      "tema": "evidencia/escepticismo",
      "puntoGolpe": 4,
      "fase": "0002",
      "dificultad": "alta",
      "enunciado": "¿Cuál de estos riesgos busca minimizar el escepticismo profesional durante la auditoría?",
      "opciones": [
        "a) Que el auditor documente en exceso los papeles de trabajo.",
        "b) Que la muestra seleccionada sea demasiado grande.",
        "c) Pasar por alto circunstancias inusuales, generalizar en exceso y usar supuestos inapropiados.",
        "d) Que el informe se notifique antes del plazo establecido."
      ],
      "correcta": 2,
      "explicacion": "El auditor debe mantener el escepticismo profesional durante toda la auditoría para minimizar el riesgo de pasar por alto circunstancias inusuales, generalizar en exceso al extraer conclusiones y usar supuestos inapropiados al determinar la naturaleza, el tiempo y el alcance de los procedimientos.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-01",
        "pagina": 3313
      }
    },
    {
      "id": "CON-018",
      "categoria": "contenido",
      "tema": "evidencia/hallazgo",
      "puntoGolpe": 3,
      "fase": "0002",
      "dificultad": "media",
      "enunciado": "En los atributos del hallazgo de auditoría, ¿qué representan el criterio y la condición?",
      "opciones": [
        "a) El criterio es lo que es y la condición es lo que debería ser.",
        "b) El criterio es la evidencia y la condición es la recomendación.",
        "c) El criterio es la causa y la condición es el efecto.",
        "d) El criterio es lo que debería ser y la condición es lo que es."
      ],
      "correcta": 3,
      "explicacion": "El criterio es la norma o patrón base sobre la cual se mide la situación encontrada, es decir, lo que debería ser. La condición es la situación que existe, determinada y documentada durante la auditoría, es decir, lo que es.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0002-02",
        "pagina": 3334
      }
    },
    {
      "id": "CON-019",
      "categoria": "contenido",
      "tema": "informe/principios",
      "puntoGolpe": 6,
      "fase": "0003",
      "dificultad": "media",
      "enunciado": "¿Qué principio exige analizar e incorporar, cuando corresponda, las respuestas de la parte responsable?",
      "opciones": [
        "a) Objetividad.",
        "b) Integridad.",
        "c) Contradicción.",
        "d) Oportunidad."
      ],
      "correcta": 2,
      "explicacion": "El principio de contradicción requiere que el auditor analice e incorpore, cuando corresponda, las respuestas de la parte responsable, a partir de las notificaciones de resultados parciales y final.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0003",
        "pagina": 3346
      }
    },
    {
      "id": "CON-020",
      "categoria": "contenido",
      "tema": "informe/compromiso directo",
      "puntoGolpe": 5,
      "fase": "0003",
      "dificultad": "media",
      "enunciado": "Según el tipo de compromiso, ¿qué informes se elaboran en un compromiso directo?",
      "opciones": [
        "a) Dictamen e Informe de la auditoría.",
        "b) Solo el Informe de la auditoría.",
        "c) Solo el Dictamen.",
        "d) Informe especial y Dictamen."
      ],
      "correcta": 1,
      "explicacion": "En un compromiso de certificación se elaboran el Informe de la auditoría y el Dictamen. En un compromiso directo solo se elabora el Informe de la auditoría.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0003",
        "pagina": 3346
      }
    },
    {
      "id": "CON-021",
      "categoria": "contenido",
      "tema": "informe/informe especial",
      "puntoGolpe": 4,
      "fase": "0003",
      "dificultad": "alta",
      "enunciado": "¿A quién se entrega el Informe especial y qué alcance tiene su presentación?",
      "opciones": [
        "a) Solo al órgano de instrucción penal correspondiente o a la autoridad facultada; su presentación no constituye denuncia.",
        "b) Al máximo jefe del sujeto auditado, para que presente la denuncia.",
        "c) A la Asamblea Municipal y al Consejo de Dirección, con carácter público.",
        "d) A la dirección de Calidad, que lo remite al Contralor General."
      ],
      "correcta": 0,
      "explicacion": "El Informe especial solo se entrega al órgano de instrucción penal correspondiente o a la autoridad facultada, según proceda. Su presentación no constituye denuncia, dada la función pericial que en derecho corresponde al auditor.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0003-01",
        "pagina": 3350
      }
    },
    {
      "id": "CON-022",
      "categoria": "contenido",
      "tema": "informe/reunión final",
      "puntoGolpe": 6,
      "fase": "0003",
      "dificultad": "basica",
      "enunciado": "En la reunión final de información de resultados, ¿bajo qué condición puede ausentarse el máximo jefe del sujeto auditado?",
      "opciones": [
        "a) Cuando delegue en el jefe de grupo.",
        "b) Cuando lo solicite el supervisor.",
        "c) Cuando la reunión se realice con los trabajadores.",
        "d) Solo por causa debidamente justificada."
      ],
      "correcta": 3,
      "explicacion": "La reunión final se realiza con la presencia del máximo jefe del sujeto auditado, quien solo se ausentará por causa debidamente justificada. La misma regla se aplica en la reunión de información a los trabajadores.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0003-02",
        "pagina": 3357
      }
    },
    {
      "id": "CON-023",
      "categoria": "contenido",
      "tema": "seguimiento/beneficios",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "basica",
      "enunciado": "¿A quiénes beneficia la fase de seguimiento de la auditoría?",
      "opciones": [
        "a) A la parte responsable, al usuario previsto y al auditor.",
        "b) Solo al auditor y al órgano de instrucción penal.",
        "c) Solo a la parte responsable y a los expertos.",
        "d) A la Contraloría General y a las sociedades externas."
      ],
      "correcta": 0,
      "explicacion": "El seguimiento aporta beneficios a la parte responsable, porque demuestra la eficacia del sujeto auditado en la corrección de los problemas; al usuario previsto, al que actualiza sobre lo logrado; y al auditor, que puede evaluar la eficacia de su trabajo.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004",
        "pagina": 3361
      }
    },
    {
      "id": "CON-024",
      "categoria": "contenido",
      "tema": "seguimiento/consulta",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "Si el sujeto auditado discrepa de la consulta de medidas disciplinarias y no se alcanza consenso, ¿qué corresponde al jefe de la unidad organizativa de auditoría?",
      "opciones": [
        "a) Interesar a su jefe máximo para valorar el hecho y llegar a una conclusión.",
        "b) Aplicar directamente las medidas disciplinarias propuestas.",
        "c) Archivar la consulta sin dejar evidencia.",
        "d) Remitir el caso al órgano de instrucción penal."
      ],
      "correcta": 0,
      "explicacion": "Ante la discrepancia, el sujeto auditado presenta por escrito la fundamentación de sus nuevos análisis; si no hay consenso, el jefe de la unidad organizativa interesa a su jefe máximo para valorar el hecho y llegar a una conclusión, que puede derivar otros análisis y debe quedar como evidencia en el Expediente.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "CON-025",
      "categoria": "contenido",
      "tema": "seguimiento/plantillas",
      "puntoGolpe": 5,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "¿Qué plantilla se utiliza para recordar al sujeto auditado el vencimiento de los plazos de la consulta de medidas disciplinarias o del Plan de medidas?",
      "opciones": [
        "a) P-0003-02 Carta de remisión.",
        "b) P-G02-01 Acta de revisión.",
        "c) P-0004-01 Carta al sujeto de la acción de prevención y control.",
        "d) P-0001-02 Orden de trabajo."
      ],
      "correcta": 2,
      "explicacion": "El responsable de la unidad organizativa puede tramitar un escrito para recordar al sujeto auditado el vencimiento de cada plazo, utilizando la plantilla P-0004-01 Carta al sujeto de la acción de prevención y control.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "CON-026",
      "categoria": "contenido",
      "tema": "apelación/comisión",
      "puntoGolpe": 4,
      "fase": "0004",
      "dificultad": "alta",
      "enunciado": "¿Quiénes pueden integrar la comisión técnica que evalúa un recurso de apelación?",
      "opciones": [
        "a) Auditores y supervisores que no participaron en la acción de control, y expertos si el tema lo requiere.",
        "b) Los auditores que ejecutaron la acción de control y el recurrente.",
        "c) Solo el Contralor General y el jefe de la entidad auditada.",
        "d) Los trabajadores del sujeto auditado que presentaron la inconformidad."
      ],
      "correcta": 0,
      "explicacion": "La comisión técnica es un grupo temporal que puede estar constituido por auditores y supervisores que no participaron en la acción de control; cuando el tema objeto de discrepancias lo requiere, puede incorporar expertos designados por la autoridad facultada.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "CON-027",
      "categoria": "contenido",
      "tema": "apelación/incompatibilidad",
      "puntoGolpe": 4,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "¿Qué documento suscriben los integrantes de la comisión técnica para declarar que no tienen impedimentos?",
      "opciones": [
        "a) Acta de revisión (P-G02-01).",
        "b) Carta de remisión (P-0003-02).",
        "c) Nota informativa (P-001-G07).",
        "d) Acta de declaración de incompatibilidad (P-0001-01)."
      ],
      "correcta": 3,
      "explicacion": "Los integrantes de la comisión técnica rubrican el Acta de declaración de incompatibilidad, donde exponen que no existe impedimento por familiaridad, amistad u otros vínculos con el recurrente o con los auditores actuantes.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "CON-028",
      "categoria": "contenido",
      "tema": "documentación/papeles de trabajo",
      "puntoGolpe": 5,
      "fase": "transversal",
      "dificultad": "alta",
      "enunciado": "¿Qué tres elementos debe consignar el auditor en cada papel de trabajo?",
      "opciones": [
        "a) Fecha, firma y número de registro del auditor.",
        "b) Objetivo, alcance y materialidad.",
        "c) Título, índice y conclusión.",
        "d) Fuente, procedimientos y resultados."
      ],
      "correcta": 3,
      "explicacion": "En cada papel de trabajo se consignan la fuente (dónde obtuvo la evidencia), los procedimientos (qué hizo y con qué metodología) y los resultados (qué produjeron los procedimientos), además del cuño de identificación, la fecha y la firma.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "CON-029",
      "categoria": "contenido",
      "tema": "calidad/niveles",
      "puntoGolpe": 4,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "¿Cuáles son los niveles de aseguramiento de la calidad de la auditoría?",
      "opciones": [
        "a) Planear, ejecutar, informar y seguir.",
        "b) Autocontrol, revisión, censura y certificación.",
        "c) Diseño, implementación, operación y mejora.",
        "d) Elaborar, revisar, supervisar, supervisión superior y conformidad."
      ],
      "correcta": 3,
      "explicacion": "Los niveles de aseguramiento de calidad son: elaborar, revisar, supervisar, supervisión superior y conformidad. La censura del informe, cuando se indique, se realiza posterior a la supervisión superior.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G02",
        "pagina": 3379
      }
    },
    {
      "id": "CON-030",
      "categoria": "contenido",
      "tema": "calidad/autocontrol",
      "puntoGolpe": 5,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "¿Quién es el primer responsable de la calidad del proceso de auditoría a través del autocontrol?",
      "opciones": [
        "a) El jefe de la unidad organizativa.",
        "b) El supervisor designado.",
        "c) El Comité de Control de Calidad.",
        "d) El auditor o experto que elabora el trabajo."
      ],
      "correcta": 3,
      "explicacion": "El auditor o experto es el primer responsable de la calidad del proceso de auditoría a través del autocontrol. El jefe de grupo revisa en segunda instancia y el supervisor verifica en tercera instancia.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G02",
        "pagina": 3379
      }
    },
    {
      "id": "CON-031",
      "categoria": "contenido",
      "tema": "APC/transversales",
      "puntoGolpe": 5,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "En las acciones de prevención y control, ¿qué procedimientos transversales se consideran esenciales?",
      "opciones": [
        "a) Planeación, realización e informe.",
        "b) Muestreo, materialidad y riesgo.",
        "c) Documentación, comunicación y aseguramiento y control de calidad.",
        "d) Supervisión, censura y conformidad."
      ],
      "correcta": 2,
      "explicacion": "En la realización de las acciones de prevención y control se aplican las Normas Cubanas de Auditoría y los procedimientos del Capítulo I, siendo esenciales los procedimientos transversales de documentación, comunicación y aseguramiento y control de calidad.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC",
        "pagina": 3388
      }
    },
    {
      "id": "CON-032",
      "categoria": "contenido",
      "tema": "APC/visita de intercambio",
      "puntoGolpe": 6,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "¿Qué carácter tiene la visita de intercambio y asesoramiento?",
      "opciones": [
        "a) Correctivo, para sancionar las deficiencias detectadas.",
        "b) Preventivo, para contribuir a la implementación y cumplimiento de las políticas del Estado y el Gobierno.",
        "c) Fiscalizador, para determinar responsabilidades administrativas.",
        "d) Jurisdiccional, para resolver recursos de apelación."
      ],
      "correcta": 1,
      "explicacion": "La visita de intercambio y asesoramiento tiene carácter preventivo, con el objetivo de contribuir a la implementación y cumplimiento de las políticas del Estado y el Gobierno, así como de las disposiciones y programas que las implementan.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC01",
        "pagina": 3389
      }
    },
    {
      "id": "CON-033",
      "categoria": "contenido",
      "tema": "APC/control concurrente",
      "puntoGolpe": 6,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "¿Quién ejerce esencialmente el control concurrente y con qué equipo cuenta?",
      "opciones": [
        "a) El Contralor General, con un grupo de inspectores externos.",
        "b) El supervisor de la Contraloría, con auditores de otras provincias.",
        "c) Un experto externo, con el Consejo de Dirección de la entidad.",
        "d) El auditor interno de base, con un equipo multidisciplinario."
      ],
      "correcta": 3,
      "explicacion": "El control concurrente se ejerce esencialmente por el auditor interno de base, con un equipo multidisciplinario, y se realiza de manera simultánea a los procesos o actividades como acompañamiento sistemático.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC02",
        "pagina": 3391
      }
    },
    {
      "id": "CON-034",
      "categoria": "contenido",
      "tema": "APC/investigación y diagnóstico",
      "puntoGolpe": 6,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "¿A qué está dirigida la acción de Investigación y diagnóstico?",
      "opciones": [
        "a) A sancionar a los responsables de irregularidades administrativas.",
        "b) A certificar los estados financieros de la entidad.",
        "c) A conocer hechos o situaciones que inciden o determinan el comportamiento de la gestión económica administrativa.",
        "d) A resolver las inconformidades presentadas por los auditados."
      ],
      "correcta": 2,
      "explicacion": "La acción de Investigación y diagnóstico está dirigida a conocer hechos o situaciones que inciden o determinan el comportamiento de la gestión económica administrativa en sectores y actividades de interés, y se inscribe en el Plan anual de las acciones de prevención y control.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC03",
        "pagina": 3396
      }
    },
    {
      "id": "CON-035",
      "categoria": "contenido",
      "tema": "APC/comprobación especial",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "¿Con qué objetivo se realiza la comprobación especial?",
      "opciones": [
        "a) Dar seguimiento al cumplimiento de los planes de medidas derivados de acciones de prevención y control o comprobar temas específicos de interés.",
        "b) Certificar los estados financieros y emitir dictamen.",
        "c) Evaluar el desempeño de los auditores internos de base.",
        "d) Sustituir la auditoría financiera en entidades presupuestadas."
      ],
      "correcta": 0,
      "explicacion": "La comprobación especial se realiza para dar seguimiento al cumplimiento de los planes de medidas derivados de acciones de prevención y control ejecutadas, o para comprobar temas específicos que resulten de interés; se ejecuta según el Plan anual aprobado.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC04",
        "pagina": 3398
      }
    },
    {
      "id": "CON-036",
      "categoria": "contenido",
      "tema": "APC/comprobación especial masiva",
      "puntoGolpe": 6,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "En la comprobación especial masiva, ¿en qué plazo se entregan los informes que tributan al informe resumen?",
      "opciones": [
        "a) A las 72 horas de haber concluido la acción en el terreno.",
        "b) A los 5 días hábiles de concluida la acción.",
        "c) A los 10 días naturales de la reunión final.",
        "d) A los 30 días hábiles de iniciada la comprobación."
      ],
      "correcta": 0,
      "explicacion": "Los informes derivados de las diferentes comprobaciones especiales que tributan al informe resumen se entregan a la unidad organizativa de auditoría encargada de centrar la tarea a las 72 horas de haber concluido la acción en el terreno.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC04",
        "pagina": 3398
      }
    },
    {
      "id": "CON-037",
      "categoria": "contenido",
      "tema": "APC/visita de supervisión",
      "puntoGolpe": 5,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "¿Cuál es el objetivo de la visita de supervisión y control?",
      "opciones": [
        "a) Cuantificar los daños y perjuicios económicos de la entidad visitada.",
        "b) Evaluar el cumplimiento de las Normas Cubanas de Auditoría y el funcionamiento de las unidades de auditoría.",
        "c) Aprobar el Plan de medidas de la entidad sujeta a control.",
        "d) Realizar la confirmación externa de los saldos más significativos."
      ],
      "correcta": 1,
      "explicacion": "La visita de supervisión y control se realiza con el objetivo de evaluar el cumplimiento de las Normas Cubanas de Auditoría y demás disposiciones normativas aplicables, lo que permite evaluar el funcionamiento de las unidades de auditoría.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC05",
        "pagina": 3403
      }
    },
    {
      "id": "CON-038",
      "categoria": "contenido",
      "tema": "APC/supervisión CGR",
      "puntoGolpe": 4,
      "fase": "transversal",
      "dificultad": "alta",
      "enunciado": "Durante el Proceso de supervisión de la Contraloría General, ¿cómo deben realizarse las entrevistas?",
      "opciones": [
        "a) Con la sola presencia del jefe de grupo.",
        "b) Con un auditor y el dirigente entrevistado.",
        "c) Con la presencia de dos auditores actuantes como mínimo.",
        "d) Con dos dirigentes de la entidad y un experto."
      ],
      "correcta": 2,
      "explicacion": "Las entrevistas se realizan con la presencia de dos auditores actuantes como mínimo, para lo cual se utiliza la plantilla P-PC01-02 Entrevista. La misma exigencia de dos auditores se aplica en la comprobación en el área de residencia.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC06",
        "pagina": 3410
      }
    },
    {
      "id": "CON-039",
      "categoria": "contenido",
      "tema": "APC/recontrol integral",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "alta",
      "enunciado": "¿Cuándo se realiza el Recontrol Integral Estatal y quién puede prorrogarlo?",
      "opciones": [
        "a) Transcurrido un año natural desde la conclusión del Control Integral Estatal, plazo que puede extenderse de manera expresa por el Contralor General.",
        "b) A los seis meses de iniciado el control, con prórroga del jefe de la entidad.",
        "c) A los dos años de concluido el control, con prórroga de la Dirección de Calidad.",
        "d) Inmediatamente después del control, sin posibilidad de prórroga."
      ],
      "correcta": 0,
      "explicacion": "El Recontrol Integral Estatal se realiza transcurrido un año natural desde la conclusión del Control Integral Estatal, plazo que puede extenderse de manera expresa por el Contralor General cuando proceda.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC07",
        "pagina": 3415
      }
    },
    {
      "id": "CON-040",
      "categoria": "contenido",
      "tema": "APC/inspección CGR",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "alta",
      "enunciado": "En la Inspección de la Contraloría General, ¿con cuánta antelación envía la entidad inspeccionada la información solicitada antes de la reunión inicial?",
      "opciones": [
        "a) 30 días naturales.",
        "b) 15 días hábiles.",
        "c) 10 días hábiles.",
        "d) 5 días de antelación."
      ],
      "correcta": 3,
      "explicacion": "El jefe de la entidad sujeta a la Inspección envía a la Contraloría General, con cinco días de antelación a la fecha de la reunión inicial, la estructura organizativa, la evaluación de riesgos, la situación de los objetivos y los estados financieros, entre otra información.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC08",
        "pagina": 3428
      }
    },
    {
      "id": "PLA-001",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "0004",
      "dificultad": "basica",
      "enunciado": "Recibida la consulta de la propuesta de medidas disciplinarias, ¿dentro de qué término debe el auditor emitir sus criterios?",
      "opciones": [
        "a) 5 días hábiles subsiguientes a la presentación",
        "b) 10 días hábiles subsiguientes a la presentación",
        "c) 20 días hábiles subsiguientes a la presentación",
        "d) 30 días hábiles subsiguientes a la presentación"
      ],
      "correcta": 0,
      "explicacion": "El auditor emite criterios sobre la consulta de las medidas disciplinarias dentro de los cinco (5) días hábiles subsiguientes a su presentación. Los 10 días hábiles corresponden al recordatorio del vencimiento, no a la emisión de criterios.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "PLA-002",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "¿En qué plazo puede el responsable de la unidad de auditoría tramitar el recordatorio del vencimiento de la consulta de medidas disciplinarias?",
      "opciones": [
        "a) 5 días hábiles anteriores al vencimiento",
        "b) 15 días hábiles anteriores al vencimiento",
        "c) 10 días hábiles anteriores al vencimiento",
        "d) 30 días hábiles anteriores al vencimiento"
      ],
      "correcta": 2,
      "explicacion": "El responsable puede tramitar el recordatorio dentro de los diez días hábiles anteriores al vencimiento de la consulta de medidas disciplinarias, y dentro de los treinta días hábiles para la propuesta del Plan de medidas.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "PLA-003",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "basica",
      "enunciado": "¿Cuántos días hábiles dispone el sujeto auditado para presentar la propuesta del Plan de medidas?",
      "opciones": [
        "a) 10 días hábiles",
        "b) 30 días hábiles",
        "c) 20 días hábiles",
        "d) 5 días hábiles"
      ],
      "correcta": 1,
      "explicacion": "El sujeto auditado dispone de treinta (30) días hábiles para la presentación de la propuesta del Plan de medidas. No debe confundirse con los 20 días hábiles del recurso de apelación.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "PLA-004",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 6,
      "fase": "0004",
      "dificultad": "alta",
      "enunciado": "Cuando se requiere una comprobación especial para seguir el Plan de medidas, recomendaciones e impactos, ¿en qué término se realiza a partir de la entrega del Plan de medidas?",
      "opciones": [
        "a) 30 a 60 días hábiles",
        "b) 3 a 6 meses",
        "c) 1 a 2 años",
        "d) 6 meses a 1 año"
      ],
      "correcta": 3,
      "explicacion": "Para las auditorías que lo requieran se puede realizar una comprobación especial de seguimiento del Plan de medidas, recomendaciones e impactos en un término de seis meses y hasta un año, a partir de la entrega del Plan de medidas.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-01",
        "pagina": 3362
      }
    },
    {
      "id": "PLA-005",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "0004",
      "dificultad": "media",
      "enunciado": "Notificado el informe de la auditoría, ¿dentro de qué plazo se presenta el recurso de apelación?",
      "opciones": [
        "a) 10 días hábiles",
        "b) 20 días hábiles",
        "c) 20 días naturales",
        "d) 30 días hábiles"
      ],
      "correcta": 1,
      "explicacion": "El recurso de apelación se presenta dentro de los veinte (20) días hábiles siguientes a la notificación del informe. Los 20 días naturales aparecen en otro trámite: la carta cuando el recurso no se admite.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "PLA-006",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "0004",
      "dificultad": "alta",
      "enunciado": "Si la autoridad facultada no admite el recurso de apelación por presentarse fuera de plazo, ¿dentro de qué término envía la carta al recurrente y al máximo jefe de la entidad?",
      "opciones": [
        "a) 10 días hábiles desde la recepción",
        "b) 20 días hábiles desde la recepción",
        "c) 30 días naturales desde la recepción",
        "d) 20 días naturales desde la recepción"
      ],
      "correcta": 3,
      "explicacion": "Si el recurso se presenta fuera de plazo o incumple los requisitos, la autoridad facultada envía carta al recurrente y al máximo jefe dentro de los veinte (20) días naturales posteriores a haberse recibido el recurso.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "PLA-007",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 5,
      "fase": "0004",
      "dificultad": "alta",
      "enunciado": "Resuelto el recurso de apelación, ¿por cuánto tiempo custodia el expediente la dirección o unidad que lo resolvió?",
      "opciones": [
        "a) 30 días hábiles posteriores a la notificación",
        "b) 20 días hábiles posteriores a la notificación",
        "c) 10 días hábiles posteriores a la notificación",
        "d) 30 días naturales posteriores a la notificación"
      ],
      "correcta": 0,
      "explicacion": "La dirección, unidad central o sociedad que resolvió el recurso custodia el expediente de la acción de control por un término de treinta (30) días hábiles posteriores a la fecha de notificación del recurso de apelación.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-0004-02",
        "pagina": 3365
      }
    },
    {
      "id": "PLA-008",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 5,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "¿Durante cuánto tiempo se conserva el Expediente de la auditoría en el archivo de la unidad organizativa?",
      "opciones": [
        "a) 2 años",
        "b) 3 años",
        "c) 5 años",
        "d) 10 años"
      ],
      "correcta": 2,
      "explicacion": "El Expediente de la auditoría se conserva durante cinco años en el archivo de la unidad organizativa de auditoría; por interés o uso frecuente el plazo puede extenderse y luego se transfiere al Archivo central.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "PLA-009",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 6,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "En auditorías ejecutadas por sociedades de auditoría externa, ¿en qué término debe la máxima autoridad del sujeto auditado enviar las medidas disciplinarias y el Plan de medidas a la unidad central?",
      "opciones": [
        "a) 10 días hábiles desde la notificación",
        "b) 30 días hábiles desde la notificación",
        "c) 20 días hábiles desde la notificación",
        "d) 30 días naturales desde la notificación"
      ],
      "correcta": 1,
      "explicacion": "La máxima autoridad del sujeto auditado envía las medidas disciplinarias adoptadas y el Plan de medidas a la unidad central de auditoría interna en el término de hasta treinta días hábiles siguientes a partir de la notificación del Informe de la auditoría.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "PLA-010",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "Tras la reunión de información del resultado al Consejo de Dirección, ¿dentro de qué término se notifica el informe al sujeto auditado?",
      "opciones": [
        "a) 5 días hábiles",
        "b) 7 días hábiles",
        "c) 10 días hábiles",
        "d) 15 días hábiles"
      ],
      "correcta": 2,
      "explicacion": "El jefe de grupo presenta el informe al máximo nivel de dirección del sujeto auditado dentro del término de hasta diez días hábiles siguientes a la reunión de información del resultado al Consejo de Dirección.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "PLA-011",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "Para dar a conocer las conclusiones, recomendaciones y declaración de responsabilidad administrativa, ¿cuándo se realiza la reunión con la administración, el sindicato y los trabajadores?",
      "opciones": [
        "a) Hasta 10 días posteriores a la notificación del Informe",
        "b) Hasta 5 días posteriores a la notificación del Informe",
        "c) Hasta 15 días posteriores a la notificación del Informe",
        "d) Hasta 30 días posteriores a la notificación del Informe"
      ],
      "correcta": 0,
      "explicacion": "La reunión con la administración, el sindicato y los trabajadores se realiza en el término de hasta diez días posteriores a la notificación del Informe de la auditoría.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "PLA-012",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "En auditorías a entidades con intereses en el exterior, ¿dentro de qué plazo se informa al embajador o jefe de misión los objetivos y el alcance del trabajo?",
      "opciones": [
        "a) 3 días hábiles después del arribo del auditor",
        "b) 5 días hábiles después del arribo del auditor",
        "c) 10 días naturales después del arribo del auditor",
        "d) 24 horas después del arribo del auditor"
      ],
      "correcta": 3,
      "explicacion": "Al embajador o jefe de misión del Estado cubano se le informan los objetivos y el alcance del trabajo dentro de las 24 horas de llegada del auditor.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "PLA-013",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "Ante el incumplimiento de las obligaciones del sujeto auditado, ¿en qué término debe resolverse lo dispuesto tras informar al jefe inmediato superior?",
      "opciones": [
        "a) 1 día hábil desde su recepción",
        "b) 5 días hábiles desde su recepción",
        "c) 3 días hábiles desde su recepción",
        "d) 10 días hábiles desde su recepción"
      ],
      "correcta": 2,
      "explicacion": "El jefe de la unidad organizativa de auditoría informa por escrito al jefe inmediato superior del sujeto sobre la violación; lo dispuesto se resuelve en el término de hasta tres días hábiles a partir de su recepción.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G01",
        "pagina": 3370
      }
    },
    {
      "id": "PLA-014",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "media",
      "enunciado": "¿En qué plazo deben los auditores de calidad garantizar la supervisión superior desde la recepción del borrador del informe y los expedientes?",
      "opciones": [
        "a) Hasta 10 días hábiles",
        "b) Hasta 5 días hábiles",
        "c) Hasta 15 días hábiles",
        "d) Hasta 20 días hábiles"
      ],
      "correcta": 0,
      "explicacion": "Los auditores de la dirección, departamentos y Comité de Control de Calidad garantizan la supervisión superior en un plazo de hasta 10 días hábiles, contados a partir de la recepción del borrador del informe, el informe especial y los expedientes.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G02",
        "pagina": 3379
      }
    },
    {
      "id": "PLA-015",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "transversal",
      "dificultad": "basica",
      "enunciado": "Determinadas las no conformidades en el acta de supervisión superior, ¿en qué plazo debe el jefe de grupo o auditor interno de base dar respuesta?",
      "opciones": [
        "a) Hasta 5 días hábiles desde su entrega",
        "b) Hasta 3 días hábiles desde su entrega",
        "c) Hasta 10 días hábiles desde su entrega",
        "d) Hasta 15 días hábiles desde su entrega"
      ],
      "correcta": 1,
      "explicacion": "El jefe de grupo o auditor interno de base da respuesta a las no conformidades determinadas en el acta de supervisión superior en un plazo de hasta 3 días hábiles, contados a partir de su entrega.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-001-G02",
        "pagina": 3379
      }
    },
    {
      "id": "PLA-016",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "APC",
      "dificultad": "basica",
      "enunciado": "¿Con cuánta antelación a la reunión de inicio del Control y Recontrol Integral Estatal emite el Contralor General la convocatoria al controlado y a los controladores?",
      "opciones": [
        "a) 7 días",
        "b) 15 días",
        "c) 72 horas",
        "d) 30 días"
      ],
      "correcta": 3,
      "explicacion": "El Contralor General emite la convocatoria al controlado y a los controladores con treinta (30) días de antelación a la reunión de inicio prevista en el Plan anual de actividades principales del Estado y el Gobierno.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC07",
        "pagina": 3415
      }
    },
    {
      "id": "PLA-017",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "APC",
      "dificultad": "media",
      "enunciado": "Antes de iniciar la ejecución en el terreno del Control y Recontrol Integral Estatal, ¿con cuánta anticipación comunica el Contralor General los objetivos específicos y el cronograma general?",
      "opciones": [
        "a) 7 días",
        "b) 10 días",
        "c) 15 días",
        "d) 30 días"
      ],
      "correcta": 0,
      "explicacion": "El Contralor General comunica oficialmente, con siete (7) días de anticipación al inicio de la ejecución en el terreno, los objetivos específicos a evaluar y el cronograma general de entidades a controlar.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC07",
        "pagina": 3415
      }
    },
    {
      "id": "PLA-018",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 1,
      "fase": "APC",
      "dificultad": "alta",
      "enunciado": "¿Dentro de qué término presenta la Contraloría General el informe resumen final del Control y Recontrol Integral Estatal?",
      "opciones": [
        "a) 5 días siguientes a la conclusión del control en el terreno",
        "b) 7 días siguientes a la conclusión del control en el terreno",
        "c) 15 días siguientes a la conclusión del control en el terreno",
        "d) 30 días siguientes a la conclusión del control en el terreno"
      ],
      "correcta": 2,
      "explicacion": "La Contraloría General de la República elabora y presenta el informe resumen final dentro de los quince (15) días siguientes a la conclusión del control en el terreno.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC07",
        "pagina": 3415
      }
    },
    {
      "id": "PLA-019",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 6,
      "fase": "APC",
      "dificultad": "media",
      "enunciado": "¿En qué término informa el controlado el estado de cumplimiento del Plan de medidas tras la notificación del informe?",
      "opciones": [
        "a) 30 días",
        "b) 60 días",
        "c) 90 días",
        "d) 180 días"
      ],
      "correcta": 3,
      "explicacion": "El controlado informa el estado de cumplimiento del Plan de medidas en el término de ciento ochenta (180) días posteriores a la notificación del informe, según lo establecido en la legislación vigente.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC07",
        "pagina": 3415
      }
    },
    {
      "id": "PLA-020",
      "categoria": "plazos",
      "tema": "plazos",
      "puntoGolpe": 6,
      "fase": "APC",
      "dificultad": "media",
      "enunciado": "¿Dentro de qué término se realiza el taller de intercambio para analizar y conciliar los planes de medidas del Control y Recontrol Integral Estatal?",
      "opciones": [
        "a) 5 días posteriores a la entrega del Plan de medidas",
        "b) 10 días posteriores a la entrega del Plan de medidas",
        "c) 15 días posteriores a la entrega del Plan de medidas",
        "d) 30 días posteriores a la entrega del Plan de medidas"
      ],
      "correcta": 1,
      "explicacion": "El taller de intercambio se realiza dentro del término de los diez (10) días posteriores a la entrega del Plan de medidas; otros diez días después se concilian los criterios y se aprueba el plan.",
      "referencia": {
        "tomo": "I",
        "codigo": "H-002-APC07",
        "pagina": 3415
      }
    }
  ]
};
