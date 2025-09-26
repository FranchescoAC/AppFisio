import { useState, useEffect } from "react";
import {
  listarAtenciones,
  listarPacientes,
  buscarPacientes,
} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function ListadoAtenciones() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [atenciones, setAtenciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setquery] = useState("");
  const [pacientesMap, setPacientesMap] = useState({});
  const [editando, setEditando] = useState(null);
  const [formEdicion, setFormEdicion] = useState({
    motivo_consulta: "",
    antecedentes: "",
  });

  const navigate = useNavigate();

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

  // Búsqueda por texto
const handlequery = async () => {
  if (!query.trim()) return;
  try {
    setLoading(true);

    // 1️⃣ Buscar pacientes por query
    const pacientesEncontrados = await buscarPacientes(query);

    if (pacientesEncontrados.length === 0) {
      setAtenciones([]);
      return;
    }

    // 2️⃣ Por cada paciente encontrado, traer sus atenciones
    const promesasAtenciones = pacientesEncontrados.map((p) =>
      listarAtenciones(p.paciente_id)
    );

    const resultados = await Promise.all(promesasAtenciones);

    // 3️⃣ Aplanar todas las atenciones en un solo array
    const todasAtenciones = resultados.flat();

    setAtenciones(todasAtenciones);

  } catch (error) {
    toast.error("❌ Error en la búsqueda de atenciones");
    console.error(error);
  } finally {
    setLoading(false);
  }
};



  // Cargar atenciones al seleccionar paciente
// Búsqueda en tiempo real
useEffect(() => {
  const fetchBusqueda = async () => {
    setLoading(true);

    try {
      // Si no hay query, pero sí hay paciente seleccionado, listar sus atenciones
      if (!query.trim()) {
        if (pacienteId) {
          const data = await listarAtenciones(pacienteId);
          setAtenciones(Array.isArray(data) ? data : []);
        } else {
          setAtenciones([]);
        }
        return;
      }

      // 1️⃣ Buscar pacientes por query
      const pacientesEncontrados = await buscarPacientes(query);

      if (pacientesEncontrados.length === 0) {
        setAtenciones([]);
        return;
      }

      // 2️⃣ Por cada paciente encontrado, traer sus atenciones
      const promesasAtenciones = pacientesEncontrados.map((p) =>
        listarAtenciones(p.paciente_id)
      );

      const resultados = await Promise.all(promesasAtenciones);

      // 3️⃣ Aplanar todas las atenciones en un solo array
      const todasAtenciones = resultados.flat();

      setAtenciones(todasAtenciones);
    } catch (error) {
      toast.error("❌ Error en la búsqueda de atenciones");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Espera 300ms para evitar demasiadas llamadas al backend
  const timer = setTimeout(fetchBusqueda, 300);
  return () => clearTimeout(timer);
}, [query, pacienteId]);



  const handleEditar = (a) => {
    setEditando(a._id);
    setFormEdicion({
      motivo_consulta: a.motivo_consulta || "",
      antecedentes: a.antecedentes?.join(", ") || "",
    });
  };

  const handleGuardar = (id) => {
    // Aquí puedes llamar al API para actualizar
    const index = atenciones.findIndex((a) => a._id === id);
    if (index !== -1) {
      const nuevasAtenciones = [...atenciones];
      nuevasAtenciones[index].motivo_consulta = formEdicion.motivo_consulta;
      nuevasAtenciones[index].antecedentes = formEdicion.antecedentes
        ? formEdicion.antecedentes.split(",").map((a) => a.trim())
        : [];
      setAtenciones(nuevasAtenciones);
      toast.success("Atención actualizada");
      setEditando(null);
    }
  };

  const handleAgregarCita = (atencionId) => {
    navigate(`/cita/${atencionId}/new`);
  };

  return (
    <div className="listado-atenciones">
      <h2 className="titulo-atenciones">Historial de Atenciones</h2>

{/* Barra de búsqueda */}
<div style={{ marginBottom: "10px" }}>
  <input
    type="text"
    placeholder="Buscar por nombre o cédula..."
    value={query}
    onChange={(e) => setquery(e.target.value)}
  />
</div>


      {/* Selección de paciente */}
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
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Motivo Consulta</th>
              <th>Antecedentes</th>
              <th>Citas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.map((a) => (
              <tr key={a._id}>
                <td>{a.atencion_id || "-"}</td>
                <td>{pacientesMap[a.paciente_id] || a.paciente_id}</td>
                <td>{a.fecha}</td>
                <td>
                  {editando === a._id ? (
                    <input
                      value={formEdicion.motivo_consulta}
                      onChange={(e) =>
                        setFormEdicion({
                          ...formEdicion,
                          motivo_consulta: e.target.value,
                        })
                      }
                    />
                  ) : (
                    a.motivo_consulta || "-"
                  )}
                </td>
                <td>
                  {editando === a._id ? (
                    <input
                      value={formEdicion.antecedentes}
                      onChange={(e) =>
                        setFormEdicion({
                          ...formEdicion,
                          antecedentes: e.target.value,
                        })
                      }
                    />
                  ) : (
                    a.antecedentes?.join(", ") || "-"
                  )}
                </td>
                <td>
                  {a.citas && a.citas.length > 0 ? (
                    a.citas.map((c, index) => (
                      <div key={index}>
                        <Link
                          to={`/cita/${a._id}/${index}`}
                          className="link-cita"
                        >
                          Cita {index + 1}: {c.fecha}
                        </Link>
                      </div>
                    ))
                  ) : (
                    <span>No hay citas</span>
                  )}
                </td>
                <td>
                  {editando === a._id ? (
                    <button
                      onClick={() => handleGuardar(a._id)}
                      className="btn-buscar"
                    >
                      💾 Guardar
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditar(a)}
                        className="btn-buscar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleAgregarCita(a._id)}
                        className="btn-buscar"
                        style={{ marginLeft: "5px" }}
                      >
                        ➕ Agregar Cita
                      </button>
                    </>
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
