// js/ui.js

export function crearCampo(campo) {
  if (campo.tipo === "auto_time" || campo.tipo === "auto_date") return null;

  const div = document.createElement("div");
  div.classList.add("form-group");

  if (
    campo.tipo === "textarea" ||
    campo.id === "descripcion" ||
    campo.id === "observaciones"
  ) {
    div.classList.add("full");
  }

  let label = null;

  if (campo.label && campo.tipo !== "time_range") {
    label = document.createElement("label");
    label.textContent = campo.label;
  }

  let input;

  // =========================
  // 🔹 TIPOS
  // =========================
  switch (campo.tipo) {
    case "select": {
      input = document.createElement("select");
      input.id = campo.id;

      campo.opciones.forEach((op) => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        input.appendChild(option);
      });
      break;
    }

    case "textarea": {
      input = document.createElement("textarea");
      input.id = campo.id;
      break;
    }

    case "switch": {
      input = document.createElement("div");
      input.classList.add("switch");
      input.id = campo.id;
      input.dataset.value = "false";

      input.addEventListener("click", () => {
        input.classList.toggle("active");
        input.dataset.value = input.classList.contains("active")
          ? "true"
          : "false";
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      break;
    }

    // =========================
    // 🔥 MULTISELECT
    // =========================
    case "multiselect": {
      input = document.createElement("div");
      input.id = campo.id;
      input.classList.add("multi-group");

      campo.opciones.forEach((op, i) => {
        const row = document.createElement("label");

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = op;

        const span = document.createElement("span");
        span.textContent = op;

        row.appendChild(chk);
        row.appendChild(span);
        input.appendChild(row);
      });

      input.getValores = () =>
        Array.from(input.querySelectorAll("input:checked")).map(
          (chk) => chk.value,
        );

      break;
    }

    // =========================
    // 🔥 PERSONIFICADORES
    // =========================
    case "personificadores_custom": {
      input = document.createElement("div");
      input.classList.add("multi-group");

      const row = document.createElement("label");

      const chk = document.createElement("input");
      chk.type = "checkbox";

      const txt = document.createElement("span");
      txt.textContent = "Personificadores";

      const num = document.createElement("input");
      num.type = "number";
      num.min = 0;
      num.max = 7;
      num.value = 0;
      num.style.display = "none";

      chk.addEventListener("change", () => {
        num.style.display = chk.checked ? "inline-block" : "none";
      });

      row.appendChild(chk);
      row.appendChild(txt);
      row.appendChild(num);

      input.appendChild(row);

      input.getValores = () => ({
        activo: chk.checked,
        cantidad: chk.checked ? parseInt(num.value) || 0 : 0,
      });

      break;
    }

    // =========================
    // 🔥 MONTAJE DINÁMICO
    // =========================
    case "text": {
      input = document.createElement("input");
      input.type = "text";
      input.id = campo.id;

      if (campo.id === "montaje") {
        const selectExtra = document.createElement("select");
        selectExtra.style.display = "none";

        ["Tipo aula", "Tipo herradura", "Tipo auditorio"].forEach((op) => {
          const option = document.createElement("option");
          option.value = op;
          option.textContent = op;
          selectExtra.appendChild(option);
        });

        setTimeout(() => {
          const espacio = document.getElementById("espacio");
          if (!espacio) return;

          const actualizar = () => {
            const val = espacio.value;

            // 🔹 AUDITORIO
            if (val === "Auditorio") {
              div.style.display = "block";
              input.style.display = "block";
              selectExtra.style.display = "none";

              if (label)
                label.textContent = "Montaje (Número de curules a ocupar)";
            }

            // 🔹 SALA CONSEJO
            else if (val === "Sala de Consejo") {
              div.style.display = "block";
              input.style.display = "none";
              selectExtra.style.display = "block";

              if (label) label.textContent = "Montaje";
            }

            // 🔹 EXPLANADA (OCULTAR TODO)
            else if (val === "Explanada") {
              div.style.display = "none";
            } else {
              div.style.display = "none";
            }
          };

          espacio.addEventListener("change", actualizar);
          actualizar();
        }, 200);

        div.getValores = () =>
          selectExtra.style.display === "block"
            ? selectExtra.value
            : input.value;

        if (label) div.appendChild(label);
        div.appendChild(selectExtra);
        div.appendChild(input);

        return div;
      }

      break;
    }

    // =========================
    // 🔥 HORARIO
    // =========================
    case "time_range": {
      input = document.createElement("div");

      const titulo = document.createElement("div");
      titulo.textContent = campo.label;
      titulo.style.fontWeight = "bold";

      const cont = document.createElement("div");
      cont.classList.add("time-range");

      const crearHora = (texto, id) => {
        const box = document.createElement("div");

        const lbl = document.createElement("span");
        lbl.textContent = texto;

        const inp = document.createElement("input");
        inp.type = "time";
        inp.id = id;

        box.appendChild(lbl);
        box.appendChild(inp);
        return box;
      };

      cont.appendChild(crearHora("Inicio", campo.id + "_inicio"));
      cont.appendChild(crearHora("Fin", campo.id + "_fin"));

      input.appendChild(titulo);
      input.appendChild(cont);

      input.getValores = () => ({
        inicio: document.getElementById(campo.id + "_inicio")?.value || "",
        fin: document.getElementById(campo.id + "_fin")?.value || "",
      });

      break;
    }

    default: {
      input = document.createElement("input");
      input.type = campo.tipo;
      input.id = campo.id;
    }
  }

  if (label) div.appendChild(label);
  div.appendChild(input);

  // =========================
  // 🔥 VALIDACIÓN TIPO USUARIO
  // =========================
  if (campo.id === "cargo_admin" || campo.id === "unidad") {
    setTimeout(() => {
      const tipo = document.getElementById("acudio_dep"); // 👈 ajusta si tu id es otro
      if (!tipo) return;

      const actualizar = () => {
        const val = tipo.value;

        if (campo.id === "cargo_admin") {
          div.style.display = val === "Administrativo" ? "block" : "none";
        }

        if (campo.id === "unidad") {
          div.style.display =
            val === "Docente" || val === "Estudiante" ? "block" : "none";
        }
      };

      tipo.addEventListener("change", actualizar);
      actualizar();
    }, 200);
  }

  return div;
}
