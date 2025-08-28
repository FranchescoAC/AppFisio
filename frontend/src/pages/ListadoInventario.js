import React, { useEffect, useState } from "react";
import { getInventario } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListadoInventario = () => {
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
      toast.error("No se pudo cargar el inventario", { position: "top-right" });
    }
  };

  const getColor = (cantidad) => {
    if (cantidad < 3) return "rgba(255,0,0,0.3)";
    if (cantidad < 5) return "rgba(255,165,0,0.3)";
    return "rgba(0,255,0,0.2)";
  };

  return (
    <div style={{ padding: 20, background: "#121212", color: "white", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>📦 Inventario Disponible</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
        {inventario.map(item => (
          <div
            key={item.item_id}
            style={{
              background: getColor(item.cantidad),
              padding: 15,
              borderRadius: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h3>{item.nombre}</h3>
            {item.imagen_url && (
              <img
                src={item.imagen_url}
                alt={item.nombre}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              />
            )}
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>💲{item.precio_venta?.toFixed(2)}</p>
            <p>Stock: {item.cantidad} {item.unidad}</p>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ListadoInventario;
