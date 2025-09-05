import { useEffect, useState } from "react";
import { listarPacientes } from "../services/api";
import "../App.css";

function ListadoPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const data = await listarPacientes();
        setPacientes(data);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      }
    }
    fetchPacientes();
  }, []);

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombres_completos?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2>Listado de Pacientes</h2>
      <input
        type="text"
        placeholder="🔎 Buscar paciente por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="input-buscar"
      />

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
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
            <th>Motivo Consulta</th>
          </tr>
        </thead>
        <tbody>
          {pacientesFiltrados.map((p) => (
            <tr key={p._id || p.paciente_id || Math.random()}>
              <td>{p.paciente_id ?? ""}</td>
              <td>{p.fecha_registro ?? ""}</td>
              <td>{p.nombres_completos ?? ""}</td>
              <td>{p.estado_civil ?? ""}</td>
              <td>{p.domicilio ?? ""}</td>
              <td>{p.email ?? ""}</td>
              <td>{p.ci ?? ""}</td>
              <td>{p.edad ?? ""}</td>
              <td>{p.sexo ?? ""}</td>
              <td>{p.origen ?? ""}</td>
              <td>{p.telefono ?? ""}</td>
              <td>{p.motivo_consulta ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListadoPacientes;
