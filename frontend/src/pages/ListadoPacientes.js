import { useEffect, useState } from "react";
import { listarPacientes, buscarPacientes, actualizarPaciente } from "../services/api";
import "../App.css";

function ListadoPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null); // paciente que estamos editando
  const [form, setForm] = useState({}); // datos temporales al editar

  // Cargar últimos 10 pacientes
  useEffect(() => {
    async function fetchPacientes() {
      try {
        const data = await listarPacientes();
        if (Array.isArray(data)) setPacientes(data.slice(-10));
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      }
    }
    fetchPacientes();
  }, []);

  // Búsqueda en backend
  const handleBuscar = async (valor) => {
    setBusqueda(valor);
    if (!valor.trim()) {
      const data = await listarPacientes();
      setPacientes(data.slice(-10));
    } else {
      try {
        const resultados = await buscarPacientes(valor);
        setPacientes(resultados);
      } catch (error) {
        console.error("Error en buscarPacientes:", error);
      }
    }
  };

  // Activar edición inline
  const handleEditar = (paciente) => {
    setEditandoId(paciente._id);
    setForm(paciente);
  };

  // Guardar cambios
  const handleGuardar = async () => {
    try {
      await actualizarPaciente(editandoId, form);
      setPacientes((prev) =>
        prev.map((p) => (p._id === editandoId ? { ...form } : p))
      );
      setEditandoId(null);
    } catch (error) {
      console.error("Error al actualizar paciente:", error);
    }
  };

  return (
    <div className="listado-atenciones">
      <h2 className="titulo-atenciones">Pacientes</h2>
      <input
        type="text"
        placeholder="🔎 Buscar por nombre o cédula..."
        value={busqueda}
        onChange={(e) => handleBuscar(e.target.value)}
        className="input-buscar"
      />

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Fecha Registro</th>
            <th>Nombres Completos</th>
            <th>Estado Civil</th>
            <th>Domicilio</th>
            <th>E-mail</th>
            <th>CI</th>
            <th>Edad</th>
            <th>Sexo</th>
            <th>Origen</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p._id}>
              {["fecha_registro","nombres_completos","estado_civil","domicilio","email","ci","edad","sexo","origen","telefono"].map((campo) => (
                <td key={campo}>
                  {editandoId === p._id ? (
                    <input
                      type="text"
                      value={form[campo] ?? ""}
                      onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                    />
                  ) : (
                    p[campo] ?? ""
                  )}
                </td>
              ))}
              <td>
                {editandoId === p._id ? (
                  <>
                    <button onClick={handleGuardar} className="btn-guardar">💾Guardar</button>
                    <button onClick={() => setEditandoId(null)}className="btn-cancelar">❌Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => handleEditar(p)} className="btn-buscar">✏️Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListadoPacientes;
