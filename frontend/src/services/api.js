export const API_URL = "http://127.0.0.1:8001";
export const API_URL2 = "http://127.0.0.1:8002";

export async function registrarPaciente(data) {
  try {
    const response = await fetch(`${API_URL}/pacientes/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json(); // <-- Aquí puede fallar si el backend devuelve algo inesperado
  } catch (error) {
    console.error("Error en registrarPaciente:", error);
    throw error;
  }
}


export async function listarPacientes() {
  try {
    const response = await fetch(`${API_URL}/pacientes/listar`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en listarPacientes:", error);
    throw error;
  }
}


export async function registrarAtencion(data) {
  try {
    const response = await fetch(`${API_URL2}/atenciones/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en registrarAtencion:", error);
    throw error;
  }
}

export async function listarAtenciones(paciente_id) {
  try {
    const response = await fetch(`${API_URL2}/atenciones/listar/${paciente_id}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en listarAtenciones:", error);
    throw error;
  }
}

// Buscar pacientes por nombre o id
export async function buscarPacientes(query) {
  try {
    const response = await fetch(`${API_URL}/pacientes/buscar?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en buscarPacientes:", error);
    throw error;
  }
}


// Buscar atenciones por nombre o paciente_id
export async function buscarAtenciones({ query }) {
  try {
    const response = await fetch(`${API_URL2}/atenciones/buscar?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en buscarAtenciones:", error);
    throw error;
  }
}

export async function obtenerSiguientePacienteId() {
  try {
    const response = await fetch(`${API_URL}/pacientes/next_id`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerSiguientePacienteId:", error);
    throw error;
  }
}
