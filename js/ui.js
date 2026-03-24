// js/ui.js

export function crearCampo(campo) {
  // 🔹 AUTO no se renderiza
  if (campo.tipo === "auto_time" || campo.tipo === "auto_date") return null;

  const div = document.createElement("div");
  div.classList.add("form-group");

  // 🔥 Campos grandes ocupan todo el ancho
  if (
    campo.tipo === "textarea" ||
    campo.id === "descripcion" ||
    campo.id === "observaciones"
  ) {
    div.classList.add("full");
  }

  // 🔹 Oculto inicial
  if (campo.oculto) {
    div.style.display = "none";
  }

  let label = null;

  if (campo.tipo !== "textarea") {
    label = document.createElement("label");
    label.textContent = campo.label;
  }

  let input;

  switch (campo.tipo) {
    case "select":
      input = document.createElement("select");

      campo.opciones.forEach((op) => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        input.appendChild(option);
      });
      break;

    case "textarea":
      input = document.createElement("textarea");
      break;

    case "switch":
      input = document.createElement("div");
      input.classList.add("switch");
      input.dataset.value = "false";

      input.addEventListener("click", () => {
        input.classList.toggle("active");
        input.dataset.value = input.classList.contains("active")
          ? "true"
          : "false";

        // 🔥 DISPARAR EVENTO PERSONALIZADO (CLAVE)
        input.dispatchEvent(new Event("change"));
      });
      break;

    case "multiselect":
      input = document.createElement("div");

      campo.opciones.forEach((op) => {
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = op;
        chk.name = campo.id;

        const lbl = document.createElement("span");
        lbl.textContent = op;

        const wrap = document.createElement("div");
        wrap.appendChild(chk);
        wrap.appendChild(lbl);

        input.appendChild(wrap);
      });
      break;

    case "time_range":
      input = document.createElement("div");

      const start = document.createElement("input");
      start.type = "time";
      start.id = campo.id + "_inicio";

      const end = document.createElement("input");
      end.type = "time";
      end.id = campo.id + "_fin";

      input.appendChild(start);
      input.appendChild(end);
      break;

    default:
      input = document.createElement("input");
      input.type = campo.tipo;
      if (campo.id === "personificadores") {
        input.min = 0;
        input.max = 2;
        input.value = 0;
      }
  }

  // 🔴 IMPORTANTE: asignar ID SIEMPRE
  input.id = campo.id;

  if (label) div.appendChild(label);
  div.appendChild(input);

  // 🔥 ==============================
  // 🔥 DEPENDENCIAS (LO QUE FALTABA)
  // 🔥 ==============================

  // 🔹 dependsOn (ej: multi_dia)
  if (campo.dependsOn) {
    setTimeout(() => {
      const controlador = document.getElementById(campo.dependsOn);

      if (!controlador) return;

      const actualizar = () => {
        const activo = controlador.dataset.value === "true";
        div.style.display = activo ? "block" : "none";
      };

      controlador.addEventListener("change", actualizar);
      actualizar();
    }, 100);
  }

  // 🔹 dependsOnValue (ej: materiales → Sonido)
  if (campo.dependsOnValue) {
    setTimeout(() => {
      const { campo: campoControl, valor } = campo.dependsOnValue;

      const actualizar = () => {
        const seleccionados = [
          ...document.querySelectorAll(`input[name="${campoControl}"]:checked`),
        ].map((el) => el.value);

        const mostrar = seleccionados.includes(valor);
        div.style.display = mostrar ? "block" : "none";
      };

      document
        .querySelectorAll(`input[name="${campoControl}"]`)
        .forEach((chk) => {
          chk.addEventListener("change", actualizar);
        });

      actualizar();
    }, 100);
  }

  return div;
}
