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

    // 🔥 MULTISELECT LIMPIO (SIN estilos inline conflictivos)
    case "multiselect": {
      input = document.createElement("div");
      input.id = campo.id;
      input.classList.add("multi-group");

      campo.opciones.forEach((op, i) => {
        const labelRow = document.createElement("label");

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = op;
        chk.name = campo.id;
        chk.id = `${campo.id}_${i}`;

        const span = document.createElement("span");
        span.textContent = op;

        labelRow.appendChild(chk);
        labelRow.appendChild(span);

        input.appendChild(labelRow);
      });

      input.getValores = () =>
        Array.from(input.querySelectorAll("input:checked")).map(
          (chk) => chk.value,
        );

      break;
    }

    // 🔥 SONIDO (ESTRUCTURA LIMPIA)
    case "recurso_sonido": {
      input = document.createElement("div");
      input.id = campo.id;

      const principal = document.createElement("label");
      principal.classList.add("multi-group");

      const chkSonido = document.createElement("input");
      chkSonido.type = "checkbox";

      const title = document.createElement("span");
      title.textContent = "Sonido";

      principal.appendChild(chkSonido);
      principal.appendChild(title);

      const sub = document.createElement("div");
      sub.classList.add("sub-opciones");
      sub.style.display = "none";

      // 🔹 MICRO
      const micro = document.createElement("label");

      const chkMicro = document.createElement("input");
      chkMicro.type = "checkbox";

      const txtMicro = document.createElement("span");
      txtMicro.textContent = "Micrófonos";

      const numMicro = document.createElement("input");
      numMicro.type = "number";
      numMicro.min = 0;
      numMicro.max = 2;
      numMicro.value = 0;
      numMicro.style.display = "none";

      chkMicro.addEventListener("change", () => {
        numMicro.style.display = chkMicro.checked ? "inline-block" : "none";
      });

      micro.appendChild(chkMicro);
      micro.appendChild(txtMicro);
      micro.appendChild(numMicro);

      // 🔹 BOCINA
      const bocina = document.createElement("label");

      const chkBocina = document.createElement("input");
      chkBocina.type = "checkbox";

      const txtBocina = document.createElement("span");
      txtBocina.textContent = "Bocina";

      bocina.appendChild(chkBocina);
      bocina.appendChild(txtBocina);

      chkSonido.addEventListener("change", () => {
        sub.style.display = chkSonido.checked ? "block" : "none";
      });

      sub.appendChild(micro);
      sub.appendChild(bocina);

      input.appendChild(principal);
      input.appendChild(sub);

      input.getValores = () => ({
        activo: chkSonido.checked,
        microfonos: chkMicro.checked ? parseInt(numMicro.value) || 0 : 0,
        bocina: chkBocina.checked,
      });

      break;
    }

    // 🔥 PERSONIFICADORES
    case "personificadores_custom": {
      input = document.createElement("div");
      input.id = campo.id;

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

    // 🔥 HORARIO
    case "time_range": {
      input = document.createElement("div");
      input.id = campo.id;

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
