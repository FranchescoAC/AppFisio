import { useState, useEffect } from "react";
import { listarAtenciones, listarPacientes } from "../services/api";
import "../ListadoAtenciones.css"; 

function ListadoAtenciones() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [atenciones, setAtenciones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await listarPacientes();
        setPacientes(data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    };
    fetchPacientes();
  }, []);

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
                <td>{a.fecha}</td>
                <td>{a.quien_atiende}</td>
                <td>{a.motivo_consulta}</td>
                <td>{a.antecedentes ? a.antecedentes.join(", ") : "-"}</td>
<td>
  <div><strong>T/A:</strong> {a.signos_vitales.tension_arterial}</div>
  <div><strong>Temp:</strong> {a.signos_vitales.temperatura}°C</div>
  <div><strong>FC:</strong> {a.signos_vitales.frecuencia_cardiaca} lpm</div>
  <div><strong>FR:</strong> {a.signos_vitales.frecuencia_respiratoria} rpm</div>
  <div><strong>Peso:</strong> {a.signos_vitales.peso} kg</div>
  <div><strong>Talla:</strong> {a.signos_vitales.talla} cm</div>
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
