// js/formConfig.js

export const formularioData = {
  titulo: "Solicitud de Evento",

  campos: [
    // 🔹 AUTO (no visibles)
    { id: "hora_inicio", tipo: "auto_time" },
    { id: "fecha_llenado", tipo: "auto_date" },

    // 🔹 Datos básicos
    { id: "correo", label: "Correo", tipo: "email", required: true },
    { id: "nombre", label: "Nombre", tipo: "text", required: true },

    { id: "acudio_dep", label: "¿Acudió al departamento?", tipo: "switch" },

    {
      id: "nombre_evento",
      label: "Nombre del evento",
      tipo: "text",
      required: true,
    },

    { id: "responsable", label: "Responsable del evento", tipo: "text" },

    {
      id: "cargo_responsable",
      label: "Cargo del responsable",
      tipo: "select",
      opciones: ["Administrativo", "Estudiante", "Docente", "Externo"],
    },

    { id: "cargo_admin", label: "Cargo administrativo", tipo: "text" },

    {
      id: "unidad",
      label: "Unidad de aprendizaje",
      tipo: "select",
      opciones: ["Estudiante", "Docente", "Externo"],
    },

    { id: "telefono", label: "Teléfono", tipo: "tel" },

    { id: "consejo", label: "¿Fue sometido a consejo?", tipo: "switch" },

    { id: "fecha_aprobacion", label: "Fecha de aprobación", tipo: "date" },

    {
      id: "fecha_evento",
      label: "Fecha del evento",
      tipo: "date",
      required: true,
    },

    // 🔴 IMPORTANTE: este controla todo
    { id: "multi_dia", label: "¿Dura más de un día?", tipo: "switch" },

    // 🔴 FECHAS CONTROLADAS
    {
      id: "fecha_inicio",
      label: "Fecha inicio",
      tipo: "date",
      dependsOn: "multi_dia",
      oculto: true,
    },
    {
      id: "fecha_fin",
      label: "Fecha fin",
      tipo: "date",
      dependsOn: "multi_dia",
      oculto: true,
    },

    { id: "horario", label: "Horario", tipo: "time_range" },

    { id: "externos", label: "¿Asiste gente externa?", tipo: "switch" },

    {
      id: "discapacidad",
      label: "¿Asiste gente con discapacidad?",
      tipo: "switch",
    },

    {
      id: "espacio",
      label: "Espacio solicitado",
      tipo: "select",
      opciones: ["Explanada", "Auditorio", "Sala de Consejo"],
    },

    { id: "montaje", label: "Montaje", tipo: "text" },
    { id: "personas", label: "Número de personas", tipo: "number" },

    // 🔹 Recursos materiales
    {
      id: "materiales",
      label: "Recursos materiales",
      tipo: "multiselect",
      opciones: [
        "Laptop",
        "Proyector",
        "Sonido",
        "Extensiones",
        "Sonido móvil",
        "Mamparas",
      ],
    },

    // 🔴 ESTE DEPENDE DE "Sonido"
    {
      id: "microfonos",
      label: "Micrófonos",
      tipo: "number",
      dependsOnValue: { campo: "materiales", valor: "Sonido" },
      oculto: true, // 🔥 IMPORTANTE (faltaba)
    },

    { id: "personificadores", label: "Personificadores", tipo: "number" },

    // 🔹 Recursos humanos
    {
      id: "humanos",
      label: "Recursos humanos",
      tipo: "multiselect",
      opciones: [
        "Logística",
        "Pase de lista",
        "Fotografía",
        "Maestro de ceremonias",
      ],
    },

    { id: "descripcion", label: "Descripción", tipo: "textarea" },
    { id: "observaciones", label: "Observaciones", tipo: "textarea" },
  ],
};
