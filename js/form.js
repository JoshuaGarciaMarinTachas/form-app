import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { formularioData } from "./formConfig.js";
import { crearCampo } from "./ui.js";
import { validarCorreo, validarTelefono } from "./validations.js";

const form = document.getElementById("formulario");
const titulo = document.getElementById("titulo");

// 🔹 Render
titulo.textContent = formularioData.titulo;

formularioData.campos.forEach((campo) => {
  const el = document.getElementById(campo.id);

  if (!el) return;

  if (campo.tipo === "switch") {
    data[campo.id] = el.dataset.value === "true";
  } else {
    data[campo.id] = el.value;
  }
});

document.getElementById("multi_dia").addEventListener("click", () => {
  const activo = document
    .getElementById("multi_dia")
    .classList.contains("active");

  document.getElementById("fecha_inicio").parentElement.style.display = activo
    ? "block"
    : "none";
  document.getElementById("fecha_fin").parentElement.style.display = activo
    ? "block"
    : "none";
});

document.querySelectorAll('[name="materiales"]').forEach((chk) => {
  chk.addEventListener("change", () => {
    const sonido = [
      ...document.querySelectorAll('[name="materiales"]:checked'),
    ].some((el) => el.value === "Sonido");

    document.getElementById("microfonos").parentElement.style.display = sonido
      ? "block"
      : "none";
  });
});

// Botón
const btn = document.createElement("button");
btn.textContent = "Enviar";
btn.type = "submit";
form.appendChild(btn);

// 🔹 Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {};

  if (data.espacio === "Auditorio" && data.personas > 110) {
    alert("Capacidad máxima Auditorio: 110");
    return;
  }

  if (data.espacio === "Sala de Consejo" && data.personas > 50) {
    alert("Capacidad máxima Sala: 50");
    return;
  }

  formularioData.campos.forEach((campo) => {
    if (campo.tipo === "auto_time") {
      data[campo.id] = new Date().toLocaleTimeString();
    } else if (campo.tipo === "auto_date") {
      data[campo.id] = new Date().toLocaleDateString();
    } else {
      const el = document.getElementById(campo.id);
      if (el) data[campo.id] = el.value;
    }
  });

  // 🔹 Validaciones
  if (!validarCorreo(data.correo)) {
    alert("Correo inválido");
    return;
  }

  if (!validarTelefono(data.telefono)) {
    alert("Teléfono inválido");
    return;
  }

  try {
    await addDoc(collection(db, "solicitudes"), data);
    alert("Solicitud enviada correctamente");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Error al enviar");
  }
});
