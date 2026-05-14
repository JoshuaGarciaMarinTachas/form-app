import { app } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Inicializar
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  console.log("Admin cargando...");

  // ✅ CORREGIDO
  const tbody = document.getElementById("tbody");
  const thead = document.querySelector("thead");

  if (!tbody || !thead) {
    console.error("No se encontraron los elementos 'tbody' o 'thead'");
    return;
  }

  let dataGlobal = [];

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
    nombre_evento: "Evento",
    responsable: "Responsable",
    cargo_responsable: "Cargo",
    unidad: "Unidad",
    correo: "Correo",
    telefono: "Teléfono",

    fecha_evento: "Fecha del evento",
    hora_inicio: "Hora de inicio",
    hora_fin: "Hora de Fin",
    multi_dia: "¿Dura varios días?",
    fecha_inicio: "Día de inicio",
    fecha_fin: "Día de fin",

    espacio: "Espacio",
    personas: "Número aproximado de personas",
    externos: "¿Asiste gente externa?",
    discapacidad: "¿Asisten personas con discapacidad?",

    descripcion: "Descripción",
    observaciones: "Observaciones",

    materiales: "Materiales",
    personificadores: "Personificadores",
    sonido: "Sonido",
    humanos: "Apoyo humano",

    fecha_aprobacion: "Fecha de aprobación",
    fecha_llenado: "Fecha de llenado",
  };

  const columnasNoEditables = ["correo"];
  const columnasNumericas = ["personas"];

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("NO HAY USUARIO LOGUEADO");
      return;
    }

    try {
      const ref = doc(db, "admins", user.email);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("No tienes permisos de administrador");
        return;
      }

      init();
    } catch (err) {
      console.error("Error validando admin:", err.message);
      await signOut(auth);
      window.location.href = "login.html";
    }
  });

  function init() {
    cargarSolicitudes();
    initConfig();
    initLogout();
    initBuscador();
  }

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

      renderTabla(dataGlobal);
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
      alert("Error cargando solicitudes");
    }
  }

  function formatearNombre(key) {
    const nombres = {
      laptop: "Laptop",
      proyector: "Proyector",
      extensiones: "Extensiones",
      sonido_movil: "Sonido móvil",
      mamparas: "Mamparas",
    };

    // Si el valor es "on" o "true" pero no está en la lista de materiales, devuelve un valor vacío
    return nombres[key] || "";
  }

  function renderTabla(data) {
    tbody.innerHTML = "";
    thead.innerHTML = "";

    if (!data || data.length === 0) {
      thead.innerHTML = `<tr><th>No hay datos</th></tr>`;
      return;
    }

    const columnasOrdenadas = [
      "nombre_evento",
      "responsable",
      "cargo_responsable",
      "unidad",
      "correo",
      "telefono",
      "fecha_evento",
      "hora_inicio",
      "hora_fin",
      "multi_dia",
      "fecha_inicio",
      "fecha_fin",
      "espacio",
      "personas",
      "externos",
      "discapacidad",
      "descripcion",
      "observaciones",
      "materiales",
      "humanos",
      "personificadores",
      "sonido",
      "fecha_aprobacion",
      "fecha_llenado",
    ];

    const columnas = columnasOrdenadas.filter((c) => c in data[0]);

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
          td.innerHTML = `<span class="prioridad ${prioridad.clase}">${prioridad.texto}</span>`;
          tr.appendChild(td);
          return;
        }

        let valor = row[col];

        if (valor === null || valor === undefined) {
          td.innerHTML = `<span class="empty">—</span>`;
        } else if (Array.isArray(valor)) {
          td.textContent = valor.join(", ");
        } else if (typeof valor === "boolean") {
          td.textContent = valor ? "Sí" : "No";
        } else if (col === "humanos" && Array.isArray(valor)) {
          td.innerHTML = valor.length
            ? valor.map((v) => `<span class="tag">${v}</span>`).join("")
            : `<span class="empty">—</span>`;
        } else if (col === "materiales") {
          if (typeof valor === "object") {
            const activos = Object.entries(valor)
              .filter(([_, v]) => v === true) // solo seleccionamos los elementos "marcados"
              .map(([k]) => formatearNombre(k)) // aplica "nombre bonito"
              .filter((v) => v !== "" && v !== "on"); // eliminamos cualquier valor "on" o vacío

            td.innerHTML = activos.length
              ? activos
                  .map((v) => `<span class="tag material">${v}</span>`)
                  .join(", ") // unimos los materiales seleccionados por coma
              : `<span class="empty">No requerido</span>`; // si no hay materiales, mostramos esto
          }
        } else if (col === "personificadores") {
          if (valor?.activo) {
            td.innerHTML = `<span class="tag highlight">${valor.cantidad} Personificadores</span>`;
          } else {
            td.innerHTML = `<span class="empty">No requerido</span>`;
          }
        } else if (col === "sonido") {
          if (valor?.activo) {
            let items = [];

            if (valor.bocina) items.push("Bocina");
            if (valor.microfonos > 0)
              items.push(`${valor.microfonos} micrófonos`);

            td.innerHTML = items.length
              ? items.map((i) => `<span class="tag sound">${i}</span>`).join("")
              : `<span class="tag sound">Audio básico</span>`;
          } else {
            td.innerHTML = `<span class="empty">No requerido</span>`;
          }
        } else {
          td.textContent = valor;
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

          setTimeout(() => (td.style.backgroundColor = ""), 800);
        });

        tr.appendChild(td);
      });

      const acciones = document.createElement("td");
      const btnDelete = document.createElement("button");

      btnDelete.textContent = "Eliminar";
      btnDelete.classList.add("action-btn", "delete-btn");

      btnDelete.onclick = async () => {
        if (!confirm("¿Eliminar solicitud?")) return;

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

  function initBuscador() {
    const input = document.getElementById("buscador");

    input.addEventListener("input", () => {
      const texto = input.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const filtrado = dataGlobal.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(texto),
        ),
      );

      renderTabla(filtrado);
    });
  }

  function initConfig() {
    const toggle = document.getElementById("toggleForm");
    const ref = doc(db, "config", "formulario");

    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        toggle.checked = snap.data().habilitado;
      }
    });

    toggle.addEventListener("change", async () => {
      try {
        await setDoc(ref, { habilitado: toggle.checked });
      } catch (err) {
        console.error(err);
        alert("Error guardando configuración");
      }
    });
  }

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
});
