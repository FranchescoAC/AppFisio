import React, { useEffect, useState } from "react";
import { getInventario } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

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

return (
  <div className="section-container">
    <h2 className="titulo-atenciones">📦 Inventario Disponible</h2>
    <div>
      {inventario.map(item => (
        <div key={item.item_id} className="item-card">
          <h3>{item.nombre}</h3>
          {item.imagen_url && (
            <img src={item.imagen_url} alt={item.nombre} />
          )}
          <p>🚀 Stock: {item.cantidad} {item.unidad}</p>
          <p>💲 Precio venta: ${item.precio_venta}</p>
        </div>
      ))}
    </div>
    <ToastContainer />
  </div>
);
};

export default ListadoInventario;
