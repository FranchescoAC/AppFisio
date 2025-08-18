export const API_URL = "http://127.0.0.1:8001";
export const API_URL2 = "http://127.0.0.1:8002";

export async function registrarPaciente(data) {
  try {
    const response = await fetch("http://127.0.0.1:8001/pacientes/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
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

