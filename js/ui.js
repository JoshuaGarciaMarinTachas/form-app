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

  if (campo.oculto) {
    div.style.display = "none";
  }

  let label = null;

  if (campo.tipo !== "textarea" && campo.tipo !== "time_range") {
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
      input.id = campo.id;
      break;

    case "textarea":
      input = document.createElement("textarea");
      input.id = campo.id;
      break;

    case "switch":
      input = document.createElement("div");
      input.classList.add("switch");
      input.id = campo.id;

      input.dataset.value = "false";
      input.value = "false";

      input.addEventListener("click", () => {
        input.classList.toggle("active");
        const val = input.classList.contains("active") ? "true" : "false";

        input.dataset.value = val;
        input.value = val;

        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      break;

    case "multiselect":
      input = document.createElement("div");
      input.id = campo.id;

      campo.opciones.forEach((op) => {
        const wrap = document.createElement("div");

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = op;
        chk.name = campo.id;

        const lbl = document.createElement("span");
        lbl.textContent = op;

        wrap.appendChild(chk);
        wrap.appendChild(lbl);
        input.appendChild(wrap);
      });

      input.getValores = () => {
        return Array.from(input.querySelectorAll("input:checked")).map(
          (chk) => chk.value,
        );
      };
      break;

    case "recurso_sonido":
      input = document.createElement("div");
      input.id = campo.id;

      const chkSonido = document.createElement("input");
      chkSonido.type = "checkbox";

      const contOpciones = document.createElement("div");
      contOpciones.style.display = "none";
      contOpciones.style.marginLeft = "20px";

      const chkMicro = document.createElement("input");
      chkMicro.type = "checkbox";

      const inputMicro = document.createElement("input");
      inputMicro.type = "number";
      inputMicro.min = 0;
      inputMicro.max = 2;
      inputMicro.value = 0;
      inputMicro.style.display = "none";

      const chkBocina = document.createElement("input");
      chkBocina.type = "checkbox";

      chkSonido.addEventListener("change", () => {
        contOpciones.style.display = chkSonido.checked ? "block" : "none";
      });

      chkMicro.addEventListener("change", () => {
        inputMicro.style.display = chkMicro.checked ? "inline-block" : "none";
      });

      contOpciones.appendChild(chkMicro);
      contOpciones.appendChild(inputMicro);
      contOpciones.appendChild(chkBocina);

      input.appendChild(chkSonido);
      input.appendChild(contOpciones);

      input.getValores = () => ({
        sonido: chkSonido.checked,
        microfono: chkMicro.checked,
        cantidad_microfonos: inputMicro.value,
        bocina: chkBocina.checked,
      });
      break;

    case "personificadores_custom":
      input = document.createElement("div");
      input.id = campo.id;

      const chkPers = document.createElement("input");
      chkPers.type = "checkbox";

      const inputPers = document.createElement("input");
      inputPers.type = "number";
      inputPers.min = 0;
      inputPers.max = 7;
      inputPers.value = 0;
      inputPers.style.display = "none";

      chkPers.addEventListener("change", () => {
        inputPers.style.display = chkPers.checked ? "inline-block" : "none";
      });

      input.appendChild(chkPers);
      input.appendChild(inputPers);

      input.getValores = () => ({
        activo: chkPers.checked,
        cantidad: inputPers.value,
      });
      break;

    case "time_range":
      input = document.createElement("div");
      input.id = campo.id;

      const cont = document.createElement("div");
      cont.style.display = "flex";
      cont.style.gap = "10px";

      const crearHora = (id) => {
        const inp = document.createElement("input");
        inp.type = "time";
        inp.id = id;
        return inp;
      };

      const inicio = crearHora(campo.id + "_inicio");
      const fin = crearHora(campo.id + "_fin");

      cont.appendChild(inicio);
      cont.appendChild(fin);

      input.appendChild(cont);

      input.getValores = () => ({
        inicio: inicio.value,
        fin: fin.value,
      });

      break;

    default:
      input = document.createElement("input");
      input.type = campo.tipo;
      input.id = campo.id;
  }

  if (label) div.appendChild(label);
  div.appendChild(input);

  // DEPENDENCIAS SEGURAS
  if (campo.dependsOn) {
    setTimeout(() => {
      const controlador = document.getElementById(campo.dependsOn);
      if (!controlador) return;

      const actualizar = () => {
        let activo = false;

        if (controlador.classList.contains("switch")) {
          activo = controlador.dataset.value === "true";
        } else if (controlador.type === "checkbox") {
          activo = controlador.checked;
        } else {
          activo = !!controlador.value;
        }

        div.style.display = activo ? "block" : "none";
      };

      controlador.addEventListener("change", actualizar);
      actualizar();
    }, 150);
  }

  return div;
}
