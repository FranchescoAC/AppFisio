  export const API_URL = "http://localhost:8001";
  export const API_URL2 = "http://localhost:8002";
  export const API_URL3 = "http://localhost:8003";
  export const API_URL4 = "http://localhost:8004";
  export const API_AUTH = "http://localhost:8005";
    export const API_URL6 = "http://localhost:8006";


export async function registrarPaciente(data) {
  try {
    const response = await fetch(`${API_URL}/pacientes/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.detail || `Error HTTP: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error("Error en registrarPaciente:", error);
    throw error;
  }
}

export async function actualizarPaciente(_id, data) {
  try {
    const response = await fetch(`${API_URL}/pacientes/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result?.detail || `Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarPaciente:", error);
    throw error;
  }
}

export async function listarPacientes() {
  const res = await fetch(`${API_URL}/pacientes/listar`);
  return res.json();
}

export async function editarPaciente(paciente_id, data) {
  try {
    const response = await fetch(`${API_URL}/pacientes/${paciente_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.detail || `Error HTTP: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error("Error en editarPaciente:", error);
    throw error;
  }
}
export async function eliminarPaciente(_id) {
  try {
    const response = await fetch(`${API_URL}/pacientes/${_id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.detail || `Error HTTP: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
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
  const res = await fetch(`${API_URL}/pacientes/buscar?query=${query}`);
  return res.json();
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

export async function obtenerAtencionById(atencionId) {
  const res = await fetch(`${API_URL2}/atenciones/by_id/${atencionId}`);
  if (!res.ok) throw new Error("Atención no encontrada");
  return await res.json();
}


// --- Fisioterapeutas ---
export async function listarFisioterapeutas() {
  const res = await fetch(`${API_URL2}/fisioterapeutas`);
  return await res.json();
}

export async function agregarFisioterapeuta(nombre) {
  const res = await fetch(`${API_URL2}/fisioterapeutas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre }),
  });
  if (!res.ok) throw new Error("No se pudo agregar fisioterapeuta");
  return await res.json();
}

export async function eliminarFisioterapeuta(id) {
  const res = await fetch(`${API_URL2}/fisioterapeutas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("No se pudo eliminar fisioterapeuta");
  return await res.json();
}
// Obtener registros del libro diario (opcional fecha)
export async function listarLibroDiario(fecha) {
  const url = fecha
    ? `${API_URL6 || "http://localhost:8006"}/librodiario/listar?fecha=${fecha}`
    : `${API_URL6 || "http://localhost:8006"}/librodiario/listar`;
  const res = await fetch(url);
  return await res.json();
}

// Registrar entrada en libro diario
export async function registrarLibroDiario(payload) {
  const res = await fetch(`${API_URL6 || "http://localhost:8006"}/librodiario/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return await res.json();
}


export async function actualizarRegistro(id, payload) {
  const res = await fetch(`http://localhost:8006/librodiario/actualizar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error actualizando registro");
  }

  return res.json();
}


// api.js
export async function registrarRegistro(payload) {
  const res = await fetch("http://localhost:8006/librodiario/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function borrarRegistro(id) {
  const res = await fetch(`http://localhost:8006/librodiario/borrar/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar registro");
  return res.json();
}
