import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let dataGlobal = [];

export async function initTabla() {
  const snap = await getDocs(collection(db, "solicitudes"));
  dataGlobal = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  renderTabla(dataGlobal);
  initBuscador();
}

function renderTabla(data) {
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");

  tbody.innerHTML = "";

  if (data.length === 0) return;

  const columnas = Object.keys(data[0]);

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

    // 🔥 acciones
    const acciones = document.createElement("td");

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "🗑";

    btnDelete.onclick = async () => {
      if (confirm("¿Eliminar?")) {
        await deleteDoc(doc(db, "solicitudes", row.id));
        tr.remove();
      }
    };

    acciones.appendChild(btnDelete);
    tr.appendChild(acciones);

    tbody.appendChild(tr);
  });
}
