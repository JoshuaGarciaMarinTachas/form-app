import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { formularioData } from "./formConfig.js";
import { crearCampo } from "./ui.js";

const form = document.getElementById("formulario");
const titulo = document.getElementById("titulo");

// 🔹 Render título
titulo.textContent = formularioData.titulo;

// 🔹 BLOQUES
const bloques = Array.from({ length: 6 }, () => {
  const div = document.createElement("div");
  div.classList.add("bloque");
  return div;
});

const titulos = [
  "Datos del solicitante",
  "Detalles del evento",
  "Logística del evento",
  "Requerimientos del evento",
  "Descripción",
  "Observaciones",
];

bloques.forEach((bloque, i) => {
  const h3 = document.createElement("h3");
  h3.textContent = titulos[i];
  bloque.appendChild(h3);
});

// 🔹 ASIGNACIÓN
formularioData.campos.forEach((campo) => {
  const el = crearCampo(campo);
  if (!el) return;

  if (
    [
      "correo",
      "responsable",
      "acudio_dep",
      "nombre_evento",
      "cargo_responsable",
      "cargo_admin",
      "unidad",
      "telefono",
    ].includes(campo.id)
  ) {
    bloques[0].appendChild(el);
  } else if (
    [
      "consejo",
      "fecha_aprobacion",
      "fecha_evento",
      "multi_dia",
      "fecha_inicio",
      "fecha_fin",
      "horario",
    ].includes(campo.id)
  ) {
    bloques[1].appendChild(el);
  } else if (
    ["externos", "discapacidad", "espacio", "montaje", "personas"].includes(
      campo.id,
    )
  ) {
    bloques[2].appendChild(el);
  } else if (
    ["materiales", "sonido", "personificadores", "humanos"].includes(campo.id)
  ) {
    bloques[3].appendChild(el);
  } else if (campo.id === "descripcion") {
    bloques[4].appendChild(el);
  } else if (campo.id === "observaciones") {
    bloques[5].appendChild(el);
  }
});

bloques.forEach((b) => form.appendChild(b));

// 🔹 BOTÓN
const btn = document.createElement("button");
btn.textContent = "Enviar";
btn.type = "submit";
form.appendChild(btn);

// 🔹 SUBMIT
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {}; // ✅ AHORA SÍ primero

  // 🔹 BASE
  formularioData.campos.forEach((campo) => {
    if (campo.tipo === "auto_time") {
      data[campo.id] = new Date().toLocaleTimeString();
    } else if (campo.tipo === "auto_date") {
      data[campo.id] = new Date().toLocaleDateString();
    } else {
      const el = document.getElementById(campo.id);

      if (!el && campo.tipo !== "multiselect") return;

      if (campo.tipo === "switch") {
        data[campo.id] = el.dataset.value === "true";
      } else if (campo.tipo === "multiselect") {
        data[campo.id] = [
          ...document.querySelectorAll(`input[name="${campo.id}"]:checked`),
        ].map((el) => el.value);
      } else if (campo.tipo === "time_range") {
        const inicio = document.getElementById(campo.id + "_inicio").value;
        const fin = document.getElementById(campo.id + "_fin").value;

        data[campo.id] = `${inicio} - ${fin}`;
      } else {
        data[campo.id] = el.value?.trim() || null;
      }
    }
  });

  // 🔥 =========================
  // 🔥 PERSONALIZADOS (NUEVO)
  // 🔥 =========================

  // 👤 PERSONIFICADORES
  const persChk = document.getElementById("personificadores_check");
  const persVal = document.getElementById("cantidad_personificadores");

  data.personificadores = persChk?.checked
    ? Math.min(7, Math.max(0, parseInt(persVal.value) || 0))
    : 0;

  // 🔊 SONIDO
  const sonidoChk = document.getElementById("sonido_check");
  const microChk = document.getElementById("micro_check");
  const microVal = document.getElementById("cantidad_microfonos");
  const bocinaChk = document.getElementById("bocina");

  data.sonido = sonidoChk?.checked || false;

  data.microfonos = microChk?.checked
    ? Math.min(2, Math.max(0, parseInt(microVal.value) || 0))
    : 0;

  data.bocina = bocinaChk?.checked || false;

  // 🔴 VALIDACIÓN FINAL
  const errores = document.querySelectorAll(".input-error");

  if (errores.length > 0) {
    alert("Corrige los campos marcados antes de enviar");
    errores[0].focus();
    return;
  }

  // 🔹 VALIDACIÓN PERSONAS
  if (data.espacio === "Auditorio" && data.personas > 110) {
    alert("Máximo 110 personas en Auditorio");
    return;
  }

  if (data.espacio === "Sala de Consejo" && data.personas > 50) {
    alert("Máximo 50 personas en Sala de Consejo");
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
