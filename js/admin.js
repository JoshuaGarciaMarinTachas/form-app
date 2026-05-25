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

  // CORREGIDO
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
    "montaje",
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

    fechas_evento: "Fechas del evento",
    horarios_evento: "Horarios",
    fecha_evento: "Fecha del evento",
    hora_inicio: "Hora de inicio",
    hora_fin: "Hora de Fin",
    multi_dia: "¿Dura varios días?",
    fecha_inicio: "Día de inicio",
    fecha_fin: "Día de fin",

    espacio: "Espacio",
    montaje: "Montaje",
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
          const fechaA = a.fechas_evento?.split("\n")[0] || "";
          const fechaB = b.fechas_evento?.split("\n")[0] || "";
          return fechaA.localeCompare(fechaB);
        });

      console.log("Datos cargados:", dataGlobal); // Agregado para depurar

      try {
        renderTabla(dataGlobal);
      } catch (err) {
        console.error("Error al renderizar la tabla:", err);
      }
      // Activar botón si hay datos
      const btnDescargar = document.getElementById("btnDescargar");
      if (btnDescargar) {
        btnDescargar.disabled = dataGlobal.length === 0;
      }
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

  function obtenerPrioridad(fechaEvento) {
    // Si fecha es pasada, alta, sino media (ejemplo simple)
    if (!fechaEvento) return { texto: "Sin fecha", clase: "media" };
    const hoy = new Date();
    const fecha = new Date(fechaEvento);
    if (fecha < hoy) return { texto: "Alta", clase: "alta" };
    return { texto: "Media", clase: "media" };
  }

  function limpiarValores(arr) {
    return arr.filter((v) => v && v !== "on" && v !== true && v !== false);
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

      "fechas_evento", // 👈 NUEVO
      "horarios_evento", // 👈 NUEVO

      "multi_dia",
      "espacio",
      "montaje",
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

    const columnas = columnasOrdenadas.filter((c) =>
      data[0]?.hasOwnProperty(c),
    );

    thead.innerHTML =
      "<tr>" +
      columnas.map((c) => `<th>${nombresBonitos[c] || c}</th>`).join("") +
      "<th>Acciones</th></tr>";

    data.forEach((row) => {
      try {
        const tr = document.createElement("tr");

        columnas.forEach((col) => {
          const td = document.createElement("td");
          td.style.textAlign = "center"; // centrado opcional

          let valor = row[col];

          // Limpia arrays de "on", true, false
          if (Array.isArray(valor)) {
            const limpio = limpiarValores(valor);
            td.textContent = limpio.length ? limpio.join(", ") : "—";
          }
          // Booleanos
          else if (typeof valor === "boolean") {
            td.textContent = valor ? "Sí" : "No";
          }
          // Humanos (tags)
          else if (col === "humanos" && Array.isArray(valor)) {
            const limpio = limpiarValores(valor);
            td.innerHTML = limpio.length
              ? limpio.map((v) => `<span class="tag">${v}</span>`).join("")
              : `<span class="empty">—</span>`;
          }
          // Materiales
          else if (col === "materiales") {
            if (valor && typeof valor === "object" && !Array.isArray(valor)) {
              const activos = Object.entries(valor)
                .filter(([_, v]) => v && v !== "on" && v !== false)
                .map(([k]) => formatearNombre(k))
                .filter(Boolean);
              td.innerHTML = activos.length
                ? activos
                    .map((v) => `<span class="tag material">${v}</span>`)
                    .join(", ")
                : `<span class="empty">No requerido</span>`;
            }
          }
          // Personificadores
          else if (col === "personificadores") {
            td.innerHTML = valor?.activo
              ? `<span class="tag highlight">${valor.cantidad} Personificadores</span>`
              : `<span class="empty">No requerido</span>`;
          }
          // Sonido
          else if (col === "sonido") {
            if (valor?.activo) {
              const items = [];
              if (valor.bocina) items.push("Bocina");
              if (valor.microfonos > 0)
                items.push(`${valor.microfonos} micrófonos`);
              td.innerHTML = items.length
                ? items
                    .map((i) => `<span class="tag sound">${i}</span>`)
                    .join(", ")
                : `<span class="tag sound">Audio básico</span>`;
            } else {
              td.innerHTML = `<span class="empty">No requerido</span>`;
            }
          }
          // Horarios o fechas
          else if (col === "horarios_evento" || col === "fechas_evento") {
            td.innerHTML = `<div class="horarios-cell">${valor?.replace(/\n/g, "<br>") || "—"}</div>`;
          }
          // Otros objetos
          else if (typeof valor === "object" && valor !== null) {
            td.textContent = "";
          }
          // Texto normal
          else {
            td.textContent = valor ?? "—";
          }

          td.contentEditable = !columnasNoEditables.includes(col);

          let valorOriginal = td.textContent;
          td.addEventListener("focus", () => (valorOriginal = td.textContent));

          td.addEventListener("blur", async () => {
            if (columnasNoEditables.includes(col)) return;
            if (td.textContent === valorOriginal) return;

            let nuevoValor = td.textContent.trim();
            if (nuevoValor === "") {
              td.textContent = valorOriginal;
              return;
            }

            if (nuevoValor.toLowerCase() === "sí") nuevoValor = true;
            else if (nuevoValor.toLowerCase() === "no") nuevoValor = false;
            else if (columnasNumericas.includes(col) && !isNaN(nuevoValor))
              nuevoValor = Number(nuevoValor);

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

        // --- Celda de acciones ---
        const acciones = document.createElement("td");

        // Botón Eliminar
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

        // Botón Generar Word
        const btnWordFila = document.createElement("button");
        btnWordFila.textContent = "Generar Word";
        btnWordFila.classList.add("action-btn", "word-btn"); // CSS en tu archivo
        btnWordFila.onclick = async () => {
          try {
            const evento = row;

            // ===== FECHA ACTUAL =====
            const fechaActual = new Date().toLocaleString("es-MX");

            // ===== CATEGORÍA =====
            const categoria = evento.administrativo
              ? "Administrativo"
              : "Estudiante";

            // ===== UNIDAD O CARGO =====
            const unidadCargo =
              evento.unidad?.trim() ||
              evento.cargo_responsable?.trim() ||
              "No especificado";

            // ===== LIMPIAR MATERIALES =====
            const nombresMateriales = {
              laptop: "Laptop",
              proyector: "Videoproyector",
              extensiones: "Extensiones",
              sonido_movil: "Sonido móvil",
              mamparas: "Mamparas",
            };

            let materiales = [];

            const traducirMaterial = {
              laptop: "Laptop",
              proyector: "Videoproyector",
              extensiones: "Extensiones",
              sonido_movil: "Sonido móvil",
              mamparas: "Mamparas",
            };

            // ===== SI ES ARRAY =====
            if (Array.isArray(evento.materiales)) {
              materiales = evento.materiales
                .filter((v) => v && v !== "on" && v !== true && v !== false)
                .map((v) => traducirMaterial[v] || v);
            }

            // ===== SI ES OBJETO =====
            else if (
              typeof evento.materiales === "object" &&
              evento.materiales !== null
            ) {
              materiales = Object.entries(evento.materiales)
                .filter(([_, v]) => v && v !== "off" && v !== false)
                .map(([k]) => traducirMaterial[k] || k);
            }

            // ===== HUMANOS =====
            let humanos = [];

            if (Array.isArray(evento.humanos)) {
              humanos = evento.humanos.filter((v) => v && v !== "on");
            }

            // ===== RECURSOS =====
            // ===== TODOS LOS RECURSOS =====
            let recursosTotales = [];

            // ===== MATERIALES =====
            recursosTotales.push(...materiales);

            // ===== HUMANOS =====
            recursosTotales.push(...humanos);

            // ===== SONIDO =====
            if (evento.sonido?.activo) {
              if (evento.sonido.bocina) {
                recursosTotales.push("Bocina");
              }

              if (evento.sonido.microfonos > 0) {
                recursosTotales.push(`${evento.sonido.microfonos} micrófonos`);
              }
            }

            // ===== PERSONIFICADORES =====
            if (
              evento.personificadores?.activo &&
              evento.personificadores.cantidad > 0
            ) {
              recursosTotales.push(
                `${evento.personificadores.cantidad} personificadores`,
              );
            }

            // ===== TIPO DE MONTAJE =====
            const tipoMontaje = evento.montaje?.trim()
              ? ` (${evento.montaje})`
              : "";

            // ===== LIMPIAR =====
            recursosTotales = recursosTotales
              .filter((v) => v && v !== "on" && v !== "No requerido")
              .join(", ");

            // ===== DATOS FINALES =====
            const datosEvento = {
              fecha_actual: fechaActual,

              nombre_evento: evento.nombre_evento || "No especificado",

              fecha_aprobacion: evento.fecha_aprobacion || "No especificada",

              fecha_evento: evento.fecha_evento || "No especificada",

              hora_inicio: evento.hora_inicio || "--",

              hora_fin: evento.hora_fin || "--",

              responsable: evento.responsable || "No especificado",

              categoria: categoria,

              telefono: evento.telefono || "No especificado",

              correo: evento.correo || "No especificado",

              unidad_cargo: unidadCargo,

              espacio: (evento.espacio || "No especificado") + tipoMontaje,

              personas: evento.personas || "0",

              montaje: evento.montaje || "No requerido",

              descripcion: evento.descripcion || "Sin descripción",

              observaciones: evento.observaciones || "Sin observaciones",

              recursos_totales: recursosTotales || "Ninguno",
            };

            // ===== CARGAR TEMPLATE =====
            const response = await fetch("./js/Departamento de eventos.docx");

            const arrayBuffer = await response.arrayBuffer();

            const zip = new PizZip(arrayBuffer);

            const doc = new window.docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true,
            });

            // ===== PASAR DATOS =====
            doc.setData(datosEvento);

            // ===== RENDER =====
            doc.render();

            // ===== GENERAR ARCHIVO =====
            const out = doc.getZip().generate({
              type: "blob",
            });

            saveAs(out, `evento_${evento.nombre_evento}.docx`);
          } catch (err) {
            console.error("Error generando Word:", err);
            alert("Ocurrió un error al generar el Word");
          }
        };

        acciones.appendChild(btnWordFila);
        tr.appendChild(acciones);

        tbody.appendChild(tr);
      } catch (err) {
        console.error("Error renderizando fila:", row, err);
      }
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
  // ===== BOTÓN DESCARGAR EXCEL =====
  const btnDescargar = document.getElementById("btnDescargar");

  if (btnDescargar) {
    btnDescargar.disabled = true;

    btnDescargar.addEventListener("click", () => {
      try {
        if (!dataGlobal.length) {
          alert("No hay datos para exportar");
          return;
        }

        const datosExcel = dataGlobal.map((item) => {
          const fila = {};
          const columnasExcel = [
            "nombre_evento",
            "responsable",
            "cargo_responsable",
            "unidad",
            "correo",
            "telefono",
            "fechas_evento",
            "horarios_evento",
            "multi_dia",
            "espacio",
            "montaje",
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

          columnasExcel.forEach((key) => {
            let valor = item[key];

            // Booleanos
            if (typeof valor === "boolean") {
              valor = valor ? "Sí" : "No";
            }
            // Arrays (humanos u otros) → limpiar "on", true, false
            else if (Array.isArray(valor)) {
              const limpio = limpiarValores(valor);
              valor = limpio.length ? limpio.join(", ") : "";
            }
            // Materiales (objeto)
            else if (
              key === "materiales" &&
              valor &&
              typeof valor === "object" &&
              !Array.isArray(valor)
            ) {
              const activos = Object.entries(valor)
                .filter(([_, v]) => v && v !== "on" && v !== false)
                .map(([k]) => formatearNombre(k))
                .filter(Boolean);
              valor = activos.length ? activos.join(", ") : "";
            }
            // Personificadores
            else if (key === "personificadores") {
              if (valor?.activo) {
                valor = `${valor.cantidad} personificadores`;
              } else {
                valor = "";
              }
            }
            // Sonido
            else if (key === "sonido") {
              if (valor?.activo) {
                const items = [];
                if (valor.bocina) items.push("Bocina");
                if (valor.microfonos > 0)
                  items.push(`${valor.microfonos} micrófonos`);
                valor = items.length ? items.join(", ") : "Audio básico";
              } else {
                valor = "";
              }
            }
            // Otros objetos
            else if (typeof valor === "object" && valor !== null) {
              valor = "";
            }

            // Fechas y horarios → si vienen separados por salto de línea, unir con coma
            if (
              typeof valor === "string" &&
              (key === "fechas_evento" || key === "horarios_evento")
            ) {
              valor = valor.replace(/\n/g, ", ");
            }

            fila[nombresBonitos[key] || key] = valor ?? "";
          });

          return fila;
        });

        const worksheet = XLSX.utils.json_to_sheet(datosExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Eventos");
        XLSX.writeFile(workbook, "eventos.xlsx");
      } catch (error) {
        console.error("Error al exportar:", error);
        alert("Error al generar el Excel");
      }
    });
  }
});
