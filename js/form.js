function renderFormulario() {
  const contenedor = document.getElementById("formulario");
  const titulo = document.getElementById("titulo");

  titulo.textContent = formularioData.titulo;
  contenedor.innerHTML = ""; // limpiar

  formularioData.secciones.forEach((seccion) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("seccion");

    const h2 = document.createElement("h2");
    h2.textContent = seccion.titulo;
    sectionDiv.appendChild(h2);

    seccion.campos.forEach((campo) => {
      const div = document.createElement("div");
      div.classList.add("form-group");

      const label = document.createElement("label");
      label.textContent = campo.label;

      let input;

      if (campo.tipo === "textarea") {
        input = document.createElement("textarea");
      } else {
        input = document.createElement("input");
        input.type = campo.tipo;
      }

      input.id = campo.id;

      div.appendChild(label);
      div.appendChild(input);
      sectionDiv.appendChild(div);
    });

    contenedor.appendChild(sectionDiv);
  });

  // 🔥 BOTÓN SE CREA AL FINAL
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = "Enviar";
  btn.classList.add("btn-enviar");

  contenedor.appendChild(btn);
}
