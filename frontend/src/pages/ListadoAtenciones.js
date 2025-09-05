import { useState, useEffect } from "react";
import {
  listarAtenciones,
  listarPacientes,
  buscarAtenciones,
  updateAtencion,
} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function ListadoAtenciones() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [atenciones, setAtenciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pacientesMap, setPacientesMap] = useState({});
  const [editando, setEditando] = useState(null); // atención en edición
  const [formEdicion, setFormEdicion] = useState({
    fase_intermedia: "",
    fase_final: "",
    notas: "",
  });

  // Traer todos los pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await listarPacientes();
        setPacientes(data);

        const map = {};
        data.forEach((p) => {
          map[p.paciente_id] = p.nombres_completos;
        });
        setPacientesMap(map);
      } catch (error) {
        toast.error("❌ Error al cargar pacientes");
      }
    };
    fetchPacientes();
  }, []);

  // búsqueda de atenciones
  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      setLoading(true);
      const data = await buscarAtenciones({ query: search });
      setAtenciones(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("❌ Error en la búsqueda de atenciones");
    } finally {
      setLoading(false);
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
        toast.error("❌ Error al cargar atenciones");
      } finally {
        setLoading(false);
      }
    };
    fetchAtenciones();
  }, [pacienteId]);

  // Habilitar edición
  const handleEditar = (a) => {
    setEditando(a._id);
    setFormEdicion({
      fase_intermedia: a.tratamiento?.fase_intermedia || "",
      fase_final: a.tratamiento?.fase_final || "",
      notas: a.notas || "",
    });
  };

  // Guardar cambios
// Guardar cambios
const handleGuardar = async (id) => {
  try {
    // Ojo: notas va fuera de tratamiento
    const payload = {
      tratamiento: {
        // mantenemos lo que el usuario editó
        fase_intermedia: formEdicion.fase_intermedia || undefined,
        fase_final: formEdicion.fase_final || undefined,
      },
      notas: formEdicion.notas || undefined,
    };

    await updateAtencion(id, payload);

    setAtenciones((prev) =>
      prev.map((a) =>
        a._id === id
          ? {
              ...a,
              tratamiento: {
                ...a.tratamiento,
                fase_intermedia: formEdicion.fase_intermedia,
                fase_final: formEdicion.fase_final,
              },
              notas: formEdicion.notas,
            }
          : a
      )
    );
    setEditando(null);
    toast.success("Atención actualizada");
  } catch (error) {
    toast.error("❌ Error al actualizar atención");
  }
};

  return (
    <div className="listado-atenciones">
      <h2 className="titulo-atenciones">Historial de Atenciones</h2>

      {/* 🔎 Barra de búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar atenciones por paciente_id o nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch} className="btn-buscar">🔎 Buscar</button>

      </div>

      <label>Seleccione Paciente: </label>
      <select
        value={pacienteId}
        onChange={(e) => setPacienteId(e.target.value)}
      >
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
              <th>Atención</th>
              <th>Paciente</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Fisioterapeuta</th>
              <th>Motivo Consulta</th>
              <th>Antecedentes</th>
              <th>Signos Vitales</th>
              <th>Tratamiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.map((a) => (
              <tr key={a._id}>
                <td>{a.atencion_id || "-"}</td>
                <td>{a.paciente_id}</td>
                <td>{pacientesMap[a.paciente_id] || a.paciente_id}</td>
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
                  {editando === a._id ? (
                    <>
                      <textarea
                        placeholder="Fase intermedia"
                        value={formEdicion.fase_intermedia}
                        onChange={(e) =>
                          setFormEdicion({
                            ...formEdicion,
                            fase_intermedia: e.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Fase final"
                        value={formEdicion.fase_final}
                        onChange={(e) =>
                          setFormEdicion({
                            ...formEdicion,
                            fase_final: e.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Notas"
                        value={formEdicion.notas}
                        onChange={(e) =>
                          setFormEdicion({
                            ...formEdicion,
                            notas: e.target.value,
                          })
                        }
                      />
                    </>
                  ) : (
                    <>
                      <strong>Inicial:</strong>{" "}
                      {a.tratamiento?.fase_inicial || "-"} <br />
                      <strong>Intermedia:</strong>{" "}
                      {a.tratamiento?.fase_intermedia || "-"} <br />
                      <strong>Final:</strong>{" "}
                      {a.tratamiento?.fase_final || "-"} <br />
                      <strong>Notas:</strong> {a.notas || "-"}
                    </>
                  )}
                </td>
                <td>
                  {editando === a._id ? (
                  <button onClick={() => handleGuardar(a._id)} className="btn-buscar">💾 Guardar</button>
                    
                  ) : (
                   <button onClick={() => handleEditar(a)} className="btn-buscar">✏️ Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && pacienteId && atenciones.length === 0 && (
        <p>No hay atenciones registradas.</p>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
}

export default ListadoAtenciones;
