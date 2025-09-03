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

//INVENTARIO

// ✅ Obtener inventario completo
export async function getInventario() {
  try {
    const response = await fetch(`${API_URL3}/inventario/`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json(); // Devuelve un array
  } catch (error) {
    console.error("Error en getInventario:", error);
    return [];
  }
}

// ✅ Agregar un item
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

// ✅ Eliminar un item
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

// ✅ Actualizar item
export async function updateItem(item_id, item) {
  try {
    const response = await fetch(`${API_URL3}/inventario/${item_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en updateItem:", error);
    throw error;
  }
}

//VENTAS
export const registrarVenta = async (venta) => {
  const response = await fetch(`${API_URL4}/ventas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  });

  if (!response.ok) {
    throw new Error("Error al registrar la venta");
  }

  const data = await response.json();

  // ✅ Después de registrar venta, disminuimos el stock
  await disminuirStock(venta.item_id, venta.cantidad);

  return data;
};


export const getVentas = async () => {
  const response = await fetch(`${API_URL4}/ventas/`);

  if (!response.ok) {
    throw new Error("Error al obtener las ventas");
  }

  return await response.json();
};

// ✅ Disminuir stock de un item
export async function disminuirStock(item_id, cantidad) {
  try {
    const response = await fetch(`${API_URL3}/inventario/${item_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad: -cantidad }), // Resta en backend
    });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en disminuirStock:", error);
    throw error;
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
// AUTENTICACIÓN
// 🔒 Login usuario
export async function loginUsuario(email, password) {
  try {
    const response = await fetch(`${API_AUTH}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Intentamos parsear la respuesta
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Error al procesar respuesta del servidor");
    }

    // Si no hay token o la respuesta no es OK, lanzar error
    if (!response.ok || !data.token) {
      throw new Error(data.msg || "Credenciales inválidas");
    }

    // Guardamos token y rol en localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);

    return data; // { email, rol, token }
  } catch (error) {
    console.error("Error en loginUsuario:", error);
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

// 🔒 Registro usuario
export async function registerUsuario({ email, password, rol }) {
  try {
    const response = await fetch(`${API_AUTH}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rol }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Error al registrar usuario");
    }

    return await response.json(); // { msg: "Usuario creado" }
  } catch (error) {
    console.error("Error en registerUsuario:", error);
    throw error;
  }
}
