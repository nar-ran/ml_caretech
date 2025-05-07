import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Obtener ID del paciente de la URL
const urlParams = new URLSearchParams(window.location.search);
const pacienteId = urlParams.get("id");
const detallesContainer = document.getElementById("paciente-detalles");

// Función para manejar fechas de Firestore de forma segura
function convertirFirestoreTimestamp(fecha) {
  // Si es un objeto Timestamp de Firestore
  if (fecha instanceof Timestamp) {
    return fecha.toDate();
  }
  // Si ya es un objeto Date
  if (fecha instanceof Date) {
    return fecha;
  }
  // Si es una cadena de fecha ISO
  if (typeof fecha === "string") {
    try {
      return new Date(fecha);
    } catch (e) {
      return null;
    }
  }
  // Para cualquier otro caso
  return null;
}

async function cargarDetallesPaciente() {
  try {
    // Mostrar estado de carga
    detallesContainer.innerHTML = `
      <div class="detail-loading">
        <div class="spinner"></div>
        <p>Cargando información del paciente...</p>
      </div>
    `;

    if (!pacienteId) throw new Error("No se especificó un paciente");

    const docRef = doc(db, "pacientes", pacienteId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("El paciente no existe");

    const paciente = docSnap.data();
    mostrarDetallesPaciente(paciente);
  } catch (error) {
    console.error("Error al cargar paciente:", error);
    mostrarError(error.message);
  }
}

function mostrarDetallesPaciente(paciente) {
  // Convertir y formatear fecha de nacimiento
  const fechaNacimiento = convertirFirestoreTimestamp(paciente.fechaNacimiento);
  const fechaFormateada = fechaNacimiento
    ? fechaNacimiento.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No especificada";

  // Calcular edad
  const edad = fechaNacimiento ? calcularEdad(fechaNacimiento) : "N/D";

  // Mostrar todos los detalles
  detallesContainer.innerHTML = `
    <div class="detail-section">
      <h2>Información Personal</h2>
      <div class="detail-grid">
        <div class="detail-group">
          <span class="detail-label">Nombre completo:</span>
          <span class="detail-value">${
            paciente.nombre || "No especificado"
          }</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Fecha de nacimiento:</span>
          <span class="detail-value">${fechaFormateada}</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Edad:</span>
          <span class="detail-value">${edad}</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Sexo:</span>
          <span class="detail-value">${
            paciente.sexo || "No especificado"
          }</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Teléfono:</span>
          <span class="detail-value">${
            paciente.telefono || "No especificado"
          }</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h2>Datos Médicos</h2>
      <div class="detail-grid">
        <div class="detail-group">
          <span class="detail-label">Grupo sanguíneo:</span>
          <span class="detail-value">${
            paciente.grupoSanguineo || "No especificado"
          }</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Peso:</span>
          <span class="detail-value">${
            paciente.peso ? paciente.peso + " kg" : "No especificado"
          }</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Estatura:</span>
          <span class="detail-value">${
            paciente.estatura ? paciente.estatura + " cm" : "No especificado"
          }</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Alergias:</span>
          <span class="detail-value">${formatList(paciente.alergias)}</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Enfermedades crónicas:</span>
          <span class="detail-value">${formatList(paciente.enfermedades)}</span>
        </div>
      </div>
    </div>
  `;
}

// Función para calcular edad exacta
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return `${edad} años`;
}

// Función para formatear arrays como listas
function formatList(items) {
  if (!items || items.length === 0) return "Ninguna registrada";
  if (Array.isArray(items)) return items.join(", ");
  return items;
}

function mostrarError(mensaje) {
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

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", cargarDetallesPaciente);
