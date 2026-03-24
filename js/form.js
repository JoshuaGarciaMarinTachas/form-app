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

const grupos = {};

formularioData.campos.forEach((campo) => {
  const el = crearCampo(campo);
  if (!el) return;

  const grupoId = campo.grupo || 0;

  if (!grupos[grupoId]) {
    const contenedor = document.createElement("div");
    contenedor.classList.add("bloque");

    grupos[grupoId] = contenedor;
    form.appendChild(contenedor);
  }

  grupos[grupoId].appendChild(el);
});

// 🔹 Botón
const btn = document.createElement("button");
btn.textContent = "Enviar";
btn.type = "submit";
form.appendChild(btn);

// 🔹 Eventos dinámicos (DESPUÉS del render)
setTimeout(() => {
  const fechaInicio = document.getElementById("fecha_inicio");
  const fechaEvento = document.getElementById("fecha_evento");
  const fechaFin = document.getElementById("fecha_fin");
  const multiDia = document.getElementById("multi_dia");

  // 🟢 --- FECHA INICIO BLOQUEADA ---
  fechaInicio.readOnly = true;
  fechaInicio.style.backgroundColor = "#e0e0e0";
  fechaInicio.style.color = "#666";
  fechaInicio.style.cursor = "not-allowed";
  fechaInicio.style.border = "1px solid #ccc";

  // 🟢 --- ASEGURAR QUE FECHA FIN SEA EDITABLE ---
  if (fechaFin) {
    fechaFin.readOnly = false;
  }

  // 🟢 --- SINCRONIZAR FECHAS ---
  function sincronizarFechas() {
    fechaInicio.value = fechaEvento.value;
  }

  sincronizarFechas(); // copia inmediata
  fechaEvento.addEventListener("change", sincronizarFechas);

  // 🟢 --- MULTI DÍA ---
  multiDia.addEventListener("click", () => {
    const activo = multiDia.dataset.value === "true";

    const contInicio = fechaInicio.parentElement;
    const contFin = fechaFin.parentElement;

    if (activo) {
      contInicio.style.display = "block";
      contFin.style.display = "block";
    } else {
      contInicio.style.display = "none";
      contFin.style.display = "none";
    }
  });

  // 🟢 --- SONIDO → MICRÓFONOS ---
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
    if (campo.tipo === "auto_time") {
      data[campo.id] = new Date().toLocaleTimeString();
    } else if (campo.tipo === "auto_date") {
      data[campo.id] = new Date().toLocaleDateString();
    } else {
      const el = document.getElementById(campo.id);

      if (!el && campo.tipo !== "multiselect") return;

      if (campo.tipo === "switch") {
        data[campo.id] = el.dataset.value === "true";
      } else if (campo.tipo === "time_range") {
        const inicioEl = document.getElementById(campo.id + "_inicio");
        const finEl = document.getElementById(campo.id + "_fin");

        if (!inicioEl || !finEl) {
          alert("Error interno: horario no encontrado");
          throw new Error("Inputs de horario no existen");
        }

        const esMultiDia =
          document.getElementById("multi_dia").dataset.value === "true";

        if (esMultiDia && !document.getElementById("fecha_fin").value) {
          alert("Debes seleccionar fecha de fin");
          return;
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

        data[campo.id] = seleccionados;
      } else {
        const value = el.value?.trim();
        data[campo.id] = value !== "" ? value : null;
      }
    }
  });

  // 🔹 Validaciones
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
