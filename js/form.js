import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Definimos un formulario (simulación de base de datos)
const formulario = {
  titulo: "Encuesta básica",
  preguntas: [
    { id: 1, texto: "¿Cómo te llamas?" },
    { id: 2, texto: "¿Qué opinas del servicio?" },
  ],
};

// 🎨 Renderizar formulario
function renderFormulario() {
  const contenedor = document.getElementById("formulario");

  formulario.preguntas.forEach((pregunta) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <label>${pregunta.texto}</label><br>
      <input type="text" id="pregunta-${pregunta.id}" /><br><br>
    `;

    contenedor.appendChild(div);
  });
}

// 📤 Enviar respuestas
window.enviarFormulario = async function () {
  const respuestas = [];

  formulario.preguntas.forEach((pregunta) => {
    const valor = document.getElementById(`pregunta-${pregunta.id}`).value;
    respuestas.push(valor);
  });

  await addDoc(collection(db, "respuestas"), {
    formulario: formulario.titulo,
    respuestas: respuestas,
    fecha: new Date(),
  });

  alert("✅ Respuestas enviadas");
};

renderFormulario();
