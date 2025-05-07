import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pacienteId = urlParams.get("id");

  if (!pacienteId) {
    mostrarError("No se especificó un paciente");
    return;
  }

  try {
    const docRef = doc(db, "pacientes", pacienteId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("El paciente no existe");
    }

    mostrarPaciente(docSnap.data());
  } catch (error) {
    console.error("Error al cargar paciente:", error);
    mostrarError(error.message);
  }
});

function mostrarPaciente(paciente) {
  const detallesContainer = document.getElementById("paciente-detalles");

  detallesContainer.innerHTML = `
    <!-- Sección 1: Información Personal -->
    <div class="form-section">
      <h2>Información Personal</h2>
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre completo</label>
          <div class="readonly-input">${
            paciente.nombre || "No especificado"
          }</div>
        </div>
        <div class="form-group">
          <label>Fecha de nacimiento</label>
          <div class="readonly-input">${formatearFecha(
            paciente.fechaNacimiento
          )}</div>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Sexo</label>
          <div class="readonly-input">${
            paciente.sexo || "No especificado"
          }</div>
        </div>
        <div class="form-group">
          <label>Estado civil</label>
          <div class="readonly-input">${
            paciente.estadoCivil || "No especificado"
          }</div>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Ocupación</label>
          <div class="readonly-input">${
            paciente.ocupacion || "No especificado"
          }</div>
        </div>
        <div class="form-group">
          <label>Idioma nativo</label>
          <div class="readonly-input">${
            paciente.idioma || "No especificado"
          }</div>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- Sección 2: Datos Médicos -->
    <div class="form-section">
      <h2>Datos Médicos</h2>
      <div class="form-grid">
        <div class="form-group">
          <label>Grupo sanguíneo</label>
          <div class="readonly-input">${
            paciente.grupoSanguineo || "No especificado"
          }</div>
        </div>
        <div class="form-group">
          <label>Peso (kg)</label>
          <div class="readonly-input">${
            paciente.peso ? paciente.peso + " kg" : "No especificado"
          }</div>
        </div>
        <div class="form-group">
          <label>Estatura (cm)</label>
          <div class="readonly-input">${
            paciente.estatura ? paciente.estatura + " cm" : "No especificado"
          }</div>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- Sección 3: Contacto y Domicilio -->
    <div class="form-section">
      <h2>Contacto y Domicilio</h2>
      <div class="form-group">
        <label>Domicilio completo</label>
        <div class="readonly-input">${
          paciente.domicilio || "No especificado"
        }</div>
      </div>

      <h3>Contacto de emergencia</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre completo</label>
          <div class="readonly-input">${
            paciente.contactoEmergencia?.nombre || "No especificado"
          }</div>
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <div class="readonly-input">${
            paciente.contactoEmergencia?.telefono || "No especificado"
          }</div>
        </div>
        <div class="form-group">
          <label>Parentesco</label>
          <div class="readonly-input">${
            paciente.contactoEmergencia?.parentesco || "No especificado"
          }</div>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- Sección 4: Antecedentes Médicos -->
    <div class="form-section">
      <h2>Antecedentes Médicos</h2>
      <div class="form-group">
        <label>Antecedentes clínicos</label>
        <div class="readonly-textarea">${
          paciente.antecedentes || "Ninguno registrado"
        }</div>
      </div>
      <div class="form-group">
        <label>Alergias conocidas</label>
        <div class="readonly-textarea">${mostrarCampoLista(
          paciente.alergias
        )}</div>
      </div>
      <div class="form-group">
        <label>Cirugías previas</label>
        <div class="readonly-textarea">${mostrarCampoLista(
          paciente.cirugias
        )}</div>
      </div>
      <div class="form-group">
        <label>Enfermedades actuales</label>
        <div class="readonly-textarea">${mostrarCampoLista(
          paciente.enfermedades
        )}</div>
      </div>
    </div>
  `;
}

function mostrarCampoLista(campo) {
  if (!campo || campo.length === 0) return "Ninguna registrada";
  return Array.isArray(campo) ? campo.join(", ") : campo;
}

function formatearFecha(fecha) {
  if (!fecha) return "No especificada";

  const parsed = new Date(fecha);
  if (isNaN(parsed)) return "Formato inválido";

  return parsed.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function mostrarError(mensaje) {
  const detallesContainer = document.getElementById("paciente-detalles");
  detallesContainer.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${mensaje}</p>
      <a href="listar-pacientes.html" class="retry-btn">
        <i class="fas fa-arrow-left"></i> Volver a la lista
      </a>
    </div>
  `;
}
