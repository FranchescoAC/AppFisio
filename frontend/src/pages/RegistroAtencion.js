import { useState, useEffect } from "react";
import { listarPacientes, registrarAtencion } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../RegistroAtencion.css";
import "../App.css";

const antecedentesOpciones = [
  "DIABETES",
  "HEPATOPATÍA",
  "ASMA",
  "ENF. ENDOCRINAS",
  "HIPERTENSIÓN",
  "NEFROPATÍA",
  "CANCER",
  "CARDIOPATIA",
  "ENF. MENTALES",
  "ENF. ALÉRGICAS",
  "INTERROGADOS Y NEGADOS",
  "OTROS",
];

function RegistroAtencion() {
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [otrosAntecedente, setOtrosAntecedente] = useState("");
  const [form, setForm] = useState({
    paciente_id: "",
    fecha: new Date().toISOString().split("T")[0],
    motivo_consulta: "",
    antecedentes: [],
    notas: "",
  });
  const [nextAtencionId, setNextAtencionId] = useState("");

  // Cargar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await listarPacientes();
        setPacientes(data);
        setPacientesFiltrados(data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
        toast.error("❌ Error al cargar pacientes");
      }
    };
    fetchPacientes();
  }, []);

  // Filtrar pacientes por nombre, cédula o paciente_id
  useEffect(() => {
    if (!busqueda.trim()) {
      setPacientesFiltrados(pacientes);
      setForm((prev) => ({ ...prev, paciente_id: "" }));
      return;
    }

    const resultado = pacientes.filter((p) =>
      (p.nombres_completos ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.ci ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.paciente_id ?? "").toLowerCase().includes(busqueda.toLowerCase())
    );

    setPacientesFiltrados(resultado);

    if (resultado.length === 1) {
      setForm((prev) => ({ ...prev, paciente_id: resultado[0].paciente_id }));
    } else {
      setForm((prev) => ({ ...prev, paciente_id: "" }));
    }
  }, [busqueda, pacientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const toggleAntecedente = (opcion) => {
    let nuevos = [...form.antecedentes];
    if (nuevos.includes(opcion)) {
      nuevos = nuevos.filter((a) => a !== opcion);
      if (opcion === "OTROS") setOtrosAntecedente("");
    } else {
      nuevos.push(opcion);
    }
    setForm({ ...form, antecedentes: nuevos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.paciente_id) {
      toast.warn("⚠️ Selecciona un paciente primero");
      return;
    }

    // Si seleccionó OTROS, añadir el texto escrito
    let antecedentesFinal = [...form.antecedentes];
    if (antecedentesFinal.includes("OTROS") && otrosAntecedente.trim()) {
      antecedentesFinal = antecedentesFinal.map((a) =>
        a === "OTROS" ? `OTROS: ${otrosAntecedente}` : a
      );
    }

    try {
      const data = await registrarAtencion({
        ...form,
        antecedentes: antecedentesFinal,
      });
      setNextAtencionId(data.atencion_id);
      toast.success(`✅ Atención registrada con ID: ${data.atencion_id}`);
      setForm({
        paciente_id: "",
        fecha: new Date().toISOString().split("T")[0],
        motivo_consulta: "",
        antecedentes: [],
        notas: "",
      });
      setBusqueda("");
      setOtrosAntecedente("");
    } catch (error) {
      toast.error("❌ Error al registrar atención");
      console.error(error);
    }
  };

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="card">
          <h3 className="titulo-atenciones">Registrar Atención</h3>
          <p>
            Buscar Paciente - Próximo ID de Atención: <strong>{nextAtencionId || "A..."}</strong>
          </p>

          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            name="paciente_id"
            value={form.paciente_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona Paciente --</option>
            {pacientesFiltrados.map((p) => (
              <option key={p.paciente_id} value={p.paciente_id}>
                {p.nombres_completos} ({p.paciente_id})
              </option>
            ))}
          </select>

          <input
            name="fecha"
            type="date"
            onChange={handleChange}
            value={form.fecha}
            required
          />

          <textarea
            name="motivo_consulta"
            placeholder="Motivo de Consulta"
            value={form.motivo_consulta}
            onChange={handleChange}
            required
          />
        </div>

        <div className="card">
          <h3>Antecedentes</h3>
          <div className="chips-container">
            {antecedentesOpciones.map((a) => (
              <div
                key={a}
                className={`chip ${form.antecedentes.includes(a) ? "chip-selected" : ""}`}
                onClick={() => toggleAntecedente(a)}
              >
                {a}
              </div>
            ))}
          </div>
          {form.antecedentes.includes("OTROS") && (
            <input
              type="text"
              placeholder="Especificar OTROS..."
              value={otrosAntecedente}
              onChange={(e) => setOtrosAntecedente(e.target.value)}
            />
          )}
        </div>

        <div className="card">
          <h3>Notas Adicionales</h3>
          <textarea
            name="notas"
            placeholder="Notas adicionales"
            value={form.notas}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Registrar Atención
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default RegistroAtencion;
