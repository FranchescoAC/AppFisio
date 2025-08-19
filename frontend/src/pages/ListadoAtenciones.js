import { useState, useEffect } from "react";
import { listarAtenciones, listarPacientes, buscarAtenciones } from "../services/api";

function ListadoAtenciones() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [atenciones, setAtenciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pacientesMap, setPacientesMap] = useState({}); // <--- Diccionario para nombres

  // Traer todos los pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await listarPacientes();
        setPacientes(data);

        // Construir diccionario paciente_id -> nombres_completos
        const map = {};
        data.forEach((p) => {
          map[p.paciente_id] = p.nombres_completos;
        });
        setPacientesMap(map);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    };
    fetchPacientes();
  }, []);

  // búsqueda de atenciones por paciente_id
  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const data = await buscarAtenciones({ paciente_id: search });
      setAtenciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error en la búsqueda de atenciones:", error);
    }
  };

  useEffect(() => {
    if (!pacienteId) return;
    setLoading(true);
    const fetchAtenciones = async () => {
      try {
        const data = await listarAtenciones(pacienteId);
        setAtenciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar atenciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAtenciones();
  }, [pacienteId]);

  return (
    <div className="listado-atenciones">
      <h2>Historial de Atenciones</h2>

      {/* 🔎 Barra de búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar atenciones por paciente_id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      <label>Seleccione Paciente: </label>
      <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
        <option value="">-- Seleccione --</option>
        {pacientes.map((p) => (
          <option key={p.paciente_id} value={p.paciente_id}>
            {p.nombres_completos} ({p.paciente_id})
          </option>
        ))}
      </select>

      {loading && <p>Cargando atenciones...</p>}

      {atenciones.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Paciente</th> {/* <-- Nueva columna */}
              <th>Fecha</th>
              <th>Fisioterapeuta</th>
              <th>Motivo Consulta</th>
              <th>Antecedentes</th>
              <th>Signos Vitales</th>
              <th>Diagnóstico / Tratamiento</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.map((a) => (
              <tr key={a._id}>
                <td>{pacientesMap[a.paciente_id] || a.paciente_id}</td> {/* <-- Mostrar nombre */}
                <td>{a.fecha}</td>
                <td>{a.quien_atiende}</td>
                <td>{a.motivo_consulta}</td>
                <td>{a.antecedentes ? a.antecedentes.join(", ") : "-"}</td>
                <td>
                  <p><strong>T/A:</strong> {a.signos_vitales?.tension_arterial || "-"}</p>
                  <p><strong>Temp:</strong> {a.signos_vitales?.temperatura || "-"}</p>
                  <p><strong>FC:</strong> {a.signos_vitales?.frecuencia_cardiaca || "-"}</p>
                  <p><strong>FR:</strong> {a.signos_vitales?.frecuencia_respiratoria || "-"}</p>
                  <p><strong>Peso:</strong> {a.signos_vitales?.peso || "-"} kg</p>
                  <p><strong>Talla:</strong> {a.signos_vitales?.talla || "-"} cm</p>
                </td>
                <td>
                  <strong>Diagnóstico:</strong> {a.diagnostico || "-"} <br />
                  <strong>Tratamiento:</strong> {a.tratamiento || "-"} <br />
                  <strong>Notas:</strong> {a.notas || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && pacienteId && atenciones.length === 0 && <p>No hay atenciones registradas.</p>}
    </div>
  );
}

export default ListadoAtenciones;
