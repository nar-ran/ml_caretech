import { registrarPaciente } from "./firebase-pacientes.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-paciente");
  const submitBtn = document.getElementById("submit-btn");
  const loader = document.getElementById("loader");
  const btnText = document.getElementById("btn-text");

  const guardarEstadoFormulario = () => {
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    localStorage.setItem("formPacienteData", JSON.stringify(formDataObject));
  };

  const cargarEstadoFormulario = () => {
    const storedData = localStorage.getItem("formPacienteData");
    if (storedData) {
      const formDataObject = JSON.parse(storedData);
      for (const key in formDataObject) {
        const inputElement = form.querySelector(`[name="${key}"]`);
        if (inputElement) {
          inputElement.value = formDataObject[key];
        }
      }
    }
  };

  cargarEstadoFormulario();

  form.querySelectorAll("input, textarea, select").forEach((input) => {
    input.addEventListener("input", guardarEstadoFormulario);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    loader.style.display = "inline-block";
    btnText.textContent = "Guardando...";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const pacienteData = Object.fromEntries(formData.entries());

    try {
      const resultado = await registrarPaciente(pacienteData);

      if (resultado.success) {
        mostrarMensajeExito();
        form.reset();
        localStorage.removeItem("formPacienteData");
      } else {
        mostrarError(resultado.error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      mostrarError(
        "Ocurrió un error inesperado. Por favor intenta nuevamente."
      );
    } finally {
      loader.style.display = "none";
      btnText.textContent = "Guardar Registro Médico";
      submitBtn.disabled = false;
    }
  });

  /**
   * Muestra mensaje de éxito
   */
  function mostrarMensajeExito() {
    const mensaje = document.createElement("div");
    mensaje.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: #4CAF50;
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
      ">
        <strong>✓ Éxito!</strong> Registro médico guardado correctamente.
      </div>
    `;

    document.body.appendChild(mensaje);

    setTimeout(() => {
      mensaje.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => mensaje.remove(), 300);
    }, 5000);
  }

  /**
   * Muestra mensaje de error
   * @param {String} mensaje - Mensaje de error a mostrar
   */
  function mostrarError(mensaje) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: #F44336;
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
      ">
        <strong>✗ Error!</strong> ${mensaje}
      </div>
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
  }

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});