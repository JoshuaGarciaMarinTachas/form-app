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

    case "recurso_sonido":
      input = document.createElement("div");

      // 🔹 Checkbox principal SONIDO
      const chkSonido = document.createElement("input");
      chkSonido.type = "checkbox";
      chkSonido.id = "sonido_check";

      const lblSonido = document.createElement("span");
      lblSonido.textContent = "Sonido";

      const wrapSonido = document.createElement("div");
      wrapSonido.appendChild(chkSonido);
      wrapSonido.appendChild(lblSonido);

      // 🔹 CONTENEDOR OPCIONES (micro + bocina)
      const contOpciones = document.createElement("div");
      contOpciones.style.display = "none";
      contOpciones.style.marginLeft = "20px";

      // 🎤 MICROFONO
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
      inputMicro.style.marginLeft = "10px";
      inputMicro.style.display = "none";

      const wrapMicro = document.createElement("div");
      wrapMicro.appendChild(chkMicro);
      wrapMicro.appendChild(lblMicro);
      wrapMicro.appendChild(inputMicro);

    case "personificadores_custom":
      input = document.createElement("div");

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
      inputPers.style.marginLeft = "10px";
      inputPers.style.display = "none";

      chkPers.addEventListener("change", () => {
        inputPers.style.display = chkPers.checked ? "inline-block" : "none";
      });

      input.appendChild(chkPers);
      input.appendChild(lblPers);
      input.appendChild(inputPers);
      break;

      // 🔹 Eventos
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

    case "time_range":
      input = document.createElement("div");

      // 🔹 Título en negrita
      const titulo = document.createElement("div");
      titulo.textContent = campo.label;
      titulo.style.fontWeight = "bold";
      titulo.style.marginBottom = "8px";

      // 🔹 Contenedor de horas
      const cont = document.createElement("div");
      cont.style.display = "flex";
      cont.style.gap = "10px";

      // 🔹 INICIO
      const contInicio = document.createElement("div");
      contInicio.style.display = "flex";
      contInicio.style.flexDirection = "column";
      contInicio.style.flex = "1";

      const lblInicio = document.createElement("span");
      lblInicio.textContent = "Hora de inicio";
      lblInicio.style.fontSize = "12px";

      const start = document.createElement("input");
      start.type = "time";
      start.id = campo.id + "_inicio";

      contInicio.appendChild(lblInicio);
      contInicio.appendChild(start);

      // 🔹 FIN
      const contFin = document.createElement("div");
      contFin.style.display = "flex";
      contFin.style.flexDirection = "column";
      contFin.style.flex = "1";

      const lblFin = document.createElement("span");
      lblFin.textContent = "Hora de fin";
      lblFin.style.fontSize = "12px";

      const end = document.createElement("input");
      end.type = "time";
      end.id = campo.id + "_fin";

      contFin.appendChild(lblFin);
      contFin.appendChild(end);

      cont.appendChild(contInicio);
      cont.appendChild(contFin);

      input.appendChild(titulo);
      input.appendChild(cont);

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
