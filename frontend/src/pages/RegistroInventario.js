import React, { useEffect, useState } from "react";
import { getInventario, addItem } from "../services/api";

const RegistroInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [nuevoItem, setNuevoItem] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    unidad: "",
    imagen_url: ""
  });

  // Cargar inventario
  const cargarInventario = async () => {
    try {
      const data = await getInventario();
      // FastAPI retorna un array directo, no res.data
      setInventario(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
      setInventario([]);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // Agregar nuevo item
  const handleAdd = async () => {
    try {
      // Preparamos el payload asegurándonos que los opcionales sean null si están vacíos
      const payload = {
        nombre: nuevoItem.nombre,
        descripcion: nuevoItem.descripcion || null,
        cantidad: Number(nuevoItem.cantidad),
        unidad: nuevoItem.unidad,
        imagen_url: nuevoItem.imagen_url || null
      };

      await addItem(payload);
      setNuevoItem({ nombre: "", descripcion: "", cantidad: 0, unidad: "", imagen_url: "" });
      cargarInventario();
    } catch (error) {
      console.error("Error agregando item:", error);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#121212", color: "white" }}>
      <h2>📦 Inventario Médico</h2>

      {/* Formulario */}
      <input
        placeholder="Nombre"
        value={nuevoItem.nombre}
        onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
      />
      <input
        placeholder="Descripción"
        value={nuevoItem.descripcion}
        onChange={(e) => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })}
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={nuevoItem.cantidad}
        onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: Number(e.target.value) })}
      />
      <input
        placeholder="Unidad"
        value={nuevoItem.unidad}
        onChange={(e) => setNuevoItem({ ...nuevoItem, unidad: e.target.value })}
      />
      <input
        placeholder="URL Imagen"
        value={nuevoItem.imagen_url}
        onChange={(e) => setNuevoItem({ ...nuevoItem, imagen_url: e.target.value })}
      />
      <button onClick={handleAdd}>➕ Agregar</button>

      {/* Lista */}
      <div style={{ marginTop: 20 }}>
        {inventario.length === 0 ? (
          <p>No hay items en el inventario.</p>
        ) : (
          inventario.map((item) => (
            <div
              key={item.item_id}
              style={{
                background: item.cantidad < 5 ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.2)",
                padding: 10,
                marginBottom: 10,
                borderRadius: 10
              }}
            >
              <h3>{item.nombre} ({item.cantidad} {item.unidad})</h3>
              <p>{item.descripcion}</p>
              {item.imagen_url && (
                <img src={item.imagen_url} alt={item.nombre} style={{ width: "100px", borderRadius: "10px" }} />
              )}
              <p style={{ fontWeight: "bold", color: item.cantidad < 5 ? "red" : "lightgreen" }}>
                {item.cantidad < 5 ? "⚠️ Stock bajo" : "✅ Stock suficiente"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistroInventario;
