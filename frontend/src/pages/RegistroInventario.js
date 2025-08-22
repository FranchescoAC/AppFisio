import React, { useEffect, useState } from "react";
import { getInventario, addItem, updateItem, deleteItem, registrarVenta } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistroInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [nuevoItem, setNuevoItem] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    unidad: "",
    imagen_url: "",
    precio_compra: 0,
    precio_venta: 0
  });

  const [cantidadesVenta, setCantidadesVenta] = useState({});
  const [cantidadesStock, setCantidadesStock] = useState({});
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      const data = await getInventario();
      setInventario(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    }
  };

  const handleAdd = async () => {
    if (!nuevoItem.nombre.trim() || !nuevoItem.unidad.trim()) {
      toast.error("Nombre y Unidad son obligatorios");
      return;
    }

    const payload = {
      nombre: nuevoItem.nombre.trim(),
      descripcion: nuevoItem.descripcion.trim() || null,
      cantidad: Number(nuevoItem.cantidad) || 0,
      unidad: nuevoItem.unidad.trim(),
      imagen_url: nuevoItem.imagen_url.trim() || null,
      precio_compra: parseFloat(nuevoItem.precio_compra) || 0,
      precio_venta: parseFloat(nuevoItem.precio_venta) || 0
    };

    try {
      await addItem(payload);
      toast.success(`➕ Producto "${payload.nombre}" agregado`);
      setNuevoItem({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        unidad: "",
        imagen_url: "",
        precio_compra: 0,
        precio_venta: 0
      });
      cargarInventario();
    } catch (error) {
      console.error("Error agregando item:", error);
      toast.error("No se pudo agregar el producto");
    }
  };

  const actualizarStock = async (item, delta) => {
    // Evitar que el stock quede negativo
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 0) {
      toast.error("❌ No puedes reducir más stock del disponible");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8003/inventario/${item.item_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad: delta })
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setInventario(prev =>
        prev.map(i => i.item_id === item.item_id ? { ...i, cantidad: data.cantidad } : i)
      );
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
    }
  };

  const eliminarItemConConfirm = async (item_id, nombre) => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar "${nombre}"?`);
    if (!confirmar) return;

    await deleteItem(item_id);
    setInventario(prev => prev.filter(i => i.item_id !== item_id));
    toast.success("🗑️ Producto eliminado", { position: "top-right" });
  };

  const venderItem = async (item) => {
    const cantidad = cantidadesVenta[item.item_id] || 1;

    if (cantidad <= 0) {
      toast.error("❌ Ingresa una cantidad válida");
      return;
    }

    if (item.cantidad < cantidad) {
      toast.error("❌ No hay stock suficiente");
      return;
    }

const venderItem = async (item) => {
  const cantidad = cantidadesVenta[item.item_id] || 1;

  if (cantidad <= 0) {
    toast.error("❌ Ingresa una cantidad válida");
    return;
  }

  if (item.cantidad < cantidad) {
    toast.error("❌ No hay stock suficiente");
    return;
  }

  try {
    // Registrar venta
    await registrarVenta({
      item_id: item.item_id,
      cantidad,
      precio_unitario: item.precio_venta
    });

    // Actualizar stock RESTANDO la cantidad vendida
    const response = await fetch(`http://localhost:8003/inventario/${item.item_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad: -cantidad }) // <- solo aquí
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();

    setInventario(prev =>
      prev.map(i => i.item_id === item.item_id ? { ...i, cantidad: data.cantidad } : i)
    );

    // Reset input de venta
    setCantidadesVenta(prev => ({ ...prev, [item.item_id]: 1 }));

    toast.success(`✅ Vendido ${cantidad} ${item.unidad} de ${item.nombre}`);
  } catch (error) {
    console.error("Error registrando venta:", error);
    toast.error("No se pudo realizar la venta");
  }
};


  const getColor = (cantidad) => {
    if (cantidad < 3) return "rgba(255,0,0,0.3)";
    if (cantidad < 5) return "rgba(255,165,0,0.3)";
    return "rgba(0,255,0,0.2)";
  };

  return (
    <div style={{ padding: 20, color: "white", fontFamily: "Arial", background: "#121212" }}>
      <h2>📦 Inventario</h2>

      {/* Botón toggle registro */}
      <button
        onClick={() => setMostrarRegistro(!mostrarRegistro)}
        style={{ marginBottom: 20, padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}
      >
        {mostrarRegistro ? "❌ Cerrar Registro" : "➕ Abrir Registro de Inventario"}
      </button>

      {mostrarRegistro && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 20 }}>
          <input placeholder="Nombre" value={nuevoItem.nombre} onChange={e => setNuevoItem({ ...nuevoItem, nombre: e.target.value })} />
          <input placeholder="Descripción" value={nuevoItem.descripcion} onChange={e => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })} />
          <input type="number" placeholder="Cantidad" value={nuevoItem.cantidad} onChange={e => setNuevoItem({ ...nuevoItem, cantidad: Number(e.target.value) })} />
          <input placeholder="Unidad" value={nuevoItem.unidad} onChange={e => setNuevoItem({ ...nuevoItem, unidad: e.target.value })} />
          <input type="number" placeholder="Precio Compra" value={nuevoItem.precio_compra} onChange={e => setNuevoItem({ ...nuevoItem, precio_compra: Number(e.target.value) })} />
          <input type="number" placeholder="Precio Venta" value={nuevoItem.precio_venta} onChange={e => setNuevoItem({ ...nuevoItem, precio_venta: Number(e.target.value) })} />
          <input placeholder="URL Imagen" value={nuevoItem.imagen_url} onChange={e => setNuevoItem({ ...nuevoItem, imagen_url: e.target.value })} />
          <button onClick={handleAdd}>➕ Agregar</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {inventario.map(item => (
          <div key={item.item_id} style={{
            padding: 15,
            borderRadius: 10,
            background: getColor(item.cantidad),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <h3>{item.nombre}</h3>
            {item.imagen_url && <img src={item.imagen_url} alt={item.nombre} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: 10, marginBottom: 5 }} />}
            <p>💲{item.precio_venta?.toFixed(2)}</p>
            <p>Stock: {item.cantidad} {item.unidad}</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>{item.descripcion || "-"}</p>

            {/* Input y botón para vender */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <input
                type="number"
                min="1"
                max={item.cantidad}
                value={cantidadesVenta[item.item_id] || 1}
                onChange={e =>
                  setCantidadesVenta(prev => ({
                    ...prev,
                    [item.item_id]: Math.max(1, Math.min(item.cantidad, parseInt(e.target.value) || 1))
                  }))
                }
                style={{ width: "60px", padding: "5px", borderRadius: 5, border: "1px solid #ccc", textAlign: "center" }}
              />
              <button onClick={() => venderItem(item)} style={{ padding: "10px 20px", fontSize: "1rem", background: "#28a745", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>💸 Vender</button>
            </div>

            {/* Input y botones para ajustar stock */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <input
                type="number"
                min="1"
                value={cantidadesStock[item.item_id] || 1}
                onChange={e =>
                  setCantidadesStock(prev => ({
                    ...prev,
                    [item.item_id]: Math.max(1, parseInt(e.target.value) || 1)
                  }))
                }
                style={{ width: "60px", padding: "5px", borderRadius: 5, border: "1px solid #ccc", textAlign: "center" }}
              />
              <button onClick={() => actualizarStock(item, cantidadesStock[item.item_id] || 1)} style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: 8, cursor: "pointer" }}>➕</button>
              <button onClick={() => actualizarStock(item, -(cantidadesStock[item.item_id] || 1))} style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: 8, cursor: "pointer" }}>➖</button>
            </div>

            <button onClick={() => eliminarItemConConfirm(item.item_id, item.nombre)} style={{ marginTop: 10, padding: "10px 20px", fontSize: "1rem", background: "#dc3545", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>🗑️ Eliminar</button>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default RegistroInventario;
