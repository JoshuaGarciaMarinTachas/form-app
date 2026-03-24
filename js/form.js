import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("JS funcionando");

// 🔹 Configuración del formulario
const formularioData = {
  titulo: "Solicitud de Evento",
  secciones: [
    {
      titulo: "Datos Generales",
      campos: [
        { id: "nombre", label: "Nombre", tipo: "text" },
        { id: "correo", label: "Correo", tipo: "email" },
        { id: "telefono", label: "Teléfono", tipo: "text" },
        { id: "nombre_evento", label: "Evento", tipo: "text" },
        { id: "fecha_evento", label: "Fecha", tipo: "date" },
      ],
    },
  ],
};

// 🔹 Render
function renderFormulario() {
  const contenedor = document.getElementById("formulario");
  const titulo = document.getElementById("titulo");

  titulo.textContent = formularioData.titulo;
  contenedor.innerHTML = "";

  formularioData.secciones.forEach((seccion) => {
    const sectionDiv = document.createElement("div");

    const h2 = document.createElement("h2");
    h2.textContent = seccion.titulo;
    sectionDiv.appendChild(h2);

    seccion.campos.forEach((campo) => {
      const div = document.createElement("div");
      div.classList.add("form-group");

      const label = document.createElement("label");
      label.textContent = campo.label;

      const input = document.createElement("input");
      input.type = campo.tipo;
      input.id = campo.id;

      div.appendChild(label);
      div.appendChild(input);

      sectionDiv.appendChild(div);
    });

    contenedor.appendChild(sectionDiv);
  });

  // Botón
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = "Enviar";

  contenedor.appendChild(btn);
}

// 🔹 Enviar
document.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Enviando...");

  try {
    const data = {};

    formularioData.secciones.forEach((sec) => {
      sec.campos.forEach((campo) => {
        data[campo.id] = document.getElementById(campo.id).value;
      });
    });

    await addDoc(collection(db, "solicitudes"), data);

    alert("Formulario enviado correctamente");
  } catch (error) {
    console.error(error);
    alert("Error al enviar");
  }
});

// 🔹 Ejecutar
renderFormulario();
