import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Cache de elementos del DOM
const elements = {
  tbody: document.querySelector("#tabla-pacientes tbody"),
  loadingIndicator: document.getElementById("loading-state"),
  emptyState: document.getElementById("empty-state"),
  table: document.getElementById("tabla-pacientes"),
  tableContainer: document.querySelector(".table-container"),
};

// Inicialización del loader
function initializeLoader() {
  if (!elements.loadingIndicator) {
    const loader = document.createElement("div");
    loader.id = "loading-state";
    loader.className = "loading-container";
    loader.innerHTML = `
      <div class="spinner"></div>
      <p>Cargando pacientes...</p>
    `;
    elements.tableContainer.insertBefore(loader, elements.tbody.parentElement);
    elements.loadingIndicator = loader;
  }
}

// Manejo de estados de la UI
const uiStates = {
  showLoading: () => {
    elements.table.style.opacity = "0.5";
    elements.loadingIndicator.style.display = "flex";
    if (elements.emptyState) elements.emptyState.style.display = "none";
  },

  hideLoading: () => {
    elements.loadingIndicator.style.display = "none";
    elements.table.style.opacity = "1";
  },

  showEmpty: () => {
    if (!elements.emptyState) {
      const emptyDiv = document.createElement("div");
      emptyDiv.id = "empty-state";
      emptyDiv.className = "empty-state";
      emptyDiv.innerHTML = `
        <i class="fas fa-user-slash"></i>
        <p>No hay pacientes registrados</p>
      `;
      elements.tableContainer.appendChild(emptyDiv);
      elements.emptyState = emptyDiv;
    }
    elements.emptyState.style.display = "flex";
    elements.table.style.display = "none";
  },

  showError: () => {
    if (!elements.emptyState) {
      const errorDiv = document.createElement("div");
      errorDiv.id = "empty-state";
      errorDiv.className = "empty-state error-state";
      errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <p>Error al cargar los pacientes</p>
        <button class="retry-btn">Reintentar</button>
      `;
      elements.tableContainer.appendChild(errorDiv);
      elements.emptyState = errorDiv;
    } else {
      elements.emptyState.className = "empty-state error-state";
      elements.emptyState.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <p>Error al cargar los pacientes</p>
        <button class="retry-btn">Reintentar</button>
      `;
    }
    elements.emptyState.querySelector(".retry-btn").onclick = cargarPacientes;
    elements.emptyState.style.display = "flex";
    elements.table.style.display = "none";
  }
};

// Función principal para cargar pacientes
async function cargarPacientes() {
  try {
    uiStates.showLoading(); // Cambiado a la llamada correcta
    
    const querySnapshot = await getDocs(collection(db, "pacientes"));
    elements.tbody.innerHTML = "";

    uiStates.hideLoading(); // Cambiado a la llamada correcta

    if (querySnapshot.empty) {
      uiStates.showEmpty(); // Cambiado a la llamada correcta
      return;
    }

    renderPacientes(querySnapshot);
    setupDeleteButtons();
  } catch (error) {
    console.error("Error cargando pacientes:", error);
    uiStates.hideLoading(); // Cambiado a la llamada correcta
    uiStates.showError(); // Cambiado a la llamada correcta
  }
}

// Renderizar la lista de pacientes
function renderPacientes(querySnapshot) {
  elements.table.style.opacity = "1";
  elements.table.style.display = "table";

  querySnapshot.forEach((documento) => {
    const paciente = documento.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${paciente.nombre || "N/D"}</td>
      <td>${calculateAge(paciente.fechaNacimiento)}</td>
      <td>${paciente.sexo || "N/D"}</td>
      <td>${paciente.contactoEmergencia?.telefono || "N/D"}</td>
      <td>
        <a href="ver-paciente.html?id=${documento.id}" class="action-btn view-btn">
          <i class="fas fa-eye"></i>
        </a>
        <button class="action-btn delete-btn" data-id="${documento.id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    elements.tbody.appendChild(tr);
  });
}

// Calcular edad
function calculateAge(fechaNacimiento) {
  if (!fechaNacimiento) return "N/D";
  const birthDate = new Date(fechaNacimiento);
  return new Date().getFullYear() - birthDate.getFullYear();
}

// Configurar botones de eliminar
function setupDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      if (confirm("¿Estás seguro de eliminar este paciente?")) {
        await handleDeletePatient(e.target.closest("button").dataset.id);
      }
    });
  });
}

// Manejar eliminación de paciente
async function handleDeletePatient(id) {
  try {
    uiStates.showLoading(); // Cambiado a la llamada correcta
    await deleteDoc(doc(db, "pacientes", id));
    alert("Paciente eliminado correctamente");
    await cargarPacientes();
  } catch (error) {
    console.error("Error eliminando paciente:", error);
    alert("Error al eliminar paciente");
  } finally {
    uiStates.hideLoading(); // Cambiado a la llamada correcta
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeLoader();
  elements.table.style.opacity = "0";
  elements.table.style.transition = "opacity 0.3s ease";
  cargarPacientes();
});