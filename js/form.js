import { validarCorreo, validarTelefono } from "./validations.js";
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { formularioData } from "./formConfig.js";
import { crearCampo } from "./ui.js";

const form = document.getElementById("formulario");
const titulo = document.getElementById("titulo");

// 🔹 TÍTULO
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
  "Descripción del evento",
  "Observaciones",
];

bloques.forEach((bloque, i) => {
  const h3 = document.createElement("h3");
  h3.textContent = titulos[i];
  bloque.appendChild(h3);
});

// 🔥 =========================
// 🔥 BLOQUE 4 LIMPIO (SIN TÍTULOS INTERNOS)
// 🔥 =========================
const requerimientosGrid = document.createElement("div");
requerimientosGrid.classList.add("requerimientos-grid");

const colMaterial = document.createElement("div");
colMaterial.classList.add("columna");

const colHumano = document.createElement("div");
colHumano.classList.add("columna");

// 🔹 CREAR CAMPOS
formularioData.campos.forEach((campo) => {
  const el = crearCampo(campo);
  if (!el) return;

  // 🔹 BLOQUE 1
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
  }

  // 🔹 BLOQUE 2
  else if (
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
  }

  // 🔹 BLOQUE 3
  else if (
    ["externos", "discapacidad", "espacio", "montaje", "personas"].includes(
      campo.id,
    )
  ) {
    bloques[2].appendChild(el);
  }

  // 🔥 BLOQUE 4 CORRECTO
  else if (["materiales", "sonido", "personificadores"].includes(campo.id)) {
    // 👈 PERSONIFICADORES AHORA ES MATERIAL
    colMaterial.appendChild(el);
  } else if (["humanos"].includes(campo.id)) {
    colHumano.appendChild(el);
  }

  // 🔹 BLOQUE 5
  else if (campo.id === "descripcion") {
    bloques[4].appendChild(el);
  }

  // 🔹 BLOQUE 6
  else if (campo.id === "observaciones") {
    bloques[5].appendChild(el);
  }
});

// 🔥 INSERTAR GRID
requerimientosGrid.appendChild(colMaterial);
requerimientosGrid.appendChild(colHumano);
bloques[3].appendChild(requerimientosGrid);

// 🔹 AGREGAR BLOQUES
bloques.forEach((b) => form.appendChild(b));

// 🔹 BOTÓN
const btn = document.createElement("button");
btn.textContent = "Enviar";
btn.type = "submit";
form.appendChild(btn);

// 🔥 =========================
// 🔥 FECHAS PRO
// 🔥 =========================
setTimeout(() => {
  const fechaEvento = document.getElementById("fecha_evento");
  const fechaInicio = document.getElementById("fecha_inicio");
  const multiDia = document.getElementById("multi_dia");

  if (!fechaEvento || !fechaInicio || !multiDia) return;

  fechaInicio.disabled = true;
  fechaInicio.style.backgroundColor = "#eee";

  const syncFecha = () => {
    if (fechaEvento.value) {
      fechaInicio.value = fechaEvento.value;
    }
  };

  const toggleMultiDia = () => {
    const activo = multiDia.dataset.value === "true";

    if (activo) {
      fechaInicio.disabled = false;
      fechaInicio.style.backgroundColor = "";
    } else {
      fechaInicio.disabled = true;
      fechaInicio.style.backgroundColor = "#eee";
      syncFecha();
    }
  };

  fechaEvento.addEventListener("change", syncFecha);
  multiDia.addEventListener("change", toggleMultiDia);

  syncFecha();
  toggleMultiDia();
}, 200);

// 🔥 =========================
// 🔥 SUBMIT
// 🔥 =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {};

  formularioData.campos.forEach((campo) => {
    if (campo.tipo === "auto_time") {
      data[campo.id] = new Date().toLocaleTimeString();
      return;
    }

    if (campo.tipo === "auto_date") {
      data[campo.id] = new Date().toLocaleDateString();
      return;
    }

    const el = document.getElementById(campo.id);
    if (!el) return;

    if (typeof el.getValores === "function") {
      data[campo.id] = el.getValores();
      return;
    }

    if (el.classList.contains("switch")) {
      data[campo.id] = el.dataset.value === "true";
      return;
    }

    data[campo.id] = el.value?.trim() || null;
  });

  // 🔴 VALIDACIÓN VISUAL
  const errores = document.querySelectorAll(".input-error");

  if (errores.length > 0) {
    alert("Corrige los campos marcados antes de enviar");
    errores[0].focus();
    return;
  }

  // 🔹 VALIDACIONES
  if (data.correo && !validarCorreo(data.correo)) {
    alert("Correo inválido");
    return;
  }

  if (data.telefono && !validarTelefono(data.telefono)) {
    alert("Teléfono inválido");
    return;
  }

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
