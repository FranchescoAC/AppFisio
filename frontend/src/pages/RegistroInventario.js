import React, { useEffect, useState } from "react";
import { getInventario, addItem } from "../services/api";

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
    // Validaciones básicas
    if (!nuevoItem.nombre.trim() || !nuevoItem.unidad.trim()) {
      alert("Nombre y Unidad son obligatorios");
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
      alert("No se pudo agregar el item");
    }
  };

  return (
    <div style={{ padding: 20, color: "white", fontFamily: "Arial", background: "#121212" }}>
      <h2>📦 Registro de Inventario</h2>

      <input placeholder="Nombre" value={nuevoItem.nombre} onChange={e => setNuevoItem({ ...nuevoItem, nombre: e.target.value })} />
      <input placeholder="Descripción" value={nuevoItem.descripcion} onChange={e => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })} />
      <input type="number" placeholder="Cantidad" value={nuevoItem.cantidad} onChange={e => setNuevoItem({ ...nuevoItem, cantidad: Number(e.target.value) })} />
      <input placeholder="Unidad" value={nuevoItem.unidad} onChange={e => setNuevoItem({ ...nuevoItem, unidad: e.target.value })} />
      <input type="number" placeholder="Precio Compra" value={nuevoItem.precio_compra} onChange={e => setNuevoItem({ ...nuevoItem, precio_compra: Number(e.target.value) })} />
      <input type="number" placeholder="Precio Venta" value={nuevoItem.precio_venta} onChange={e => setNuevoItem({ ...nuevoItem, precio_venta: Number(e.target.value) })} />
      <input placeholder="URL Imagen" value={nuevoItem.imagen_url} onChange={e => setNuevoItem({ ...nuevoItem, imagen_url: e.target.value })} />
      <button onClick={handleAdd}>➕ Agregar</button>

      <div style={{ marginTop: 20 }}>
        {inventario.map(item => (
          <div key={item.item_id} style={{ padding: 10, marginBottom: 10, borderRadius: 10, background: item.cantidad < 5 ? "rgba(255,165,0,0.3)" : "rgba(0,255,0,0.2)" }}>
            <h3>{item.nombre} ({item.cantidad} {item.unidad})</h3>
            <p>{item.descripcion}</p>
            <p>💰 Compra: {item.precio_compra} | Venta: {item.precio_venta}</p>
            {item.imagen_url && <img src={item.imagen_url} alt={item.nombre} style={{ width: "100px", borderRadius: "10px" }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistroInventario;
