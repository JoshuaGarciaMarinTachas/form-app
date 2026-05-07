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

// 🔐 PROTEGER RUTA
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    init();
  }
});

function init() {
  cargarSolicitudes();
  initConfig();
  initLogout();
}

const tbody = document.getElementById("tbody");
const thead = document.getElementById("thead");

let dataGlobal = [];

// 🔥 ORDEN DE COLUMNAS
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

// 🔥 NOMBRES BONITOS
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

// ==========================
// 📊 CARGAR TABLA
// ==========================
async function cargarSolicitudes() {
  const snap = await getDocs(collection(db, "solicitudes"));

  dataGlobal = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  renderTabla(dataGlobal);
  initBuscador();
}

// ==========================
// 🧠 RENDER TABLA
// ==========================
function renderTabla(data) {
  tbody.innerHTML = "";
  thead.innerHTML = "";

  if (data.length === 0) return;

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

      // 🔥 FORMATO VISUAL
      if (Array.isArray(valor)) {
        td.textContent = valor.join(", ");
      } else if (typeof valor === "boolean") {
        td.textContent = valor ? "Sí" : "No";
      } else {
        td.textContent = valor ?? "";
      }

      td.contentEditable = true;

      // 🔥 EVITAR GUARDADO INNECESARIO
      let valorOriginal = td.textContent;

      td.addEventListener("focus", () => {
        valorOriginal = td.textContent;
      });

      // ==========================
      // 💾 GUARDAR CAMBIOS
      // ==========================
      td.addEventListener("blur", async () => {
        if (td.textContent === valorOriginal) return;

        let nuevoValor = td.textContent.trim();

        // 🔁 ARRAY
        if (nuevoValor.includes(",")) {
          nuevoValor = nuevoValor.split(",").map((v) => v.trim());
        }

        // 🔢 NÚMERO
        else if (!isNaN(nuevoValor) && nuevoValor !== "") {
          nuevoValor = Number(nuevoValor);
        }

        // 🔘 BOOLEANO
        else if (nuevoValor.toLowerCase() === "sí") {
          nuevoValor = true;
        } else if (nuevoValor.toLowerCase() === "no") {
          nuevoValor = false;
        }

        // 🚫 NO GUARDAR VACÍOS
        if (nuevoValor === "" || nuevoValor === null) return;

        td.style.backgroundColor = "#fff3cd";

        try {
          await updateDoc(doc(db, "solicitudes", row.id), {
            [col]: nuevoValor,
          });

          td.style.backgroundColor = "#d4edda";
        } catch (err) {
          console.error(err);
          td.style.backgroundColor = "#f8d7da";
        }

        setTimeout(() => {
          td.style.backgroundColor = "";
        }, 800);
      });

      tr.appendChild(td);
    });

    // 🗑 ELIMINAR
    const acciones = document.createElement("td");

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "🗑";

    btnDelete.onclick = async () => {
      if (confirm("¿Eliminar solicitud?")) {
        await deleteDoc(doc(db, "solicitudes", row.id));
        tr.remove();
      }
    };

    acciones.appendChild(btnDelete);
    tr.appendChild(acciones);

    tbody.appendChild(tr);
  });
}

// ==========================
// 🔍 BUSCADOR
// ==========================
function initBuscador() {
  const input = document.getElementById("buscador");

  input.addEventListener("input", () => {
    const texto = input.value.toLowerCase();

    const filtrado = dataGlobal.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(texto)),
    );

    renderTabla(filtrado);
  });
}

// ==========================
// ⚙️ CONFIG FORMULARIO
// ==========================
function initConfig() {
  const toggle = document.getElementById("toggleForm");
  const ref = doc(db, "config", "formulario");

  getDoc(ref).then((snap) => {
    if (snap.exists()) {
      toggle.checked = snap.data().habilitado;
    }
  });

  toggle.addEventListener("change", async () => {
    await setDoc(ref, {
      habilitado: toggle.checked,
    });
  });
}

// ==========================
// 🔐 LOGOUT
// ==========================
function initLogout() {
  document.getElementById("logout").onclick = async () => {
    await signOut(auth);
    window.location.href = "login.html";
  };
}
