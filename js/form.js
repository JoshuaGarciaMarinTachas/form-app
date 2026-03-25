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

// 🔹 CREAR BLOQUES
const bloques = [
  document.createElement("div"),
  document.createElement("div"),
  document.createElement("div"),
  document.createElement("div"),
  document.createElement("div"),
  document.createElement("div"),
];

bloques.forEach((b) => b.classList.add("bloque"));

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

// 🔹 ASIGNACIÓN DE CAMPOS
formularioData.campos.forEach((campo) => {
  const el = crearCampo(campo);
  if (!el) return;

  if (
    [
      "correo",
      "nombre",
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
    ["materiales", "microfonos", "personificadores", "humanos"].includes(
      campo.id,
    )
  ) {
    bloques[3].appendChild(el);
  } else if (campo.id === "descripcion") {
    bloques[4].appendChild(el);
  } else if (campo.id === "observaciones") {
    bloques[5].appendChild(el);
  }
});

bloques.forEach((b) => form.appendChild(b));

// 🔹 Botón
const btn = document.createElement("button");
btn.textContent = "Enviar";
btn.type = "submit";
form.appendChild(btn);

// 🔹 FUNCIONES DE ERROR
function crearError(input) {
  let msg = input.parentElement.querySelector(".error-msg");

  if (!msg) {
    msg = document.createElement("div");
    msg.classList.add("error-msg");
    input.parentElement.appendChild(msg);
  }

  return msg;
}

function mostrarError(input, mensaje) {
  const msg = crearError(input);
  msg.textContent = mensaje;
  msg.style.display = "block";
  input.classList.add("input-error");
}

function limpiarError(input) {
  const msg = input.parentElement.querySelector(".error-msg");
  if (msg) msg.style.display = "none";
  input.classList.remove("input-error");
}

// 🔹 EVENTOS
setTimeout(() => {
  const fechaInicio = document.getElementById("fecha_inicio");
  const fechaEvento = document.getElementById("fecha_evento");
  const fechaFin = document.getElementById("fecha_fin");
  const multiDia = document.getElementById("multi_dia");

  const cargo = document.getElementById("cargo_responsable");
  const campoAdmin = document.getElementById("cargo_admin").parentElement;
  const campoUnidad = document.getElementById("unidad").parentElement;

  const espacio = document.getElementById("espacio");
  const montaje = document.getElementById("montaje").parentElement;
  const personasInput = document.getElementById("personas");

  const correo = document.getElementById("correo");
  const telefono = document.getElementById("telefono");

  const microInput = document.getElementById("microfonos");
  const persInput = document.getElementById("personificadores");

  if (persInput) {
    persInput.min = 0;
    persInput.max = 7;
    persInput.value = 0; // 🔥 valor inicial
  }

  if (microInput) {
    microInput.min = 0;
    microInput.max = 2;
    microInput.value = 0; // 🔥 valor inicial
  }

  // 🔹 VALIDACIONES

  correo.addEventListener("input", () => {
    const value = correo.value.trim();
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!valido) {
      mostrarError(correo, "Correo inválido (ej: usuario@dominio.com)");
    } else {
      limpiarError(correo);
    }
  });

  telefono.addEventListener("input", () => {
    const value = telefono.value.trim();

    if (!/^\d{10,12}$/.test(value)) {
      mostrarError(telefono, "Debe tener entre 10 y 12 dígitos");
    } else {
      limpiarError(telefono);
    }
  });

  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener("input", () => {
      let value = parseInt(input.value);

      if (isNaN(value)) return;

      if (value < 0) {
        input.value = 0;
      }
    });
  });

  if (microInput) {
    microInput.addEventListener("input", () => {
      let num = parseInt(microInput.value);

      if (isNaN(num)) num = 0;

      if (num < 0) num = 0;
      if (num > 2) num = 2;

      microInput.value = num;

      if (num < 0 || num > 2) {
        mostrarError(microInput, "Debe estar entre 0 y 2 micrófonos");
      } else {
        limpiarError(microInput);
      }
    });
  }

  if (persInput) {
    persInput.addEventListener("input", () => {
      let num = parseInt(persInput.value);

      if (isNaN(num)) num = 0;

      if (num < 0) num = 0;
      if (num > 7) num = 7;

      persInput.value = num;

      if (num < 0 || num > 7) {
        mostrarError(persInput, "Debe estar entre 0 y 7");
      } else {
        limpiarError(persInput);
      }
    });
  }

  // 🔹 PERSONAS
  function validarPersonas() {
    const valor = espacio.value;
    const num = parseInt(personasInput.value);

    if (!num) {
      limpiarError(personasInput);
      return;
    }

    if (valor === "Auditorio" && num > 110) {
      mostrarError(personasInput, "Máximo 110 personas");
    } else if (valor === "Sala de Consejo" && num > 50) {
      mostrarError(personasInput, "Máximo 50 personas");
    } else {
      limpiarError(personasInput);
    }
  }

  function actualizarPersonas() {
    const valor = espacio.value;

    if (valor === "Auditorio") {
      personasInput.placeholder = "Máximo 110 personas";
    } else if (valor === "Sala de Consejo") {
      personasInput.placeholder = "Máximo 50 personas";
    } else {
      personasInput.placeholder = "";
    }

    validarPersonas();
  }

  espacio.addEventListener("change", actualizarPersonas);
  personasInput.addEventListener("input", validarPersonas);

  actualizarPersonas();

  // 🔹 MONTAJE
  function controlarMontaje() {
    const valor = espacio.value;
    montaje.style.display =
      valor === "Auditorio" || valor === "Sala de Consejo" ? "block" : "none";
  }

  espacio.addEventListener("change", controlarMontaje);
  controlarMontaje();

  // 🔹 CARGO
  function actualizarCamposCargo() {
    const valor = cargo.value;

    campoAdmin.style.display = "none";
    campoUnidad.style.display = "none";

    if (valor === "Administrativo") campoAdmin.style.display = "block";
    if (valor === "Estudiante" || valor === "Docente")
      campoUnidad.style.display = "block";
  }

  cargo.addEventListener("change", actualizarCamposCargo);
  actualizarCamposCargo();

  // 🔹 FECHAS
  fechaInicio.readOnly = true;
  fechaInicio.style.backgroundColor = "#e0e0e0";

  function sincronizarFechas() {
    fechaInicio.value = fechaEvento.value;
  }

  fechaEvento.addEventListener("change", sincronizarFechas);
  sincronizarFechas();

  multiDia.addEventListener("click", () => {
    const activo = multiDia.dataset.value === "true";

    fechaInicio.parentElement.style.display = activo ? "block" : "none";
    fechaFin.parentElement.style.display = activo ? "block" : "none";
  });
}, 100);

// 🔹 SUBMIT
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔹 PERSONIFICADORES
  const persChk = document.getElementById("personificadores_check");
  const persVal = document.getElementById("cantidad_personificadores");

  data.personificadores = persChk?.checked ? parseInt(persVal.value) || 0 : 0;

  // 🔹 SONIDO
  const sonidoChk = document.getElementById("sonido_check");
  const microChk = document.getElementById("micro_check");
  const microVal = document.getElementById("cantidad_microfonos");
  const bocinaChk = document.getElementById("bocina");

  data.sonido = sonidoChk?.checked || false;
  data.microfonos = microChk?.checked ? parseInt(microVal.value) || 0 : 0;
  data.bocina = bocinaChk?.checked || false;

  // 🔴 BLOQUEAR SI HAY ERRORES
  const errores = document.querySelectorAll(".input-error");
  if (errores.length > 0) {
    alert("Corrige los campos marcados antes de enviar");
    errores[0].focus();
    return;
  }

  const data = {};

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

  try {
    await addDoc(collection(db, "solicitudes"), data);
    alert("Solicitud enviada correctamente");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Error al enviar");
  }
});
