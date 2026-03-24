import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("JS funcionando");

// 🔹 Datos del formulario
const formularioData = {
  titulo: "Solicitud de Evento",
  secciones: [
    {
      titulo: "Datos",
      campos: [
        { id: "nombre", label: "Nombre", tipo: "text", required: true },
        { id: "correo", label: "Correo", tipo: "email", required: true },
      ],
    },
  ],
};

// 🔹 Render
function renderFormulario() {
  const contenedor = document.getElementById("formulario");
  const titulo = document.getElementById("titulo");

  titulo.textContent = formularioData.titulo;

  formularioData.secciones.forEach((seccion) => {
    const divSec = document.createElement("div");

    const h2 = document.createElement("h2");
    h2.textContent = seccion.titulo;

    divSec.appendChild(h2);

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

      divSec.appendChild(div);
    });

    // 🔥 Insertar antes del botón
    const boton = document.getElementById("btnEnviar").parentNode;
    contenedor.insertBefore(divSec, boton);
  });
}

// 🔹 Submit
document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("CLICK DETECTADO");

  try {
    const data = {};

    formularioData.secciones.forEach((sec) => {
      sec.campos.forEach((campo) => {
        data[campo.id] = document.getElementById(campo.id).value;
      });
    });

    console.log("Datos:", data);

    await addDoc(collection(db, "solicitudes"), data);

    alert("Formulario enviado correctamente");
  } catch (error) {
    console.error("Error:", error);
    alert("Error al enviar");
  }
});

// 🔹 Init
renderFormulario();
