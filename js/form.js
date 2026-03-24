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
  const el = crearCampo(campo);
  if (el) form.appendChild(el);
});

const fechaInicio = document.getElementById("fecha_inicio");

// 🔒 Bloquear edición
fechaInicio.readOnly = true;

// 🎨 Estilo visual profesional
fechaInicio.style.backgroundColor = "#f1f1f1";
fechaInicio.style.color = "#666";
fechaInicio.style.cursor = "not-allowed";
fechaInicio.style.border = "1px solid #ccc";

const fechaEvento = document.getElementById("fecha_evento");

fechaEvento.addEventListener("change", () => {
  fechaInicio.value = fechaEvento.value;
});

const multiDia = document.getElementById("multi_dia");

multiDia.addEventListener("click", () => {
  const activo = multiDia.dataset.value === "true";

  const contInicio = document.getElementById("fecha_inicio").parentElement;
  const contFin = document.getElementById("fecha_fin").parentElement;

  if (activo) {
    contInicio.style.display = "block";
    contFin.style.display = "block";
  } else {
    contInicio.style.display = "none";
    contFin.style.display = "none";
  }
});

// 🔹 Botón
const btn = document.createElement("button");
btn.textContent = "Enviar";
btn.type = "submit";
form.appendChild(btn);

// 🔹 Eventos dinámicos (DESPUÉS del render)

// Multi día
setTimeout(() => {
  const multiDia = document.getElementById("multi_dia");

  multiDia.addEventListener("click", () => {
    const activo = multiDia.dataset.value === "true";

    const inicioContainer =
      document.getElementById("fecha_inicio").parentElement;
    const finContainer = document.getElementById("fecha_fin").parentElement;

    if (activo) {
      inicioContainer.style.display = "block";
      finContainer.style.display = "block";
    } else {
      inicioContainer.style.display = "none";
      finContainer.style.display = "none";
    }
  });

  // Sonido → micrófonos
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
}, 100);

// 🔹 Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {};

  formularioData.campos.forEach((campo) => {
    // 🔹 AUTO
    if (campo.tipo === "auto_time") {
      data[campo.id] = new Date().toLocaleTimeString();
    } else if (campo.tipo === "auto_date") {
      data[campo.id] = new Date().toLocaleDateString();
    } else {
      const el = document.getElementById(campo.id);

      // 🔴 Si no existe el elemento, lo ignoramos
      if (!el && campo.tipo !== "multiselect") return;

      // 🔹 SWITCH (slider)
      if (campo.tipo === "switch") {
        data[campo.id] = el.dataset.value === "true";
      } else if (campo.tipo === "time_range") {
        const inicioEl = document.getElementById(campo.id + "_inicio");
        const finEl = document.getElementById(campo.id + "_fin");

        // 🔥 DEBUG (MUY IMPORTANTE)
        console.log("Horario inputs:", inicioEl, finEl);

        if (!inicioEl || !finEl) {
          alert("Error interno: horario no encontrado");
          throw new Error("Inputs de horario no existen");
        }

        // 🔥 Validar fechas solo si es multi día
        const esMultiDia =
          document.getElementById("multi_dia").dataset.value === "true";

        if (esMultiDia) {
          if (!data.fecha_fin) {
            alert("Debes seleccionar fecha de fin");
            return;
          }
        }

        const inicio = inicioEl.value;
        const fin = finEl.value;

        if (!inicio || !fin) {
          alert("Completa el horario");
          throw new Error("Horario incompleto");
        }

        data[campo.id] = `${inicio} - ${fin}`;
      } else if (campo.tipo === "multiselect") {
        const seleccionados = [
          ...document.querySelectorAll(`input[name="${campo.id}"]:checked`),
        ].map((el) => el.value);

        data[campo.id] = seleccionados; // array (Firebase lo acepta)

        // 🔹 INPUT NORMAL
      } else {
        const value = el.value?.trim();

        // Evita undefined
        data[campo.id] = value !== "" ? value : null;
      }
    }
  });

  // Validaciones después de llenar data

  if (!validarCorreo(data.correo)) {
    alert("Correo inválido");
    return;
  }

  if (!validarTelefono(data.telefono)) {
    alert("Teléfono inválido (10 dígitos)");
    return;
  }

  if (data.espacio === "Auditorio" && data.personas > 110) {
    alert("Capacidad máxima Auditorio: 110");
    return;
  }

  if (data.espacio === "Sala de Consejo" && data.personas > 50) {
    alert("Capacidad máxima Sala: 50");
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
