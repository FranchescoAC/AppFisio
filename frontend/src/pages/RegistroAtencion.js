import { useState, useEffect } from "react";
import { listarPacientes, registrarAtencion } from "../services/api";
import "../RegistroAtencion.css"; // Asegúrate de tener este CSS

const antecedentesOpciones = [
  "DIABETES", "HEPATOPATÍA", "ASMA", "ENF. ENDOCRINAS",
  "HIPERTENSIÓN", "NEFROPATÍA", "CANCER", "CARDIOPATIA",
  "ENF. MENTALES", "ENF. ALÉRGICAS", "INTERROGADOS Y NEGADOS", "OTROS"
];

const fisioterapeutas = ["ELINA", "MARITZA", "ALAN"];

function RegistroAtencion() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    paciente_id: "",
    fecha: "",
    quien_atiende: "",
    motivo_consulta: "",
    antecedentes: [],
    signos_vitales: {
      tension_arterial: "",
      temperatura: "",
      frecuencia_cardiaca: 0,
      frecuencia_respiratoria: 0,
      peso: 0,
      talla: 0,
    },
    diagnostico: "",
    tratamiento: "",
    notas: "",
  });

  // Cargar pacientes para el select
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.signos_vitales) {
      setForm({ ...form, signos_vitales: { ...form.signos_vitales, [name]: value } });
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
      alert("Selecciona un paciente primero");
      return;
    }
    try {
      const data = await registrarAtencion(form);
      alert(`Atención registrada: ${data.atencion_id}`);
      // Reset form si quieres
      setForm({ ...form, fecha: "", quien_atiende: "", motivo_consulta: "", antecedentes: [], signos_vitales: { tension_arterial: "", temperatura: "", frecuencia_cardiaca: 0, frecuencia_respiratoria: 0, peso: 0, talla: 0 }, diagnostico: "", tratamiento: "", notas: "" });
    } catch (error) {
      alert("Error al registrar atención");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="card">
        <h3>Información General</h3>
        <select
          name="paciente_id"
          value={form.paciente_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecciona Paciente --</option>
          {pacientes.map(p => (
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
        <h3>Diagnóstico y Tratamiento</h3>
        <textarea name="diagnostico" placeholder="Diagnóstico" value={form.diagnostico} onChange={handleChange} required />
        <textarea name="tratamiento" placeholder="Tratamiento" value={form.tratamiento} onChange={handleChange} required />
        <textarea name="notas" placeholder="Notas adicionales" value={form.notas} onChange={handleChange} />
      </div>

      <button type="submit" className="submit-btn">Registrar Atención</button>
    </form>
  );
}

export default RegistroAtencion;
