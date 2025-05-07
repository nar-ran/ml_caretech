import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const pacienteId = urlParams.get("id");
const formulario = document.getElementById("formulario-edicion");
const form = document.getElementById("form-editar-paciente");

async function cargarFormularioEdicion() {
  try {
    if (!pacienteId) throw new Error("No se especificó un paciente");

    const docRef = doc(db, "pacientes", pacienteId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("El paciente no existe");

    const paciente = docSnap.data();
    mostrarFormulario(paciente);
  } catch (error) {
    mostrarError(error.message);
  }
}

function mostrarFormulario(paciente) {
  // Formatear fecha para input type="date"
  const fechaNacimiento = paciente.fechaNacimiento?.toDate();
  const fechaFormateada = fechaNacimiento
    ? fechaNacimiento.toISOString().split("T")[0]
    : "";

  formulario.innerHTML = `
    <div class="form-section">
      <h2>Información Personal</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <input type="text" id="nombre" value="${
            paciente.nombre || ""
          }" required>
        </div>
        
        <div class="form-group">
          <label for="fechaNacimiento">Fecha de nacimiento</label>
          <input type="date" id="fechaNacimiento" value="${fechaFormateada}">
        </div>
        
        <div class="form-group">
          <label for="sexo">Sexo</label>
          <select id="sexo" required>
            <option value="">Seleccionar...</option>
            <option value="Masculino" ${
              paciente.sexo === "Masculino" ? "selected" : ""
            }>Masculino</option>
            <option value="Femenino" ${
              paciente.sexo === "Femenino" ? "selected" : ""
            }>Femenino</option>
            <option value="Otro" ${
              paciente.sexo === "Otro" ? "selected" : ""
            }>Otro</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h2>Datos Médicos</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="grupoSanguineo">Grupo sanguíneo</label>
          <select id="grupoSanguineo">
            <option value="">Seleccionar...</option>
            <option value="A+" ${
              paciente.grupoSanguineo === "A+" ? "selected" : ""
            }>A+</option>
            <option value="A-" ${
              paciente.grupoSanguineo === "A-" ? "selected" : ""
            }>A-</option>
            <option value="B+" ${
              paciente.grupoSanguineo === "B+" ? "selected" : ""
            }>B+</option>
            <option value="B-" ${
              paciente.grupoSanguineo === "B-" ? "selected" : ""
            }>B-</option>
            <option value="AB+" ${
              paciente.grupoSanguineo === "AB+" ? "selected" : ""
            }>AB+</option>
            <option value="AB-" ${
              paciente.grupoSanguineo === "AB-" ? "selected" : ""
            }>AB-</option>
            <option value="O+" ${
              paciente.grupoSanguineo === "O+" ? "selected" : ""
            }>O+</option>
            <option value="O-" ${
              paciente.grupoSanguineo === "O-" ? "selected" : ""
            }>O-</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="peso">Peso (kg)</label>
          <input type="number" id="peso" value="${
            paciente.peso || ""
          }" step="0.1" min="0">
        </div>
        
        <div class="form-group">
          <label for="estatura">Estatura (cm)</label>
          <input type="number" id="estatura" value="${
            paciente.estatura || ""
          }" min="0">
        </div>
      </div>
    </div>
  `;

  // Configurar evento del formulario
  form.addEventListener("submit", guardarCambios);
}

async function guardarCambios(e) {
  e.preventDefault();

  try {
    const pacienteActualizado = {
      nombre: document.getElementById("nombre").value,
      fechaNacimiento: new Date(
        document.getElementById("fechaNacimiento").value
      ),
      sexo: document.getElementById("sexo").value,
      grupoSanguineo: document.getElementById("grupoSanguineo").value,
      peso: parseFloat(document.getElementById("peso").value) || null,
      estatura: parseInt(document.getElementById("estatura").value) || null,
      // Agrega más campos según necesites
    };

    await updateDoc(doc(db, "pacientes", pacienteId), pacienteActualizado);
    alert("Cambios guardados correctamente");
    window.location.href = `ver-paciente.html?id=${pacienteId}`;
  } catch (error) {
    console.error("Error guardando cambios:", error);
    alert("Error al guardar los cambios: " + error.message);
  }
}

function mostrarError(mensaje) {
  formulario.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${mensaje}</p>
      <a href="listar-pacientes.html" class="retry-btn">
        <i class="fas fa-arrow-left"></i> Volver a la lista
      </a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", cargarFormularioEdicion);
