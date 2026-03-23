import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const formularioData = {
  titulo: "Encuesta de servicio",
  preguntas: [
    { id: 1, texto: "Nombre completo", tipo: "text" },
    { id: 2, texto: "Correo electrónico", tipo: "email" },
    { id: 3, texto: "Opinión del servicio", tipo: "textarea" },
  ],
};

// Renderizar formulario
function renderFormulario() {
  document.getElementById("titulo").textContent = formularioData.titulo;

  const contenedor = document.getElementById("formulario");

  formularioData.preguntas.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("form-group");

    let input = "";

    if (p.tipo === "textarea") {
      input = `<textarea id="pregunta-${p.id}"></textarea>`;
    } else {
      input = `<input type="${p.tipo}" id="pregunta-${p.id}" />`;
    }

    div.innerHTML = `
      <label>${p.texto}</label>
      ${input}
    `;

    contenedor.appendChild(div);
  });
}

// Enviar respuestas
document.getElementById("btnEnviar").addEventListener("click", async () => {
  const respuestas = [];

  formularioData.preguntas.forEach((p) => {
    const valor = document.getElementById(`pregunta-${p.id}`).value;
    respuestas.push(valor);
  });

  await addDoc(collection(db, "respuestas"), {
    formulario: formularioData.titulo,
    respuestas,
    fecha: new Date(),
  });

  alert("Formulario enviado correctamente");
});

renderFormulario();
