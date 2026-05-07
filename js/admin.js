import { db } from "./firebase.js";

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
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

const tbody = document.getElementById("tbody");
const thead = document.getElementById("thead");

let dataGlobal = [];

// ==========================
// COLUMNAS
// ==========================
const ordenColumnas = [
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

// COLUMNAS NO EDITABLES
const columnasNoEditables = ["correo"];

// COLUMNAS NUMÉRICAS
const columnasNumericas = ["personas"];

// ==========================
// PROTEGER RUTA
// ==========================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  init();
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

    dataGlobal = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    renderTabla(dataGlobal);
  } catch (err) {
    console.error(err);
    alert("Error cargando solicitudes");
  }
}

// ==========================
// RENDER TABLA
// ==========================
function renderTabla(data) {
  tbody.innerHTML = "";
  thead.innerHTML = "";

  if (data.length === 0) {
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

      const valor = row[col];

      // ==========================
      // FORMATO VISUAL
      // ==========================
      if (Array.isArray(valor)) {
        td.textContent = valor.join(", ");
      } else if (typeof valor === "boolean") {
        td.textContent = valor ? "Sí" : "No";
      } else {
        td.textContent = valor ?? "";
      }

      // ==========================
      // EDITABLE
      // ==========================
      td.contentEditable = !columnasNoEditables.includes(col);

      let valorOriginal = td.textContent;

      td.addEventListener("focus", () => {
        valorOriginal = td.textContent;
      });

      // ==========================
      // GUARDAR CAMBIOS
      // ==========================
      td.addEventListener("blur", async () => {
        if (columnasNoEditables.includes(col)) return;

        if (td.textContent === valorOriginal) return;

        let nuevoValor = td.textContent.trim();

        // NO GUARDAR VACÍOS
        if (nuevoValor === "") {
          td.textContent = valorOriginal;
          return;
        }

        // BOOLEANOS
        if (nuevoValor.toLowerCase() === "sí") {
          nuevoValor = true;
        } else if (nuevoValor.toLowerCase() === "no") {
          nuevoValor = false;
        }

        // NÚMEROS
        else if (columnasNumericas.includes(col) && !isNaN(nuevoValor)) {
          nuevoValor = Number(nuevoValor);
        }

        td.style.backgroundColor = "#fff3cd";

        try {
          await updateDoc(doc(db, "solicitudes", row.id), {
            [col]: nuevoValor,
          });

          td.style.backgroundColor = "#d4edda";

          // ACTUALIZAR EN MEMORIA
          row[col] = nuevoValor;
        } catch (err) {
          console.error(err);

          td.style.backgroundColor = "#f8d7da";

          // RESTAURAR VALOR ORIGINAL
          td.textContent = valorOriginal;
        }

        setTimeout(() => {
          td.style.backgroundColor = "";
        }, 800);
      });

      tr.appendChild(td);
    });

    // ==========================
    // ELIMINAR
    // ==========================
    const acciones = document.createElement("td");

    const btnDelete = document.createElement("button");

    btnDelete.textContent = "🗑";

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
// BUSCADOR
// ==========================
function initBuscador() {
  const input = document.getElementById("buscador");

  input.addEventListener("input", () => {
    const texto = input.value.toLowerCase().trim();

    const filtrado = dataGlobal.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(texto)),
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
    .catch((err) => {
      console.error(err);
    });

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
