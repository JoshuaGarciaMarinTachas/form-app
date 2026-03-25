// js/formConfig.js

export const formularioData = {
  titulo: "Solicitud de Evento",

  campos: [
    // 🔹 AUTO (no visibles)
    { id: "hora_inicio", tipo: "auto_time" },
    { id: "fecha_llenado", tipo: "auto_date" },

    // 🔹 =========================
    // 🔹 BLOQUE 1 (DATOS BÁSICOS)
    // 🔹 =========================
    { id: "correo", label: "Correo", tipo: "email", required: true },
    {
      id: "responsable",
      label: "Responsable del evento (Nombre completo)",
      tipo: "text",
      required: true,
    },
    ,
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
      oculto: true,
    },

    {
      id: "unidad",
      label: "Unidad de aprendizaje",
      tipo: "text",
      oculto: true,
    },

    { id: "telefono", label: "Teléfono", tipo: "tel" },

    // 🔹 =========================
    // 🔹 BLOQUE 2 (EVENTO)
    // 🔹 =========================
    { id: "consejo", label: "¿Fue sometido a consejo?", tipo: "switch" },

    {
      id: "fecha_aprobacion",
      label: "Fecha de aprobación",
      tipo: "date",
      dependsOn: "consejo", // 🔥 SOLO aparece si consejo = true
      oculto: true,
    },

    {
      id: "fecha_evento",
      label: "Fecha del evento",
      tipo: "date",
      required: true,
    },

    { id: "multi_dia", label: "¿Dura más de un día?", tipo: "switch" },

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

    // 🔹 =========================
    // 🔹 BLOQUE 3 (LOGÍSTICA DEL EVENTO)
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

    { id: "montaje", label: "Montaje", tipo: "text" },
    {
      id: "personas",
      label: "Número aproximado de personas",
      tipo: "number",
    },

    // 🔹 =========================
    // 🔹 BLOQUE 4 (RECURSOS)
    // 🔹 =========================
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

    {
      id: "microfonos",
      label: "Micrófonos",
      tipo: "number",
      dependsOnValue: { campo: "materiales", valor: "Sonido" },
      oculto: true,
    },

    {
      id: "bocina",
      label: "¿Bocina?",
      tipo: "switch",
      oculto: true,
    },

    { id: "personificadores", label: "Personificadores", tipo: "number" },

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
