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

  const columnas = Object.keys(data[0]).filter((c) => c !== "id");

  thead.innerHTML =
    "<tr>" +
    columnas.map((c) => `<th>${c}</th>`).join("") +
    "<th>Acciones</th></tr>";

  data.forEach((row) => {
    const tr = document.createElement("tr");

    columnas.forEach((col) => {
      const td = document.createElement("td");
      td.textContent = row[col] ?? "";
      td.contentEditable = true;

      td.addEventListener("blur", async () => {
        await updateDoc(doc(db, "solicitudes", row.id), {
          [col]: td.textContent,
        });
      });

      tr.appendChild(td);
    });

    // 🔥 BOTÓN ELIMINAR
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
