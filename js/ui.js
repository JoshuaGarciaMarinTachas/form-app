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

  if (campo.tipo !== "textarea" && campo.tipo !== "time_range") {
    label = document.createElement("label");
    label.textContent = campo.label;
  }

  let input;

  switch (campo.tipo) {
    // 🔹 SELECT
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

    // 🔹 TEXTAREA
    case "textarea": {
      input = document.createElement("textarea");
      input.id = campo.id;
      break;
    }

    // 🔹 SWITCH
    case "switch": {
      input = document.createElement("div");
      input.classList.add("switch");
      input.id = campo.id;

      input.dataset.value = "false";

      input.addEventListener("click", () => {
        input.classList.toggle("active");
        const val = input.classList.contains("active") ? "true" : "false";
        input.dataset.value = val;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      break;
    }

    // 🔥 MULTISELECT ORDENADO
    case "multiselect": {
      input = document.createElement("div");
      input.id = campo.id;

      campo.opciones.forEach((op, i) => {
        const row = document.createElement("label");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "space-between";
        row.style.marginBottom = "6px";
        row.style.cursor = "pointer";

        const left = document.createElement("div");
        left.style.display = "flex";
        left.style.alignItems = "center";
        left.style.gap = "8px";

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = op;
        chk.name = campo.id;
        chk.id = `${campo.id}_${i}`;

        const span = document.createElement("span");
        span.textContent = op;

        left.appendChild(chk);
        left.appendChild(span);

        row.appendChild(left);

        input.appendChild(row);
      });

      input.getValores = () =>
        Array.from(input.querySelectorAll("input:checked")).map(
          (chk) => chk.value,
        );

      break;
    }

    // 🔥 SONIDO (ALINEADO PRO)
    case "recurso_sonido": {
      input = document.createElement("div");
      input.id = campo.id;

      const main = document.createElement("label");
      main.style.display = "flex";
      main.style.alignItems = "center";
      main.style.gap = "8px";
      main.style.cursor = "pointer";

      const chkSonido = document.createElement("input");
      chkSonido.type = "checkbox";

      const title = document.createElement("strong");
      title.textContent = "Sonido";

      main.appendChild(chkSonido);
      main.appendChild(title);

      const cont = document.createElement("div");
      cont.style.marginLeft = "20px";
      cont.style.display = "none";

      // 🔹 MICRO
      const microRow = document.createElement("label");
      microRow.style.display = "flex";
      microRow.style.alignItems = "center";
      microRow.style.justifyContent = "space-between";
      microRow.style.marginBottom = "6px";
      microRow.style.cursor = "pointer";

      const leftMicro = document.createElement("div");
      leftMicro.style.display = "flex";
      leftMicro.style.alignItems = "center";
      leftMicro.style.gap = "8px";

      const chkMicro = document.createElement("input");
      chkMicro.type = "checkbox";

      const txtMicro = document.createElement("span");
      txtMicro.textContent = "Micrófonos";

      leftMicro.appendChild(chkMicro);
      leftMicro.appendChild(txtMicro);

      const inputMicro = document.createElement("input");
      inputMicro.type = "number";
      inputMicro.min = 0;
      inputMicro.max = 2;
      inputMicro.value = 0;
      inputMicro.style.width = "60px";
      inputMicro.style.display = "none";

      chkMicro.addEventListener("change", () => {
        inputMicro.style.display = chkMicro.checked ? "inline-block" : "none";
      });

      microRow.appendChild(leftMicro);
      microRow.appendChild(inputMicro);

      // 🔹 BOCINA
      const bocinaRow = document.createElement("label");
      bocinaRow.style.display = "flex";
      bocinaRow.style.alignItems = "center";
      bocinaRow.style.gap = "8px";
      bocinaRow.style.cursor = "pointer";

      const chkBocina = document.createElement("input");
      chkBocina.type = "checkbox";

      const txtBocina = document.createElement("span");
      txtBocina.textContent = "Bocina";

      bocinaRow.appendChild(chkBocina);
      bocinaRow.appendChild(txtBocina);

      chkSonido.addEventListener("change", () => {
        cont.style.display = chkSonido.checked ? "block" : "none";
      });

      cont.appendChild(microRow);
      cont.appendChild(bocinaRow);

      input.appendChild(main);
      input.appendChild(cont);

      input.getValores = () => ({
        activo: chkSonido.checked,
        microfonos: chkMicro.checked ? parseInt(inputMicro.value) || 0 : 0,
        bocina: chkBocina.checked,
      });

      break;
    }

    // 🔥 PERSONIFICADORES
    case "personificadores_custom": {
      input = document.createElement("div");
      input.id = campo.id;

      const row = document.createElement("label");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.cursor = "pointer";

      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.alignItems = "center";
      left.style.gap = "8px";

      const chk = document.createElement("input");
      chk.type = "checkbox";

      const txt = document.createElement("span");
      txt.textContent = "Personificadores";

      left.appendChild(chk);
      left.appendChild(txt);

      const num = document.createElement("input");
      num.type = "number";
      num.min = 0;
      num.max = 7;
      num.value = 0;
      num.style.width = "60px";
      num.style.display = "none";

      chk.addEventListener("change", () => {
        num.style.display = chk.checked ? "inline-block" : "none";
      });

      row.appendChild(left);
      row.appendChild(num);

      input.appendChild(row);

      input.getValores = () => ({
        activo: chk.checked,
        cantidad: chk.checked ? parseInt(num.value) || 0 : 0,
      });

      break;
    }

    // 🔥 HORARIO
    case "time_range": {
      input = document.createElement("div");
      input.id = campo.id;

      const titulo = document.createElement("div");
      titulo.textContent = campo.label;
      titulo.style.fontWeight = "bold";
      titulo.style.marginBottom = "6px";

      const cont = document.createElement("div");
      cont.style.display = "flex";
      cont.style.gap = "10px";

      const crearHora = (texto, id) => {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "column";

        const lbl = document.createElement("span");
        lbl.textContent = texto;
        lbl.style.fontSize = "12px";

        const inp = document.createElement("input");
        inp.type = "time";
        inp.id = id;

        box.appendChild(lbl);
        box.appendChild(inp);

        return box;
      };

      cont.appendChild(crearHora("Hora inicio", campo.id + "_inicio"));
      cont.appendChild(crearHora("Hora fin", campo.id + "_fin"));

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

  // 🔥 DEPENDENCIAS
  if (campo.dependsOn) {
    setTimeout(() => {
      const config = campo.dependsOn;
      const controladorId = typeof config === "string" ? config : config.campo;

      const controlador = document.getElementById(controladorId);
      if (!controlador) return;

      const obtenerValor = () => {
        if (controlador.classList.contains("switch")) {
          return controlador.dataset.value === "true";
        }
        return controlador.value;
      };

      const actualizar = () => {
        const valor = obtenerValor();
        let visible = false;

        if (typeof config === "string") {
          visible = !!valor;
        } else {
          if ("valor" in config) visible = valor == config.valor;
          if ("valores" in config) visible = config.valores.includes(valor);
        }

        div.style.display = visible ? "block" : "none";
      };

      controlador.addEventListener("change", actualizar);
      actualizar();
    }, 150);
  }

  return div;
}
