import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tabla = document.querySelector("#tablaSolicitudes tbody");
const encabezados = document.getElementById("encabezados");
const toggleForm = document.getElementById("toggleForm");

const configRef = doc(db, "config", "formulario");

async function cargarEstadoFormulario() {
  const snap = await getDoc(configRef);

  if (snap.exists()) {
    toggleForm.checked = snap.data().habilitado;
  }
}

toggleForm.addEventListener("change", async () => {
  await setDoc(configRef, {
    habilitado: toggleForm.checked,
  });
});

async function cargarSolicitudes() {
  const querySnapshot = await getDocs(collection(db, "solicitudes"));

  tabla.innerHTML = "";

  let columnas = [];

  querySnapshot.forEach((docSnap, index) => {
    const data = docSnap.data();

    // 🔥 GENERAR ENCABEZADOS UNA SOLA VEZ
    if (index === 0) {
      columnas = Object.keys(data);

      encabezados.innerHTML =
        columnas.map((col) => `<th>${col}</th>`).join("") + "<th>Acciones</th>";
    }

    const fila = document.createElement("tr");

    columnas.forEach((col) => {
      const td = document.createElement("td");

      td.textContent = data[col] ?? "";

      // 🔥 HACER EDITABLE
      td.contentEditable = true;

      td.addEventListener("blur", async () => {
        const nuevoValor = td.textContent;

        await updateDoc(doc(db, "solicitudes", docSnap.id), {
          [col]: nuevoValor,
        });
      });

      fila.appendChild(td);
    });

    // 🔥 BOTÓN GUARDAR (opcional)
    const acciones = document.createElement("td");
    acciones.innerHTML = `<button>✔</button>`;
    fila.appendChild(acciones);

    tabla.appendChild(fila);
  });
}

cargarSolicitudes();
cargarEstadoFormulario();
