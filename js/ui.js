// js/ui.js

export function crearCampo(campo) {
  if (
    campo.tipo === "auto_time" ||
    campo.tipo === "auto_date" ||
    campo.id === "fecha_inicio" ||
    campo.id === "fecha_fin"
  )
    return null;

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
      input = document.createElement("input");
      input.type = "checkbox";
      input.id = campo.id;
      input.classList.add("toggle-input");

      const toggleLabel = document.createElement("label");
      toggleLabel.setAttribute("for", campo.id);
      toggleLabel.classList.add("toggle-btn");

      const spanSi = document.createElement("span");
      spanSi.textContent = "Sí";

      const spanNo = document.createElement("span");
      spanNo.textContent = "No";

      toggleLabel.appendChild(spanSi);
      toggleLabel.appendChild(spanNo);

      //  IMPORTANTE: meter label visual al contenedor
      setTimeout(() => {
        if (div) div.appendChild(toggleLabel);
      }, 0);

      break;
    }

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

    case "recurso_sonido": {
      input = document.createElement("div");
      input.id = campo.id;
      input.classList.add("multi-group");

      // Sonido
      const main = document.createElement("label");

      const chkSonido = document.createElement("input");
      chkSonido.type = "checkbox";

      const title = document.createElement("span");
      title.textContent = "Sonido";

      main.appendChild(chkSonido);
      main.appendChild(title);

      // Subopciones
      const sub = document.createElement("div");
      sub.classList.add("sub-opciones");
      sub.style.display = "none";

      // Micrófonos
      const micro = document.createElement("label");

      const chkMicro = document.createElement("input");
      chkMicro.type = "checkbox";

      const txtMicro = document.createElement("span");
      txtMicro.textContent = "Micrófonos";

      const numMicro = document.createElement("input");
      numMicro.type = "number";
      numMicro.min = 1;
      numMicro.value = 1;
      numMicro.style.display = "none";

      chkMicro.addEventListener("change", () => {
        numMicro.style.display = chkMicro.checked ? "inline-block" : "none";

        if (!chkMicro.checked) {
          numMicro.value = 1;
        }
      });

      chkSonido.addEventListener("change", () => {
        sub.style.display = chkSonido.checked ? "flex" : "none";

        if (!chkSonido.checked) {
          chkMicro.checked = false;
          numMicro.style.display = "none";
          numMicro.value = 1;
        }
      });

      micro.appendChild(chkMicro);
      micro.appendChild(txtMicro);
      micro.appendChild(numMicro);

      sub.appendChild(micro);

      throw new Error("ESTE ES MI UI");

      input.appendChild(main);
      input.appendChild(sub);

      // Colocar debajo de Laptop
      setTimeout(() => {
        const materiales = document.getElementById("materiales");
        if (!materiales) return;

        const rows = materiales.querySelectorAll("label");

        let laptopRow = null;

        rows.forEach((r) => {
          const texto = r.querySelector("span")?.textContent;
          if (texto === "Laptop") laptopRow = r;
        });

        if (laptopRow) {
          laptopRow.insertAdjacentElement("afterend", input);
        }
      }, 200);

      input.getValores = () => ({
        activo: chkSonido.checked,
        bocina: chkSonido.checked, // Siempre incluida
        microfonos: chkMicro.checked ? Number(numMicro.value) || 1 : 0,
      });

      break;
    }

    case "personificadores_custom": {
      input = document.createElement("div");
      input.id = campo.id;
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

      //  MOVER "PERSONIFICADORES" DEBAJO DE "MAMPARAS"
      setTimeout(() => {
        const materiales = document.getElementById("materiales");
        if (!materiales) return;

        const rows = materiales.querySelectorAll("label");

        let mamparasRow = null;

        rows.forEach((r) => {
          const texto = r.querySelector("span")?.textContent;
          if (texto === "Mamparas") {
            mamparasRow = r;
          }
        });

        if (mamparasRow) {
          mamparasRow.insertAdjacentElement("afterend", input);
        }
      }, 200);

      input.getValores = () => ({
        activo: chk.checked,
        cantidad: chk.checked ? parseInt(num.value) || 0 : 0,
      });

      break;
    }
    case "curules_custom": {
      input = document.createElement("div");
      input.id = campo.id;

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.id = campo.id + "_switch";
      chk.classList.add("toggle-input");

      const toggle = document.createElement("label");
      toggle.classList.add("toggle-btn");
      toggle.setAttribute("for", chk.id);

      const si = document.createElement("span");
      si.textContent = "Sí";

      const no = document.createElement("span");
      no.textContent = "No";

      toggle.appendChild(si);
      toggle.appendChild(no);

      const cantidad = document.createElement("input");
      cantidad.type = "number";
      cantidad.min = 1;
      cantidad.placeholder = "Cantidad de curules";
      cantidad.style.display = "none";
      cantidad.style.marginTop = "10px";

      chk.addEventListener("change", () => {
        cantidad.style.display = chk.checked ? "block" : "none";
      });

      input.appendChild(chk);
      input.appendChild(toggle);
      input.appendChild(cantidad);

      input.getValores = () => ({
        activo: chk.checked,
        cantidad: chk.checked ? parseInt(cantidad.value) || 0 : 0,
      });

      break;
    }
    // =========================
    //  MONTAJE DINÁMICO FINAL
    // =========================
    case "text": {
      input = document.createElement("input");
      input.type = "text";
      input.id = campo.id;

      if (campo.id === "montaje") {
        const selectExtra = document.createElement("select");
        selectExtra.id = "montaje"; //  CLAVE
        selectExtra.style.display = "none";

        const opcionVacia = document.createElement("option");
        opcionVacia.value = "";
        opcionVacia.textContent = "Seleccione un montaje";
        selectExtra.appendChild(opcionVacia);

        ["Tipo aula", "Tipo herradura", "Tipo auditorio"].forEach((op) => {
          const option = document.createElement("option");
          option.value = op;
          option.textContent = op;
          selectExtra.appendChild(option);
        });

        setTimeout(() => {
          const espacio = document.getElementById("espacio");
          const personas = document.getElementById("personas");

          if (!espacio || !personas) return;

          const personasDiv = personas.parentElement;

          const actualizar = () => {
            const val = espacio.value;

            //  LIMPIAR SIEMPRE QUE CAMBIA
            input.value = "";
            selectExtra.selectedIndex = 0;

            //  AUDITORIO
            if (val === "Auditorio") {
              div.style.display = "block";

              input.style.display = "block";
              selectExtra.style.display = "none";

              if (label)
                label.textContent = "Montaje (Número de curules a ocupar)";

              // abajo de personas
              personasDiv.parentElement.insertBefore(
                div,
                personasDiv.nextSibling,
              );
            }

            //  SALA DE CONSEJO
            else if (val === "Sala de Consejo") {
              div.style.display = "block";

              input.style.display = "none";
              selectExtra.style.display = "block";

              if (label) label.textContent = "Montaje";

              //  arriba de personas
              personasDiv.parentElement.insertBefore(div, personasDiv);
            }

            //  EXPLANADA (OCULTAR TODO)
            else {
              div.style.display = "none";
            }
          };

          espacio.addEventListener("change", actualizar);
          actualizar();
        }, 200);

        div.getValores = () => {
          // Si está oculto no guardar nada
          if (div.style.display === "none") {
            return null;
          }

          //  SOLO GUARDAR SI ES SALA DE CONSEJO
          if (selectExtra.style.display === "block") {
            return selectExtra.value || null;
          }

          //  Cualquier otro caso NO guarda
          return null;
        };

        //  ORDEN CORRECTO
        if (label) div.appendChild(label);
        div.appendChild(selectExtra);
        div.appendChild(input);

        return div;
      }

      break;
    }

    // =========================
    //  HORARIO
    // =========================
    case "time_range": {
      input = document.createElement("input");
      input.type = "text";
      input.id = "montaje_input"; //  ya no "montaje"

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

      // Horarios
      if (campo.tipo === "time") {
        input.min = "07:00";
        input.max = "17:00";
      }

      // Curules
      if (campo.id === "cantidad_curules") {
        input.min = 1;
        input.max = 7;
        input.step = 1;
      }
    }
  }

  // =========================
  //  ENSAMBLAR (FUERA DEL SWITCH)
  // =========================
  if (label) div.appendChild(label);
  div.appendChild(input);

  // =========================
  //  DEPENDENCIAS
  // =========================
  if (campo.dependsOn) {
    setTimeout(() => {
      const config = campo.dependsOn;
      const controladorId = typeof config === "string" ? config : config.campo;

      const controlador = document.getElementById(controladorId);
      if (!controlador) return;

      const obtenerValor = () => {
        if (controlador.type === "checkbox") {
          return controlador.checked;
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

  // =========================
  //  VALIDACIÓN EXTRA (TIPO USUARIO)
  // =========================
  if (campo.id === "cargo_admin" || campo.id === "unidad") {
    setTimeout(() => {
      const tipo = document.getElementById("cargo_responsable");
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
