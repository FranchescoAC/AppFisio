import { useState } from "react";
import { registrarAtencion } from "../services/api";
import "../RegistroAtencion.css"; // Asegúrate de crear este CSS

const antecedentesOpciones = [
  "DIABETES", "HEPATOPATÍA", "ASMA", "ENF. ENDOCRINAS",
  "HIPERTENSIÓN", "NEFROPATÍA", "CANCER", "CARDIOPATIA",
  "ENF. MENTALES", "ENF. ALÉRGICAS", "INTERROGADOS Y NEGADOS", "OTROS"
];

const fisioterapeutas = ["ELINA", "MARITZA", "ALAN"];

function RegistroAtencion({ paciente_id }) {
  const [form, setForm] = useState({
    paciente_id: paciente_id || "",
    fecha: "",
    diagnostico: "",
    tratamiento: "",
    notas: "",
    antecedentes: [],
    signos_vitales: {
      tension_arterial: "",
      temperatura: "",
      frecuencia_cardiaca: "",
      frecuencia_respiratoria: "",
      peso: "",
      talla: "",
    },
    quien_atiende: fisioterapeutas[0],
    motivo_consulta: ""
  });

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
    try {
      const data = await registrarAtencion(form);
      alert("Atención registrada con éxito: " + data.id);
    } catch (error) {
      alert("Error al registrar atención");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="card">
        <h3>Información General</h3>
        <input name="paciente_id" placeholder="ID Paciente" value={form.paciente_id} onChange={handleChange} required />
        <input name="fecha" type="date" onChange={handleChange} required />
        <select name="quien_atiende" value={form.quien_atiende} onChange={handleChange}>
          {fisioterapeutas.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <textarea name="motivo_consulta" placeholder="Motivo de Consulta" onChange={handleChange} required />
      </div>

      <div className="card">
        <h3>Antecedentes</h3>
        <div className="checkbox-grid">
          {antecedentesOpciones.map((a) => (
            <label key={a}>
              <input type="checkbox" value={a} checked={form.antecedentes.includes(a)} onChange={handleAntecedentes} />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Signos Vitales</h3>
        <input name="tension_arterial" placeholder="Tensión Arterial" onChange={handleChange} />
        <input name="temperatura" placeholder="Temperatura" onChange={handleChange} />
        <input name="frecuencia_cardiaca" type="number" placeholder="Frecuencia Cardíaca" onChange={handleChange} />
        <input name="frecuencia_respiratoria" type="number" placeholder="Frecuencia Respiratoria" onChange={handleChange} />
        <input name="peso" type="number" placeholder="Peso (kg)" onChange={handleChange} />
        <input name="talla" type="number" placeholder="Talla (cm)" onChange={handleChange} />
      </div>

      <div className="card">
        <h3>Diagnóstico y Tratamiento</h3>
        <textarea name="diagnostico" placeholder="Diagnóstico" onChange={handleChange} required />
        <textarea name="tratamiento" placeholder="Tratamiento" onChange={handleChange} required />
        <textarea name="notas" placeholder="Notas adicionales" onChange={handleChange} />
      </div>

      <button type="submit" className="submit-btn">Registrar Atención</button>
    </form>
  );
}

export default RegistroAtencion;
