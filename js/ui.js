// js/ui.js

export function crearCampo(campo) {
  const div = document.createElement("div");
  div.classList.add("form-group");

  if (campo.tipo === "auto_time" || campo.tipo === "auto_date") return null;

  const label = document.createElement("label");
  label.textContent = campo.label;

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
      input = document.createElement("input");
      input.type = "checkbox";
      input.classList.add("switch");
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

      const end = document.createElement("input");
      end.type = "time";

      input.appendChild(start);
      input.appendChild(end);
      break;

    default:
      input = document.createElement("input");
      input.type = campo.tipo;
  }

  input.id = campo.id;

  div.appendChild(label);
  div.appendChild(input);

  return div;
}
