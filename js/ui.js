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
    case "select": {
      input = document.createElement("select");
      campo.opciones.forEach((op) => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        input.appendChild(option);
      });
      input.id = campo.id;
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
        const val = input.classList.contains("active") ? "true" : "false";
        input.dataset.value = val;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      break;
    }

    case "multiselect": {
      input = document.createElement("div");
      input.id = campo.id;

      campo.opciones.forEach((op, i) => {
        const wrap = document.createElement("label");
        wrap.style.display = "flex";
        wrap.style.alignItems = "center";
        wrap.style.gap = "8px";
        wrap.style.marginBottom = "6px";
        wrap.style.cursor = "pointer";

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = op;
        chk.name = campo.id;
        chk.id = `${campo.id}_${i}`;

        const span = document.createElement("span");
        span.textContent = op;

        wrap.appendChild(chk);
        wrap.appendChild(span);

        input.appendChild(wrap);
      });

      input.getValores = () => {
        return Array.from(input.querySelectorAll("input:checked")).map(
          (chk) => chk.value,
        );
      };

      break;
    }

    case "recurso_sonido": {
      input = document.createElement("div");
      input.id = campo.id;

      const wrapPrincipal = document.createElement("label");
      wrapPrincipal.style.display = "flex";
      wrapPrincipal.style.alignItems = "center";
      wrapPrincipal.style.gap = "8px";
      wrapPrincipal.style.cursor = "pointer";

      const chkSonido = document.createElement("input");
      chkSonido.type = "checkbox";

      const title = document.createElement("strong");
      title.textContent = "Sonido";

      wrapPrincipal.appendChild(chkSonido);
      wrapPrincipal.appendChild(title);

      const contSonido = document.createElement("div");
      contSonido.style.marginLeft = "20px";
      contSonido.style.display = "none";

      // Micro
      const microWrap = document.createElement("label");
      microWrap.style.display = "flex";
      microWrap.style.alignItems = "center";
      microWrap.style.gap = "8px";

      const chkMicro = document.createElement("input");
      chkMicro.type = "checkbox";

      const txtMicro = document.createElement("span");
      txtMicro.textContent = "Micrófonos";

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

      microWrap.appendChild(chkMicro);
      microWrap.appendChild(txtMicro);
      microWrap.appendChild(inputMicro);

      // Bocina
      const bocinaWrap = document.createElement("label");
      bocinaWrap.style.display = "flex";
      bocinaWrap.style.alignItems = "center";
      bocinaWrap.style.gap = "8px";

      const chkBocina = document.createElement("input");
      chkBocina.type = "checkbox";

      const txtBocina = document.createElement("span");
      txtBocina.textContent = "Bocina";

      bocinaWrap.appendChild(chkBocina);
      bocinaWrap.appendChild(txtBocina);

      chkSonido.addEventListener("change", () => {
        contSonido.style.display = chkSonido.checked ? "block" : "none";
      });

      contSonido.appendChild(microWrap);
      contSonido.appendChild(bocinaWrap);

      input.appendChild(wrapPrincipal);
      input.appendChild(contSonido);

      input.getValores = () => ({
        activo: chkSonido.checked,
        microfonos: chkMicro.checked ? parseInt(inputMicro.value) || 0 : 0,
        bocina: chkBocina.checked,
      });

      break;
    }

    case "personificadores_custom": {
      input = document.createElement("div");
      input.id = campo.id;

      const wrap = document.createElement("label");
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.gap = "8px";
      wrap.style.cursor = "pointer";

      const chk = document.createElement("input");
      chk.type = "checkbox";

      const txt = document.createElement("span");
      txt.textContent = "Personificadores";

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

      wrap.appendChild(chk);
      wrap.appendChild(txt);
      wrap.appendChild(num);

      input.appendChild(wrap);

      input.getValores = () => ({
        activo: chk.checked,
        cantidad: chk.checked ? parseInt(num.value) || 0 : 0,
      });

      break;
    }

    case "time_range": {
      input = document.createElement("div");
      input.id = campo.id;

      const titulo = document.createElement("div");
      titulo.textContent = campo.label;
      titulo.style.fontWeight = "bold";
      titulo.style.marginBottom = "6px";

      const contHorario = document.createElement("div");
      contHorario.style.display = "flex";
      contHorario.style.gap = "10px";

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

      contHorario.appendChild(crearHora("Hora inicio", campo.id + "_inicio"));
      contHorario.appendChild(crearHora("Hora fin", campo.id + "_fin"));

      input.appendChild(titulo);
      input.appendChild(contHorario);

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
