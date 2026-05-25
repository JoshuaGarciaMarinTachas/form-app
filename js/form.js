import { validarCorreo, validarTelefono } from "./validations.js";
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
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
      "nombre_evento",
      "cargo_responsable",
      "cargo_admin",
      "unidad",
      "telefono",
    ].includes(campo.id)
  ) {
    bloques[0].appendChild(el);
  }

  // BLOQUE 2
  else if (["consejo", "fecha_aprobacion", "multi_dia"].includes(campo.id)) {
    // SWITCHES
    if (campo.id === "consejo" || campo.id === "multi_dia") {
      switchesContainer.appendChild(el);
    }

    // RESTO
    else {
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

// =========================
// EVENTOS MULTIDÍA
// =========================

const diasContainer = document.createElement("div");
diasContainer.classList.add("dias-container");
diasContainer.style.display = "none";

const btnAgregarDia = document.createElement("button");
btnAgregarDia.type = "button";
btnAgregarDia.textContent = "+ Agregar día";
btnAgregarDia.classList.add("btn-agregar-dia");
btnAgregarDia.style.display = "none";

bloques[1].appendChild(diasContainer);
bloques[1].appendChild(btnAgregarDia);

let contadorDias = 0;

function renumerarDias() {
  const dias = document.querySelectorAll(".dia-card");

  dias.forEach((dia, index) => {
    const titulo = dia.querySelector("h4");
    if (titulo) {
      titulo.textContent = `Día ${index + 1}`;
    }
  });

  contadorDias = dias.length;
}

function crearDia() {
  contadorDias++;

  const card = document.createElement("div");
  card.classList.add("dia-card");

  card.innerHTML = `
    <h4>Día ${contadorDias}</h4>

    <div class="dia-grid">
      <div class="form-group">
        <label>Fecha</label>
        <input type="date" class="dia-fecha">
      </div>

      <div class="form-group">
        <label>Hora inicio</label>
        <input
          type="time"
          class="dia-inicio"
          min="07:00"
          max="17:00"
        >
      </div>

      <div class="form-group">
        <label>Hora fin</label>
        <input
          type="time"
          class="dia-fin"
          min="07:00"
          max="17:00"
        >
      </div>
    </div>
  `;

  if (contadorDias > 1) {
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar día";
    btnEliminar.classList.add("btn-eliminar-dia");

    btnEliminar.addEventListener("click", () => {
      card.remove();
      renumerarDias();
    });

    card.appendChild(btnEliminar);
  }

  diasContainer.appendChild(card);
  renumerarDias();
}

btnAgregarDia.addEventListener("click", crearDia);

crearDia();

setTimeout(() => {
  const multiDia = document.getElementById("multi_dia");

  if (!multiDia) return;

  const actualizarDias = () => {
    if (multiDia.checked) {
      btnAgregarDia.style.display = "block";
    } else {
      btnAgregarDia.style.display = "none";

      const dias = document.querySelectorAll(".dia-card");

      dias.forEach((dia, index) => {
        if (index > 0) {
          dia.remove();
        }
      });

      renumerarDias();
    }
  };

  multiDia.addEventListener("change", actualizarDias);

  actualizarDias();
}, 200);

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

//  =========================
//  SUBMIT
//  =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {};

  //  FUNCIÓN PARA SABER SI EL CAMPO ES VISIBLE
  const esVisible = (el) => {
    return el && el.offsetParent !== null;
  };

  const nombresCampos = {
    correo: "Correo",
    telefono: "Teléfono",
    responsable: "Responsable",
    nombre_evento: "Nombre del evento",
    espacio: "Espacio solicitado",
  };

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

  // ELIMINAR MONTAJE SI NO ES SALA DE CONSEJO
  if (data.espacio !== "Sala de Consejo") {
    delete data.montaje;
  }

  //  CAMPOS OBLIGATORIOS
  const obligatorios = ["correo", "telefono", "nombre_evento", "espacio"];

  let hayError = false;
  let faltantes = [];

  //  VALIDAR CAMPOS OBLIGATORIOS
  obligatorios.forEach((id) => {
    const valor = data[id];
    const el = document.getElementById(id);

    if (!el || !esVisible(el)) return;

    if (!valor || valor === "") {
      hayError = true;
      faltantes.push(nombresCampos[id] || id);
      el.classList.add("input-error");
    } else {
      el.classList.remove("input-error");
    }
  });

  //  BLOQUEAR ENVÍO SI HAY ERROR
  if (hayError) {
    const lista = faltantes.map((campo) => `- ${campo}`).join("\n");

    alert(`Te faltan los siguientes campos:\n\n${lista}`);

    //  SCROLL AL PRIMER ERROR
    const primerError = document.querySelector(".input-error");
    if (primerError) {
      primerError.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

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
    // =========================
    // VALIDAR SI FORMULARIO ESTÁ ACTIVO
    // =========================

    // VERIFICAR FORMULARIO ACTIVO
    const configRef = doc(db, "config", "formulario");
    const configSnap = await getDoc(configRef);

    // Si no existe o está deshabilitado → bloquear
    if (!configSnap.exists() || !configSnap.data()?.habilitado) {
      alert("La recepción de solicitudes está deshabilitada temporalmente");
      return;
    }

    // =========================
    // ENVIAR SOLICITUD
    // =========================

    if (data.multi_dia) {
      data.dias = [];

      document.querySelectorAll(".dia-card").forEach((dia) => {
        data.dias.push({
          fecha: dia.querySelector(".dia-fecha")?.value || "",
          hora_inicio: dia.querySelector(".dia-inicio")?.value || "",
          hora_fin: dia.querySelector(".dia-fin")?.value || "",
        });
      });
    }

    data.dias = [];

    const tarjetas = document.querySelectorAll(".dia-card");

    for (const dia of tarjetas) {
      const fecha = dia.querySelector(".dia-fecha")?.value;
      const inicio = dia.querySelector(".dia-inicio")?.value;
      const fin = dia.querySelector(".dia-fin")?.value;

      if (!fecha || !inicio || !fin) {
        alert("Completa fecha y horarios de todos los días");
        return;
      }

      if (inicio < "07:00" || fin > "17:00") {
        alert("El horario permitido es de 07:00 a 17:00");
        return;
      }

      if (fin <= inicio) {
        alert("La hora de fin debe ser mayor a la de inicio");
        return;
      }

      data.dias.push({
        fecha,
        hora_inicio: inicio,
        hora_fin: fin,
      });
    }

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
