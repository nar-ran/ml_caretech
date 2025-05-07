import { db } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Registra un nuevo paciente en Firestore
 * @param {Object} pacienteData - Datos del paciente
 * @returns {Promise<Object>} - Objeto con resultado (success, id/error)
 */
export const registrarPaciente = async (pacienteData) => {
  try {
    // Validación básica de campos requeridos
    if (!pacienteData.nombre || !pacienteData.fechaNacimiento) {
      throw new Error("Nombre y fecha de nacimiento son obligatorios");
    }

    // Procesar datos antes de guardar
    const datosParaGuardar = {
      ...pacienteData,
      fechaRegistro: serverTimestamp(),
      peso: pacienteData.peso ? parseFloat(pacienteData.peso) : null,
      estatura: pacienteData.estatura ? parseInt(pacienteData.estatura) : null,
      alergias: pacienteData.alergias 
        ? pacienteData.alergias.split(',').map(a => a.trim()).filter(a => a)
        : [],
      cirugias: pacienteData.cirugias 
        ? pacienteData.cirugias.split(',').map(c => c.trim()).filter(c => c)
        : [],
      enfermedades: pacienteData.enfermedades 
        ? pacienteData.enfermedades.split(',').map(e => e.trim()).filter(e => e)
        : [],
      contactoEmergencia: {
        nombre: pacienteData.contactoNombre || '',
        telefono: pacienteData.contactoTelefono || '',
        parentesco: pacienteData.contactoParentesco || ''
      }
    };

    // Eliminar campos temporales del contacto
    delete datosParaGuardar.contactoNombre;
    delete datosParaGuardar.contactoTelefono;
    delete datosParaGuardar.contactoParentesco;

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, "pacientes"), datosParaGuardar);
    
    return {
      success: true,
      id: docRef.id,
      fechaRegistro: new Date() // Fecha local como referencia
    };
  } catch (error) {
    console.error("Error al registrar paciente:", error);
    return {
      success: false,
      error: error.message || "Error desconocido al guardar los datos"
    };
  }
};

/**
 * Obtiene la fecha formateada para mostrar al usuario
 * @param {Timestamp} timestamp - Timestamp de Firestore
 * @returns {String} - Fecha formateada
 */
export const formatearFecha = (timestamp) => {
  if (!timestamp) return 'No disponible';
  
  const fecha = timestamp.toDate();
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};