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

        // 🔥 ESTO DISPARA EL CAMBIO (clave para multi_dia)
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      break;

    case "multiselect":
      input = document.createElement("div");

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
      break;

    // 🔊 SONIDO COMPLETO
    case "recurso_sonido":
      input = document.createElement("div");

      const wrapSonido = document.createElement("div");
      wrapSonido.style.display = "flex";
      wrapSonido.style.alignItems = "center";
      wrapSonido.style.gap = "8px";

      const chkSonido = document.createElement("input");
      chkSonido.type = "checkbox";
      chkSonido.id = "sonido_check";

      const lblSonido = document.createElement("span");
      lblSonido.textContent = "Sonido";

      wrapSonido.appendChild(chkSonido);
      wrapSonido.appendChild(lblSonido);

      // 🔽 contenedor opciones
      const contOpciones = document.createElement("div");
      contOpciones.style.display = "none";
      contOpciones.style.marginLeft = "20px";

      // 🎤 MICRO
      const wrapMicro = document.createElement("div");
      wrapMicro.style.display = "flex";
      wrapMicro.style.alignItems = "center";
      wrapMicro.style.gap = "8px";

      const chkMicro = document.createElement("input");
      chkMicro.type = "checkbox";
      chkMicro.id = "micro_check";

      const lblMicro = document.createElement("span");
      lblMicro.textContent = "Micrófono";

      const inputMicro = document.createElement("input");
      inputMicro.type = "number";
      inputMicro.id = "cantidad_microfonos";
      inputMicro.min = 0;
      inputMicro.max = 2;
      inputMicro.value = 0;
      inputMicro.style.width = "60px";
      inputMicro.style.display = "none";

      wrapMicro.appendChild(chkMicro);
      wrapMicro.appendChild(lblMicro);
      wrapMicro.appendChild(inputMicro);

      // 🔊 BOCINA
      const wrapBocina = document.createElement("div");
      wrapBocina.style.display = "flex";
      wrapBocina.style.alignItems = "center";
      wrapBocina.style.gap = "8px";

      const chkBocina = document.createElement("input");
      chkBocina.type = "checkbox";
      chkBocina.id = "bocina";

      const lblBocina = document.createElement("span");
      lblBocina.textContent = "Bocina";

      wrapBocina.appendChild(chkBocina);
      wrapBocina.appendChild(lblBocina);

      // 🔹 EVENTOS
      chkSonido.addEventListener("change", () => {
        contOpciones.style.display = chkSonido.checked ? "block" : "none";
      });

      chkMicro.addEventListener("change", () => {
        inputMicro.style.display = chkMicro.checked ? "inline-block" : "none";
      });

      contOpciones.appendChild(wrapMicro);
      contOpciones.appendChild(wrapBocina);

      input.appendChild(wrapSonido);
      input.appendChild(contOpciones);

      break;

    // 👤 PERSONIFICADORES
    case "personificadores_custom":
      input = document.createElement("div");

      const wrapPers = document.createElement("div");
      wrapPers.style.display = "flex";
      wrapPers.style.alignItems = "center";
      wrapPers.style.gap = "8px";

      const chkPers = document.createElement("input");
      chkPers.type = "checkbox";
      chkPers.id = "personificadores_check";

      const lblPers = document.createElement("span");
      lblPers.textContent = "Personificadores";

      const inputPers = document.createElement("input");
      inputPers.type = "number";
      inputPers.id = "cantidad_personificadores";
      inputPers.min = 0;
      inputPers.max = 7;
      inputPers.value = 0;
      inputPers.style.width = "60px";
      inputPers.style.display = "none";

      chkPers.addEventListener("change", () => {
        inputPers.style.display = chkPers.checked ? "inline-block" : "none";
      });

      wrapPers.appendChild(chkPers);
      wrapPers.appendChild(lblPers);
      wrapPers.appendChild(inputPers);

      input.appendChild(wrapPers);

      break;

    case "time_range":
      input = document.createElement("div");

      const titulo = document.createElement("div");
      titulo.textContent = campo.label;
      titulo.style.fontWeight = "bold";
      titulo.style.marginBottom = "8px";

      const cont = document.createElement("div");
      cont.style.display = "flex";
      cont.style.gap = "10px";

      const crearHora = (texto, id) => {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.flex = "1";

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

      cont.appendChild(crearHora("Hora de inicio", campo.id + "_inicio"));
      cont.appendChild(crearHora("Hora de fin", campo.id + "_fin"));

      input.appendChild(titulo);
      input.appendChild(cont);

      break;

    default:
      input = document.createElement("input");
      input.type = campo.tipo;
  }

  if (input && !input.id) input.id = campo.id;

  if (label) div.appendChild(label);
  div.appendChild(input);

  // 🔥 DEPENDENCIAS (NUEVO)
  if (campo.dependsOn) {
    setTimeout(() => {
      const controlador = document.getElementById(campo.dependsOn);

      if (!controlador) return;

      const actualizar = () => {
        let activo;

        // switch
        if (controlador.classList.contains("switch")) {
          activo = controlador.dataset.value === "true";
        } else {
          activo = controlador.checked;
        }

        div.style.display = activo ? "block" : "none";
      };

      // escuchar cambios
      controlador.addEventListener("change", actualizar);

      // ejecutar al inicio
      actualizar();
    }, 0);
  }

  // DEPENDENCIAS (AQUÍ SE ARREGLA multi_dia)
  if (campo.dependsOn) {
    setTimeout(() => {
      const controlador = document.getElementById(campo.dependsOn);

      if (!controlador) return;

      const actualizar = () => {
        let activo;

        // detectar si es switch
        if (controlador.classList.contains("switch")) {
          activo = controlador.dataset.value === "true";
        } else {
          activo = controlador.checked;
        }

        div.style.display = activo ? "block" : "none";
      };

      controlador.addEventListener("change", actualizar);

      actualizar(); // importante
    }, 0);
  }

  return div;
}
