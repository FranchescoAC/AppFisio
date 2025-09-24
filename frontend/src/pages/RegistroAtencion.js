import { useState, useEffect } from "react";
import { listarPacientes, registrarAtencion } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../RegistroAtencion.css";
import "../App.css";

const antecedentesOpciones = [
  "DIABETES", "HEPATOPATÍA", "ASMA", "ENF. ENDOCRINAS",
  "HIPERTENSIÓN", "NEFROPATÍA", "CANCER", "CARDIOPATIA",
  "ENF. MENTALES", "ENF. ALÉRGICAS", "INTERROGADOS Y NEGADOS", "OTROS"
];

const fisioterapeutas = ["ELINA", "MARITZA", "ALAN"];

function RegistroAtencion() {
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState({
    paciente_id: "",
    fecha: "",
    quien_atiende: "",
    motivo_consulta: "",
    antecedentes: [],
    signos_vitales: {
      tension_arterial: "",
      temperatura: "",
      frecuencia_cardiaca: "",
      frecuencia_respiratoria: "",
      peso: "",
      talla: "",
    },
    tratamiento: {
      fase_inicial: "",
      fase_intermedia: "",
      fase_final: ""
    },
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

  // Filtrar automáticamente al escribir
  useEffect(() => {
    if (!busqueda.trim()) {
      setPacientesFiltrados(pacientes);
      setForm((prev) => ({ ...prev, paciente_id: "" }));
      return;
    }

    const resultado = pacientes.filter((p) =>
      p.nombres_completos.toLowerCase().includes(busqueda.toLowerCase())
    );

    setPacientesFiltrados(resultado);

    // Si hay solo un paciente, seleccionarlo automáticamente
    if (resultado.length === 1) {
      setForm((prev) => ({ ...prev, paciente_id: resultado[0].paciente_id }));
    } else {
      setForm((prev) => ({ ...prev, paciente_id: "" }));
    }
  }, [busqueda, pacientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.signos_vitales) {
      setForm({ ...form, signos_vitales: { ...form.signos_vitales, [name]: value } });
    } else if (name.startsWith("fase_")) {
      setForm({
        ...form,
        tratamiento: { ...form.tratamiento, [name]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAntecedentes = (e) => {
    const { value, checked } = e.target;
    let nuevosAntecedentes = [...form.antecedentes];
    if (checked) nuevosAntecedentes.push(value);
    else nuevosAntecedentes = nuevosAntecedentes.filter(a => a !== value);
    setForm({ ...form, antecedentes: nuevosAntecedentes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.paciente_id) {
      toast.warn("⚠️ Selecciona un paciente primero");
      return;
    }
    if (!form.tratamiento.fase_inicial) {
      toast.warn("⚠️ La fase inicial del tratamiento es obligatoria");
      return;
    }
    try {
      const data = await registrarAtencion(form);
      setNextAtencionId(data.atencion_id);

      toast.success(`Atención registrada con ID: ${data.atencion_id}`);

      setForm({
        paciente_id: "",
        fecha: "",
        quien_atiende: "",
        motivo_consulta: "",
        antecedentes: [],
        signos_vitales: {
          tension_arterial: "",
          temperatura: "",
          frecuencia_cardiaca: "",
          frecuencia_respiratoria: "",
          peso: "",
          talla: "",
        },
        tratamiento: { fase_inicial: "", fase_intermedia: "", fase_final: "" },
        notas: "",
      });
      setBusqueda("");
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
          <p>Próximo ID de Atención: <strong>{nextAtencionId || "A..."}</strong></p>

          {/* Barra de búsqueda automática */}
          <input
            type="text"
            placeholder="Buscar paciente por nombre..."
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
            {pacientesFiltrados.map(p => (
              <option key={p.paciente_id} value={p.paciente_id}>
                {p.nombres_completos} ({p.paciente_id})
              </option>
            ))}
          </select>

          <input name="fecha" type="date" onChange={handleChange} value={form.fecha} required />
          <select name="quien_atiende" value={form.quien_atiende} onChange={handleChange} required>
            <option value="">-- Seleccione Fisioterapeuta --</option>
            {fisioterapeutas.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <textarea name="motivo_consulta" placeholder="Motivo de Consulta" value={form.motivo_consulta} onChange={handleChange} required />
        </div>

        <div className="card">
          <h3>Antecedentes</h3>
          <div className="checkbox-grid">
            {antecedentesOpciones.map(a => (
              <label key={a}>
                <input
                  type="checkbox"
                  value={a}
                  checked={form.antecedentes.includes(a)}
                  onChange={handleAntecedentes}
                />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Signos Vitales</h3>
          <input name="tension_arterial" placeholder="Tensión Arterial" value={form.signos_vitales.tension_arterial} onChange={handleChange} />
          <input name="temperatura" placeholder="Temperatura" value={form.signos_vitales.temperatura} onChange={handleChange} />
          <input name="frecuencia_cardiaca" type="number" placeholder="Frecuencia Cardíaca" value={form.signos_vitales.frecuencia_cardiaca} onChange={handleChange} />
          <input name="frecuencia_respiratoria" type="number" placeholder="Frecuencia Respiratoria" value={form.signos_vitales.frecuencia_respiratoria} onChange={handleChange} />
          <input name="peso" type="number" placeholder="Peso (kg)" value={form.signos_vitales.peso} onChange={handleChange} />
          <input name="talla" type="number" placeholder="Talla (cm)" value={form.signos_vitales.talla} onChange={handleChange} />
        </div>

        <div className="card">
          <h3>Tratamiento</h3>
          <textarea
            name="fase_inicial"
            placeholder="Fase Inicial (Obligatoria)"
            value={form.tratamiento.fase_inicial}
            onChange={handleChange}
            required
          />
          <textarea
            name="fase_intermedia"
            placeholder="Fase Intermedia (Opcional)"
            value={form.tratamiento.fase_intermedia}
            onChange={handleChange}
          />
          <textarea
            name="fase_final"
            placeholder="Fase Final (Opcional)"
            value={form.tratamiento.fase_final}
            onChange={handleChange}
          />
          <textarea name="notas" placeholder="Notas adicionales" value={form.notas} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn">Registrar Atención</button>
      </form>

      {/* Contenedor de Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default RegistroAtencion;
