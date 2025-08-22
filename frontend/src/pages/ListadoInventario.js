import React, { useEffect, useState } from "react";
import { getInventario, updateItem, deleteItem } from "../services/api";

const isAdmin = true; // temporal

function ListadoInventario() {
  const [inventario, setInventario] = useState([]);

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

  const cambiarCantidad = async (item, delta) => {
    try {
      const nuevaCantidad = item.cantidad + delta;
      if (nuevaCantidad < 0) return;

      const actualizado = { ...item, cantidad: nuevaCantidad };
      await updateItem(item.item_id, actualizado);
      setInventario(prev =>
        prev.map(i => (i.item_id === item.item_id ? actualizado : i))
      );
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
    }
  };

  const eliminarItem = async (item_id) => {
    try {
      await deleteItem(item_id);
      setInventario(prev => prev.filter(i => i.item_id !== item_id));
    } catch (error) {
      console.error("Error eliminando item:", error);
    }
  };

  const getColor = (cantidad) => {
    if (cantidad < 3) return "rgba(255,0,0,0.3)";
    if (cantidad < 5) return "rgba(255,165,0,0.3)";
    return "rgba(0,255,0,0.2)";
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#121212", color: "white" }}>
      <h2>📦 Listado de Inventario</h2>
      {inventario.length === 0 ? (
        <p>No hay items en el inventario.</p>
      ) : (
        <div>
          {inventario.map((item) => (
            <div
              key={item.item_id}
              style={{
                background: getColor(item.cantidad),
                padding: 10,
                marginBottom: 10,
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h3>{item.nombre} ({item.cantidad} {item.unidad})</h3>
                <p>{item.descripcion || "-"}</p>
                {item.imagen_url && (
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    style={{ width: "100px", borderRadius: "10px", marginTop: 5 }}
                  />
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <button onClick={() => cambiarCantidad(item, 1)}>➕</button>
                <button onClick={() => cambiarCantidad(item, -1)}>➖</button>
                <button onClick={() => eliminarItem(item.item_id)}>🗑️ Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListadoInventario;
