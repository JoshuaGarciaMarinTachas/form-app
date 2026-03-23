const formularioData = {
  titulo: "Solicitud de Evento",
  secciones: [
    {
      titulo: "Datos del solicitante",
      campos: [
        {
          id: "nombre",
          label: "Nombre completo",
          tipo: "text",
          required: true,
        },
        {
          id: "correo",
          label: "Correo electrónico",
          tipo: "email",
          required: true,
        },
        { id: "telefono", label: "Teléfono", tipo: "text" },
        { id: "dependencia", label: "Dependencia", tipo: "text" },
      ],
    },
    {
      titulo: "Información del evento",
      campos: [
        {
          id: "nombre_evento",
          label: "Nombre del evento",
          tipo: "text",
          required: true,
        },
        {
          id: "nombre_responsable",
          label: "Responsable",
          tipo: "text",
          required: true,
        },
        {
          id: "cargo_responsable",
          label: "Cargo del responsable",
          tipo: "text",
        },
        {
          id: "fecha_evento",
          label: "Fecha del evento",
          tipo: "date",
          required: true,
        },
        {
          id: "hora_inicio",
          label: "Hora de inicio",
          tipo: "time",
          required: true,
        },
        {
          id: "hora_finalizacion",
          label: "Hora de finalización",
          tipo: "time",
          required: true,
        },
      ],
    },
    {
      titulo: "Detalles del evento",
      campos: [
        { id: "descripcion_evento", label: "Descripción", tipo: "textarea" },
        {
          id: "numero_aprox",
          label: "Número aproximado de asistentes",
          tipo: "number",
        },
        {
          id: "gente_externa",
          label: "¿Habrá gente externa?",
          tipo: "checkbox",
        },
        {
          id: "gente_condiscapacidad",
          label: "¿Personas con discapacidad?",
          tipo: "checkbox",
        },
      ],
    },
    {
      titulo: "Logística",
      campos: [
        { id: "espacio_solicitado", label: "Espacio solicitado", tipo: "text" },
        { id: "montaje", label: "Tipo de montaje", tipo: "text" },
        { id: "recurso_humano", label: "Recursos humanos", tipo: "text" },
        { id: "recurso_material", label: "Recursos materiales", tipo: "text" },
        { id: "cantidad_microfonos", label: "Micrófonos", tipo: "number" },
      ],
    },
    {
      titulo: "Adicional",
      campos: [
        { id: "observaciones", label: "Observaciones", tipo: "textarea" },
        {
          id: "acudio_al_dep",
          label: "¿Acudió al departamento?",
          tipo: "checkbox",
        },
        { id: "evento_consejo", label: "¿Requiere consejo?", tipo: "checkbox" },
      ],
    },
  ],
};
