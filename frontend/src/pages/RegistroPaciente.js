import { useState } from "react";
import { registrarPaciente } from "../services/api";
import "../RegistroAtencion.css"; 

function RegistroPaciente() {
  const [form, setForm] = useState({
    paciente_id: "",
    fecha_registro: "",
    nombres_completos: "",
    estado_civil: "soltero",
    domicilio: "",
    email: "",
    ci: "",
    edad: "",
    sexo: "Masculino",
    origen: "",
    telefono: "",
    motivo_consulta: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registrarPaciente(form);
      alert("Paciente registrado con éxito: " + data.id);
    } catch (error) {
      alert("Error al registrar paciente");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="paciente_id" placeholder="ID" onChange={handleChange} required />
      <input name="fecha_registro" type="date" onChange={handleChange} required />
      <input name="nombres_completos" placeholder="Nombres y Apellidos" onChange={handleChange} required />
      <select name="estado_civil" onChange={handleChange}>
        <option value="soltero">Soltero</option>
        <option value="casado">Casado</option>
        <option value="divorciado">Divorciado</option>
        <option value="viudo">Viudo</option>
      </select>
      <input name="domicilio" placeholder="Domicilio" onChange={handleChange} required />
      <input name="email" type="email" placeholder="E-mail" onChange={handleChange} required />
      <input name="ci" placeholder="CI" onChange={handleChange} required />
      <input name="edad" type="number" placeholder="Edad" onChange={handleChange} required />
      <select name="sexo" onChange={handleChange}>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
      <input name="origen" placeholder="Origen" onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
      <textarea name="motivo_consulta" placeholder="Motivo de consulta" onChange={handleChange} />
      <button type="submit">Registrar Paciente</button>
    </form>
  );
}

export default RegistroPaciente;
