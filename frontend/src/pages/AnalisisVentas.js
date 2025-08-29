import React, { useEffect, useState } from "react";
import { getVentas } from "../services/api";

const AnalisisVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [masVendido, setMasVendido] = useState(null);
  const [menosVendido, setMenosVendido] = useState(null);

  useEffect(() => {
    const cargarVentas = async () => {
      const data = await getVentas();
      if (Array.isArray(data)) {
        setVentas(data);

        // Agrupar por producto
        const resumen = {};
        data.forEach((v) => {
          if (!resumen[v.item_id]) {
            resumen[v.item_id] = { ...v, totalCantidad: 0 };
          }
          resumen[v.item_id].totalCantidad += v.cantidad;
        });

        const productos = Object.values(resumen);

        if (productos.length > 0) {
          const max = productos.reduce((a, b) =>
            a.totalCantidad > b.totalCantidad ? a : b
          );
          const min = productos.reduce((a, b) =>
            a.totalCantidad < b.totalCantidad ? a : b
          );

          setMasVendido(max);
          setMenosVendido(min);
        }
      }
    };
    cargarVentas();
  }, []);

  const totalVendido = ventas.reduce((sum, v) => sum + v.cantidad, 0);
  const gananciaTotal = ventas.reduce(
    (sum, v) => sum + v.cantidad * v.precio_unitario,
    0
  );

  return (
    <div style={{ padding: 20, background: "#121212", color: "white" }}>
      <h2>📊 Análisis de Ventas</h2>
      <h3>
        Total Vendido: {totalVendido} | Ganancia Total: $
        {gananciaTotal.toFixed(2)}
      </h3>

      {/* Productos destacados */}
      {masVendido && (
        <div
          style={{
            background: "rgba(0,255,0,0.2)",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          <h3>🔥 Producto más vendido</h3>
          <p>
            <strong>{masVendido.item_id}</strong>
          </p>
          <p>Cantidad total: {masVendido.totalCantidad}</p>
        </div>
      )}

      {menosVendido && (
        <div
          style={{
            background: "rgba(255,0,0,0.2)",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          <h3>📉 Producto menos vendido</h3>
          <p>
            <strong>{menosVendido.item_id}</strong>
          </p>
          <p>Cantidad total: {menosVendido.totalCantidad}</p>
        </div>
      )}

      {/* Listado normal de ventas */}
      {ventas.map((v) => (
        <div
          key={v.venta_id}
          style={{
            background: "rgba(0, 128, 255, 0.2)",
            padding: 10,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
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
