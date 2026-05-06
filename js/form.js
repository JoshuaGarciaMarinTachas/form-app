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

// TÍTULO
titulo.textContent = formularioData.titulo;

// BLOQUES
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

//  =========================
//  BLOQUE 4 LIMPIO (SIN TÍTULOS INTERNOS)
//  =========================
const requerimientosGrid = document.createElement("div");
requerimientosGrid.classList.add("requerimientos-grid");

const colMaterial = document.createElement("div");
colMaterial.classList.add("columna");

const colHumano = document.createElement("div");
colHumano.classList.add("columna");

// CONTENEDOR CORRECTO (AQUÍ VA)
const switchesContainer = document.createElement("div");
switchesContainer.classList.add("switches-row");
const switchesContainerLogistica = document.createElement("div");
switchesContainerLogistica.classList.add("switches-row");

// CREAR CAMPOS
formularioData.campos.forEach((campo) => {
  const el = crearCampo(campo);
  if (!el) return;

  // BLOQUE 1
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
    // SI ES EL SWITCH → VA ARRIBA DE TODO
    if (campo.id === "acudio_dep") {
      bloques[0].insertBefore(el, bloques[0].children[1] || null);
    } else {
      bloques[0].appendChild(el);
    }
  }

  // BLOQUE 2
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
    if (campo.id === "consejo" || campo.id === "multi_dia") {
      switchesContainer.appendChild(el);
    } else {
      bloques[1].appendChild(el);
    }
  }

  // BLOQUE 3
  else if (
    ["externos", "discapacidad", "espacio", "montaje", "personas"].includes(
      campo.id,
    )
  ) {
    if (campo.id === "externos" || campo.id === "discapacidad") {
      switchesContainerLogistica.appendChild(el);
    } else {
      bloques[2].appendChild(el);
    }
  }

  // BLOQUE 4 CORRECTO
  else if (["materiales", "sonido", "personificadores"].includes(campo.id)) {
    colMaterial.appendChild(el);
  } else if (["humanos"].includes(campo.id)) {
    colHumano.appendChild(el);
  }

  // BLOQUE 5
  else if (campo.id === "descripcion") {
    bloques[4].appendChild(el);
  }

  // BLOQUE 6
  else if (campo.id === "observaciones") {
    bloques[5].appendChild(el);
  }
});

// INSERTAR SWITCHES ARRIBA DEL BLOQUE 2
bloques[1].insertBefore(switchesContainer, bloques[1].children[1] || null);

// INSERTAR SWITCHES LOGÍSTICA (AQUÍ SÍ VA)
bloques[2].insertBefore(
  switchesContainerLogistica,
  bloques[2].children[1] || null,
);

// INSERTAR GRID
requerimientosGrid.appendChild(colMaterial);
requerimientosGrid.appendChild(colHumano);
bloques[3].appendChild(requerimientosGrid);

//  AGREGAR BLOQUES
bloques.forEach((b) => form.appendChild(b));

//  BOTÓN
const btn = document.createElement("button");
btn.textContent = "Enviar";
btn.type = "submit";
form.appendChild(btn);

// =========================
// FECHAS
// =========================
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
    const activo = multiDia.checked;

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

//  =========================
//  SUBMIT
//  =========================
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

    if (el.type === "checkbox") {
      data[campo.id] = el.checked;
      return;
    }

    data[campo.id] = el.value?.trim() || null;
  });

  // 🔥 CAMPOS OBLIGATORIOS
  const obligatorios = [
    "correo",
    "responsable",
    "espacio",
    "horario",
    "fecha_evento",
  ];

  let hayError = false;

  // 🔥 VALIDAR CAMPOS OBLIGATORIOS
  obligatorios.forEach((id) => {
    const valor = data[id];
    const el = document.getElementById(id);

    if (!valor || valor === "") {
      hayError = true;
      if (el) el.classList.add("input-error");
    } else {
      if (el) el.classList.remove("input-error");
    }
  });

  // 🔥 VALIDAR SWITCH (ACUDIÓ)
  const acudio = document.getElementById("acudio_dep");
  const toggle = acudio?.nextElementSibling;

  if (!acudio || acudio.checked === false) {
    hayError = true;
    if (toggle) toggle.classList.add("input-error");
  } else {
    if (toggle) toggle.classList.remove("input-error");
  }

  // 🔥 BLOQUEAR ENVÍO SI HAY ERROR
  if (hayError) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  // VALIDACIONES
  if (data.correo && !validarCorreo(data.correo)) {
    alert("Correo inválido");
    return;
  }

  if (data.telefono && !validarTelefono(data.telefono)) {
    alert(
      "El teléfono debe tener 10 o 12 dígitos y no debe contener símbolos (ej: 7221234567 o 527221234567)",
    );
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

document.querySelectorAll("input, select, textarea").forEach((el) => {
  el.addEventListener("input", () => {
    el.classList.remove("input-error");
  });
});
