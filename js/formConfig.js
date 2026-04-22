// js/formConfig.js

export const formularioData = {
  titulo: "Solicitud de Evento",

  campos: [
    // 🔹 AUTO
    { id: "hora_inicio", tipo: "auto_time" },
    { id: "fecha_llenado", tipo: "auto_date" },

    // 🔹 =========================
    // 🔹 BLOQUE 1
    // 🔹 =========================
    { id: "correo", label: "Correo", tipo: "email", required: true },

    {
      id: "responsable",
      label: "Responsable del evento (Nombre completo)",
      tipo: "text",
      required: true,
    },

    { id: "acudio_dep", label: "¿Acudió al departamento?", tipo: "switch" },

    {
      id: "nombre_evento",
      label: "Nombre del evento",
      tipo: "text",
      required: true,
    },

    {
      id: "cargo_responsable",
      label: "Cargo del responsable",
      tipo: "select",
      opciones: ["Administrativo", "Estudiante", "Docente", "Externo"],
    },

    {
      id: "cargo_admin",
      label: "Cargo administrativo",
      tipo: "text",
      dependsOn: {
        campo: "cargo_responsable",
        valores: ["Administrativo"],
      },
    },

    {
      id: "unidad",
      label: "Unidad de aprendizaje",
      tipo: "text",
      dependsOn: {
        campo: "cargo_responsable",
        valores: ["Estudiante", "Docente"],
      },
    },

    { id: "telefono", label: "Teléfono", tipo: "tel" },

    // 🔹 =========================
    // 🔹 BLOQUE 2
    // 🔹 =========================
    { id: "consejo", label: "¿Fue sometido a consejo?", tipo: "switch" },

    {
      id: "fecha_aprobacion",
      label: "Fecha de aprobación",
      tipo: "date",
      dependsOn: {
        campo: "consejo",
        valor: true,
      },
    },

    {
      id: "fecha_evento",
      label: "Fecha del evento",
      tipo: "date",
      required: true,
    },

    { id: "multi_dia", label: "¿Dura más de un día?", tipo: "switch" },

    // 🔥 CONTROLADO POR JS
    {
      id: "fecha_inicio",
      label: "Fecha inicio",
      tipo: "date",
    },

    {
      id: "fecha_fin",
      label: "Fecha fin",
      tipo: "date",
      dependsOn: {
        campo: "multi_dia",
        valor: true,
      },
    },

    { id: "horario", label: "Horario", tipo: "time_range" },

    // 🔹 =========================
    // 🔹 BLOQUE 3
    // 🔹 =========================
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

    // 🔥 SOLO SI NO ES EXPLANADA
    {
      id: "montaje",
      label: "Montaje",
      tipo: "text",
      dependsOn: {
        campo: "espacio",
        valores: ["Auditorio", "Sala de Consejo"],
      },
    },

    // 🔥 SIEMPRE VISIBLE
    {
      id: "personas",
      label: "Número aproximado de personas",
      tipo: "number",
    },

    // 🔹 =========================
    // 🔹 BLOQUE 4
    // 🔹 =========================
    {
      id: "materiales",
      tipo: "multiselect",
      opciones: [
        "Laptop",
        "Proyector",
        "Extensiones",
        "Sonido móvil",
        "Mamparas",
      ],
    },

    {
      id: "sonido",
      label: "",
      tipo: "recurso_sonido",
    },

    {
      id: "personificadores",
      label: "",
      tipo: "personificadores_custom",
    },

    {
      id: "humanos",
      tipo: "multiselect",
      opciones: [
        "Logística del evento",
        "Pase de lista",
        "Fotografía",
        "Maestro de ceremonias",
      ],
    },

    // 🔹 =========================
    // 🔹 BLOQUE 5
    // 🔹 =========================
    { id: "descripcion", label: "Descripción", tipo: "textarea" },

    // 🔹 =========================
    // 🔹 BLOQUE 6
    // 🔹 =========================
    { id: "observaciones", label: "Observaciones", tipo: "textarea" },
  ],
};
