import React, { useEffect, useState } from "react";
import { getVentas } from "../services/api";

const AnalisisVentas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const cargarVentas = async () => {
      const data = await getVentas();
      setVentas(Array.isArray(data) ? data : []);
    };
    cargarVentas();
  }, []);

  const totalVendido = ventas.reduce((sum, v) => sum + v.cantidad, 0);
  const gananciaTotal = ventas.reduce((sum, v) => sum + (v.cantidad * v.precio_unitario), 0);

  return (
    <div style={{ padding: 20, background: "#121212", color: "white" }}>
      <h2>📊 Análisis de Ventas</h2>
      <h3>Total Vendido: {totalVendido} | Ganancia Total: ${gananciaTotal.toFixed(2)}</h3>

      {ventas.map(v => (
        <div key={v.venta_id} style={{
          background: "rgba(0, 128, 255, 0.2)",
          padding: 10,
          marginBottom: 10,
          borderRadius: 10
        }}>
          <p>Producto: {v.item_id}</p>
          <p>Cantidad: {v.cantidad}</p>
          <p>Precio unitario: ${v.precio_unitario}</p>
          <p>Fecha: {new Date(v.fecha).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalisisVentas;