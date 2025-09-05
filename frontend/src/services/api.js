  export const API_URL = "http://127.0.0.1:8001";
  export const API_URL2 = "http://127.0.0.1:8002";
  export const API_URL3 = "http://127.0.0.1:8003";
  export const API_URL4 = "http://127.0.0.1:8004";
  export const API_AUTH = "http://127.0.0.1:8005";


export async function registrarPaciente(data) {
  try {
    const response = await fetch(`${API_URL}/pacientes/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // 🔥 Lanza error con el detail del backend
      throw new Error(result?.detail || `Error HTTP: ${response.status}`);
    }

    return result;
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

 // INVENTARIO
export async function getInventario() {
  try {
    const response = await fetch(`${API_URL3}/inventario/`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en getInventario:", error);
    return [];
  }
}

export async function addItem(item) {
  try {
    const response = await fetch(`${API_URL3}/inventario/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en addItem:", error);
    throw error;
  }
}

export async function deleteItem(item_id) {
  try {
    const response = await fetch(`${API_URL3}/inventario/${item_id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en deleteItem:", error);
    throw error;
  }
}

export async function updateItem(item_id, data) {
  try {
    const response = await fetch(`${API_URL3}/inventario/${item_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en updateItem:", error);
    throw error;
  }
}

// VENTAS
export const registrarVenta = async (venta) => {
  const response = await fetch(`${API_URL4}/ventas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  });
  if (!response.ok) throw new Error("Error al registrar la venta");
  const data = await response.json();

  // ✅ Disminuir stock automáticamente después de la venta
  await updateItem(venta.item_id, { cantidad: -venta.cantidad });

  return data;
};
// ✅ Obtener todas las ventas
export async function getVentas() {
  try {
    const response = await fetch(`${API_URL4}/ventas/`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en getVentas:", error);
    return [];
  }
}

  // ✅ Actualizar una atención
  export async function updateAtencion(atencion_id, data) {
    const response = await fetch(`${API_URL2}/atenciones/${atencion_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  }

  // AUTENTICACIÓN
  // 🔒 Login usuario
  export async function loginUsuario(email, password) {
    try {
      const response = await fetch(`${API_AUTH}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data?.detail || "Credenciales inválidas");
      }
      return data; // { email, rol, token }
    } catch (error) {
      console.error("Error en loginUsuario:", error);
      throw error;
    }
  }

  // ✅ Registrar usuario (SOLO ADMIN) — incluye token en headers
  export async function registerUsuario({ email, password, rol }) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_AUTH}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ⬇⬇⬇ IMPORTANTE: enviar Bearer token
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, rol }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Error al registrar usuario");
      }
      // backend devuelve { email, rol, msg }
      return data;
    } catch (error) {
      console.error("Error en registerUsuario:", error);
      throw error;
    }
  }

  // 🔒 Obtener rol actual
  export function getUserRole() {
    return localStorage.getItem("rol");
  }

  // 🔒 Cerrar sesión
  export function logoutUsuario() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
  }

