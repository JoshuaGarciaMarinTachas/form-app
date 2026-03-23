import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Definición del formulario
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

// 🔹 Renderizar formulario
function renderFormulario() {
  const contenedor = document.getElementById("formulario");
  const titulo = document.getElementById("titulo");

  titulo.textContent = formularioData.titulo;
  contenedor.innerHTML = "";

  formularioData.secciones.forEach((seccion) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("seccion");

    const h2 = document.createElement("h2");
    h2.textContent = seccion.titulo;
    sectionDiv.appendChild(h2);

    seccion.campos.forEach((campo) => {
      const div = document.createElement("div");
      div.classList.add("form-group");

      const label = document.createElement("label");
      label.textContent = campo.label;
      label.setAttribute("for", campo.id);

      let input;

      if (campo.tipo === "textarea") {
        input = document.createElement("textarea");
      } else {
        input = document.createElement("input");
        input.type = campo.tipo === "checkbox" ? "checkbox" : campo.tipo;
      }

      input.id = campo.id;
      input.name = campo.id;

      if (campo.required) {
        input.required = true;
      }

      div.appendChild(label);
      div.appendChild(input);
      sectionDiv.appendChild(div);
    });

    contenedor.appendChild(sectionDiv);
  });
}

// 🔹 Enviar datos a Firebase
document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const data = {};

    formularioData.secciones.forEach((seccion) => {
      seccion.campos.forEach((campo) => {
        const el = document.getElementById(campo.id);

        if (campo.tipo === "checkbox") {
          data[campo.id] = el.checked;
        } else {
          data[campo.id] = el.value;
        }
      });
    });

    data.estado = "pendiente";
    data.fecha_creacion = new Date();

    await addDoc(collection(db, "solicitudes"), data);

    alert("Solicitud enviada correctamente");
    console.log("Guardado en Firebase:", data);

    document.getElementById("formulario").reset();
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Error al enviar el formulario");
  }
});

// 🔹 Inicializar
renderFormulario();
