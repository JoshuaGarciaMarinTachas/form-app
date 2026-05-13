import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("Admin cargando...");
const tbody = document.getElementById("tbody");
const thead = document.getElementById("thead");

let dataGlobal = [];

// ==========================
// COLUMNAS
// ==========================
const ordenColumnas = [
  "prioridad",
  "correo",
  "responsable",
  "telefono",
  "nombre_evento",
  "espacio",
  "personas",
  "fecha_evento",
  "hora_inicio",
  "hora_fin",
];

const nombresBonitos = {
  prioridad: "Prioridad",
  correo: "Correo",
  responsable: "Responsable",
  telefono: "Teléfono",
  nombre_evento: "Evento",
  espacio: "Espacio",
  personas: "Personas",
  fecha_evento: "Fecha",
  hora_inicio: "Inicio",
  hora_fin: "Fin",
};

const columnasNoEditables = ["correo"];
const columnasNumericas = ["personas"];

// ==========================
//  PROTEGER RUTA + VALIDAR ADMIN
// ==========================
onAuthStateChanged(auth, async (user) => {
  console.log("USER:", user);
  if (!user) {
    console.error("NO HAY USUARIO LOGUEADO");

    alert("NO HAY USUARIO LOGUEADO");

    return;
  }

  try {
    const ref = doc(db, "admins", user.email);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("No tienes permisos de administrador");
      /*
      await signOut(auth);
      window.location.href = "login.html";
      return;
      */
    }

    init();
  } catch (err) {
    console.error("Error validando admin:", err.message);
    await signOut(auth);
    window.location.href = "login.html";
  }
});

// ==========================
// INIT
// ==========================
function init() {
  cargarSolicitudes();
  initConfig();
  initLogout();
  initBuscador();
}

// ==========================
// CARGAR SOLICITUDES
// ==========================
async function cargarSolicitudes() {
  try {
    const snap = await getDocs(collection(db, "solicitudes"));

    dataGlobal = snap.docs
      .map((d) => ({
        id: d.id,
        ...d.data(),
      }))
      .sort((a, b) => {
        const fechaA = new Date(`${a.fecha_evento} ${a.hora_inicio}`);
        const fechaB = new Date(`${b.fecha_evento} ${b.hora_inicio}`);

        return fechaA - fechaB;
      });
    console.log(" DATOS CARGADOS:", dataGlobal);

    if (dataGlobal.length === 0) {
      console.warn(" No hay datos en Firestore");
    }

    renderTabla(dataGlobal);
  } catch (err) {
    console.error("Error cargando solicitudes:", err);
    alert("Error cargando solicitudes");
  }
}

function obtenerPrioridad(fechaEvento) {
  const hoy = new Date();
  const evento = new Date(fechaEvento);

  const diferencia = Math.ceil((evento - hoy) / (1000 * 60 * 60 * 24));

  if (diferencia <= 3) {
    return {
      texto: "ALTA",
      clase: "alta",
    };
  }

  if (diferencia <= 7) {
    return {
      texto: "MEDIA",
      clase: "media",
    };
  }

  return {
    texto: "BAJA",
    clase: "baja",
  };
}

// ==========================
// RENDER TABLA
// ==========================
function renderTabla(data) {
  tbody.innerHTML = "";
  thead.innerHTML = "";

  if (!data || data.length === 0) {
    thead.innerHTML = `
      <tr>
        <th>No hay datos</th>
      </tr>
    `;
    return;
  }

  const columnas = ordenColumnas.filter((c) => c in data[0]);

  thead.innerHTML =
    "<tr>" +
    columnas.map((c) => `<th>${nombresBonitos[c] || c}</th>`).join("") +
    "<th>Acciones</th></tr>";

  data.forEach((row) => {
    const tr = document.createElement("tr");

    columnas.forEach((col) => {
      const td = document.createElement("td");

      if (col === "prioridad") {
        const prioridad = obtenerPrioridad(row.fecha_evento);

        td.innerHTML = `
    <span class="prioridad ${prioridad.clase}">
      ${prioridad.texto}
    </span>
  `;

        tr.appendChild(td);
        return;
      }

      const valor = row[col];

      if (Array.isArray(valor)) {
        td.textContent = valor.join(", ");
      } else if (typeof valor === "boolean") {
        td.textContent = valor ? "Sí" : "No";
      } else {
        td.textContent = valor ?? "";
      }

      td.contentEditable = !columnasNoEditables.includes(col);

      let valorOriginal = td.textContent;

      td.addEventListener("focus", () => {
        valorOriginal = td.textContent;
      });

      td.addEventListener("blur", async () => {
        if (columnasNoEditables.includes(col)) return;
        if (td.textContent === valorOriginal) return;

        let nuevoValor = td.textContent.trim();

        if (nuevoValor === "") {
          td.textContent = valorOriginal;
          return;
        }

        if (nuevoValor.toLowerCase() === "sí") {
          nuevoValor = true;
        } else if (nuevoValor.toLowerCase() === "no") {
          nuevoValor = false;
        } else if (columnasNumericas.includes(col) && !isNaN(nuevoValor)) {
          nuevoValor = Number(nuevoValor);
        }

        td.style.backgroundColor = "#fff3cd";

        try {
          await updateDoc(doc(db, "solicitudes", row.id), {
            [col]: nuevoValor,
          });

          td.style.backgroundColor = "#d4edda";
          row[col] = nuevoValor;
        } catch (err) {
          console.error(err);
          td.style.backgroundColor = "#f8d7da";
          td.textContent = valorOriginal;
        }

        setTimeout(() => {
          td.style.backgroundColor = "";
        }, 800);
      });

      tr.appendChild(td);
    });

    // ELIMINAR
    const acciones = document.createElement("td");

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Eliminar";
    btnDelete.classList.add("action-btn", "delete-btn");

    btnDelete.onclick = async () => {
      const confirmar = confirm("¿Eliminar solicitud?");
      if (!confirmar) return;

      try {
        await deleteDoc(doc(db, "solicitudes", row.id));
        tr.remove();
        dataGlobal = dataGlobal.filter((d) => d.id !== row.id);
      } catch (err) {
        console.error(err);
        alert("Error eliminando solicitud");
      }
    };

    acciones.appendChild(btnDelete);
    tr.appendChild(acciones);

    tbody.appendChild(tr);
  });
}

// ==========================
//  BUSCADOR MEJORADO
// ==========================
function initBuscador() {
  const input = document.getElementById("buscador");

  input.addEventListener("input", () => {
    const texto = input.value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const filtrado = dataGlobal.filter((row) =>
      Object.values(row).some((v) => {
        if (v === null || v === undefined) return false;

        return String(v)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(texto);
      }),
    );

    renderTabla(filtrado);
  });
}

// ==========================
// CONFIG FORMULARIO
// ==========================
function initConfig() {
  const toggle = document.getElementById("toggleForm");
  const ref = doc(db, "config", "formulario");

  getDoc(ref)
    .then((snap) => {
      if (snap.exists()) {
        toggle.checked = snap.data().habilitado;
      }
    })
    .catch(console.error);

  toggle.addEventListener("change", async () => {
    try {
      await setDoc(ref, {
        habilitado: toggle.checked,
      });
    } catch (err) {
      console.error(err);
      alert("Error guardando configuración");
    }
  });
}

// ==========================
// LOGOUT
// ==========================
function initLogout() {
  const logoutBtn = document.getElementById("logout");

  logoutBtn.onclick = async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (err) {
      console.error(err);
      alert("Error cerrando sesión");
    }
  };
}
