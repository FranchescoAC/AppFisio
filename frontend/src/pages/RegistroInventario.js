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
      toast.error("No se pudo cargar el inventario");
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

  const cambiarCantidad = async (item, delta) => {
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 0) {
      toast.error("❌ No puedes reducir más stock del disponible");
      return;
    }

    const actualizado = { ...item, cantidad: nuevaCantidad };
    try {
      await updateItem(item.item_id, actualizado);
      setInventario(prev =>
        prev.map(i => (i.item_id === item.item_id ? actualizado : i))
      );
    } catch (error) {
      console.error("Error actualizando stock:", error);
      toast.error("No se pudo actualizar el stock");
    }
  };

  const eliminarItem = async (item_id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmar) return;

    try {
      await deleteItem(item_id);
      setInventario(prev => prev.filter(i => i.item_id !== item_id));
      toast.success("🗑️ Producto eliminado", { position: "top-right" });
    } catch (error) {
      console.error("Error eliminando item:", error);
      toast.error("No se pudo eliminar el producto");
    }
  };
const venderItem = async (item) => {
  const cantidad = cantidadesVenta[item.item_id] || 1;

  if (item.cantidad < cantidad) {
    toast.error("❌ No hay stock suficiente", { position: "top-right" });
    return;
  }

  try {
    // Registrar venta y descontar stock (api.js ya lo hace todo)
    await registrarVenta({
      item_id: item.item_id,
      cantidad,
      precio_unitario: item.precio_venta,
    });

    // 🔄 Recargar inventario actualizado desde backend
    await cargarInventario();

    // Reset cantidad después de vender
    setCantidadesVenta(prev => ({ ...prev, [item.item_id]: 1 }));

    toast.success(`✅ Vendido ${cantidad} ${item.unidad} de ${item.nombre}`, {
      position: "top-right",
    });
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
    <div style={{ padding: 20, background: "#121212", color: "white", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>📦 Inventario</h2>

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
          <button onClick={handleAdd} style={{ padding: "10px", borderRadius: 8, background: "#1e88e5", color: "white", fontSize: "1rem", cursor: "pointer" }}>➕ Agregar</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {inventario.map(item => (
          <div key={item.item_id} style={{
            background: getColor(item.cantidad),
            padding: 15,
            borderRadius: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}>
            <h3>{item.nombre}</h3>
            {item.imagen_url && <img src={item.imagen_url} alt={item.nombre} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: 10, marginBottom: 5 }} />}
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>💲{item.precio_venta?.toFixed(2)}</p>
            <p>Stock: {item.cantidad} {item.unidad}</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>{item.descripcion || "-"}</p>

            {/* Controles de venta */}
            <div style={{ display: "flex", alignItems: "center", marginTop: 10, gap: 10 }}>
              <input
                type="number"
                min="1"
                max={item.cantidad}
                value={cantidadesVenta[item.item_id] || 1}
                onChange={e => setCantidadesVenta(prev => ({ ...prev, [item.item_id]: parseInt(e.target.value) || 1 }))}
                style={{ width: "70px", fontSize: "1.2rem", padding: "5px", borderRadius: 8, border: "1px solid #ccc", textAlign: "center" }}
              />
              <button onClick={() => venderItem(item)} style={{ padding: "10px 20px", fontSize: "1.2rem", background: "#28a745", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>💸 Vender</button>
            </div>

            {/* Botones de sumar/restar stock */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={() => cambiarCantidad(item, 1)} style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: 8, cursor: "pointer" }}>➕</button>
              <button onClick={() => cambiarCantidad(item, -1)} style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: 8, cursor: "pointer" }}>➖</button>
            </div>

            {/* Botón eliminar */}
            <button onClick={() => eliminarItem(item.item_id)} style={{ marginTop: 10, padding: "10px 20px", fontSize: "1.2rem", background: "#dc3545", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>🗑️ Eliminar</button>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default RegistroInventario;
