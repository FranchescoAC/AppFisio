import React, { useEffect, useState } from "react";
import {
  getInventario,
  addItem,
  updateItem,
  deleteItem,
  registrarVenta,
} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const RegistroInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [nuevoItem, setNuevoItem] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    unidad: "",
    imagen_url: "",
    precio_compra: 0,
    precio_venta: 0,
  });

  const [cantidadesVenta, setCantidadesVenta] = useState({});
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
      precio_venta: parseFloat(nuevoItem.precio_venta) || 0,
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
        precio_venta: 0,
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
      setInventario((prev) =>
        prev.map((i) => (i.item_id === item.item_id ? actualizado : i))
      );
    } catch (error) {
      console.error("Error actualizando stock:", error);
      toast.error("No se pudo actualizar el stock");
    }
  };

  // ✅ Eliminar con confirmación en toast
  const eliminarItem = (item_id) => {
    toast.info(
      <div style={{ color: "white" }}>
        <p>¿Seguro que quieres eliminar este producto?</p>
        <button
          style={{
            marginRight: "10px",
            background: "#d9534f",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={async () => {
            try {
              await deleteItem(item_id);
              setInventario((prev) => prev.filter((i) => i.item_id !== item_id));
              toast.success("🗑️ Producto eliminado");
            } catch (error) {
              toast.error("❌ No se pudo eliminar el producto");
            }
            toast.dismiss();
          }}
        >
          ✅ Confirmar
        </button>
        <button
          style={{
            background: "#6c757d",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => toast.dismiss()}
        >
          ❌ Cancelar
        </button>
      </div>,
      { autoClose: false }
    );
  };

  // ✅ Vender con confirmación en toast
  const venderItem = (item) => {
    const cantidad = cantidadesVenta[item.item_id] || 1;

    if (item.cantidad < cantidad) {
      toast.error("❌ No hay stock suficiente", { position: "top-right" });
      return;
    }

    toast.info(
      <div style={{ color: "white" }}>
        <p>
          ¿Confirmar venta de {cantidad} {item.unidad} de {item.nombre}?
        </p>
        <button
          style={{
            marginRight: "10px",
            background: "#20BFA9",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={async () => {
            try {
              await registrarVenta({
                item_id: item.item_id,
                cantidad,
                precio_unitario: item.precio_venta,
              });
              await cargarInventario();
              setCantidadesVenta((prev) => ({ ...prev, [item.item_id]: 1 }));
              toast.success(`✅ Vendido ${cantidad} ${item.unidad} de ${item.nombre}`);
            } catch (error) {
              toast.error("❌ No se pudo realizar la venta");
            }
            toast.dismiss();
          }}
        >
          ✅ Confirmar
        </button>
        <button
          style={{
            background: "#6c757d",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => toast.dismiss()}
        >
          ❌ Cancelar
        </button>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <div className="section-container">
      <h2>📦 Inventario</h2>

      <button onClick={() => setMostrarRegistro(!mostrarRegistro)}>
        {mostrarRegistro ? "❌ Cerrar Registro" : "➕ Abrir Registro de Inventario"}
      </button>

      {mostrarRegistro && (
        <div className="item-card">
          {/* Inputs aquí */}
          <button onClick={handleAdd} className="sell-btn">
            ➕ Agregar
          </button>
        </div>
      )}

      <div>
        {inventario.map((item) => (
          <div key={item.item_id} className="item-card">
            <h3>{item.nombre}</h3>
            {item.imagen_url && <img src={item.imagen_url} alt={item.nombre} />}
            <p>🚀 Stock: {item.cantidad} {item.unidad}</p>
            <p>💲 Precio venta: ${item.precio_venta}</p>

            <div className="item-actions">
              <input
                type="number"
                min="1"
                max={item.cantidad}
                value={cantidadesVenta[item.item_id] || 1}
                onChange={(e) =>
                  setCantidadesVenta((prev) => ({
                    ...prev,
                    [item.item_id]: parseInt(e.target.value) || 1,
                  }))
                }
              />
              <button onClick={() => venderItem(item)} className="sell-btn">
                💸 Vender
              </button>
            </div>

            <div className="item-actions">
              <button onClick={() => cambiarCantidad(item, 1)} className="stock-btn">
                ➕ Stock
              </button>
              <button onClick={() => cambiarCantidad(item, -1)} className="stock-btn">
                ➖ Stock
              </button>
            </div>

            <button onClick={() => eliminarItem(item.item_id)} className="delete-btn">
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Toast con texto blanco */}
      <ToastContainer
        toastStyle={{ backgroundColor: "#333", color: "white" }}
        position="top-right"
        autoClose={3000}
      />
    </div>
  );
};

export default RegistroInventario;
