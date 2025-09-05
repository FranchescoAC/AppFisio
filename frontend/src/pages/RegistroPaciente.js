import { useState, useEffect } from "react";
import { registrarPaciente, obtenerSiguientePacienteId } from "../services/api";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";

function RegistroPaciente() {
  const [form, setForm] = useState({
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
  const [nextId, setNextId] = useState("");

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const data = await obtenerSiguientePacienteId();
        setNextId(data.next_paciente_id);
      } catch (error) {
        console.error("Error al obtener próximo ID:", error);
      }
    };
    fetchNextId();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await registrarPaciente(form);

    // 🔥 Solo toast, sin alert
    toast.success(`✅ Paciente registrado con ID: ${data.paciente_id}`);

    setForm({
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

    // actualizar nextId
    const next = await obtenerSiguientePacienteId();
    setNextId(next.next_paciente_id);

  } catch (error) {
    // ❌ también solo toast
    toast.error("❌ Error al registrar paciente");
  }
};


  return (
    <form onSubmit={handleSubmit} className="form-paciente">
      <h2>📝 Registro de Paciente</h2>
      <p>Próximo ID asignado: <strong>{nextId}</strong></p>

      <input name="fecha_registro" type="date" value={form.fecha_registro} onChange={handleChange} required />
      <input name="nombres_completos" placeholder="Nombres y Apellidos" value={form.nombres_completos} onChange={handleChange} required />
      <select name="estado_civil" value={form.estado_civil} onChange={handleChange}>
        <option value="soltero">Soltero</option>
        <option value="casado">Casado</option>
        <option value="divorciado">Divorciado</option>
        <option value="viudo">Viudo</option>
      </select>
      <input name="domicilio" placeholder="Domicilio" value={form.domicilio} onChange={handleChange} required />
      <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
      <input name="ci" placeholder="CI" value={form.ci} onChange={handleChange} required />
      <input name="edad" type="number" placeholder="Edad" value={form.edad} onChange={handleChange} required />
      <select name="sexo" value={form.sexo} onChange={handleChange}>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
      <input name="origen" placeholder="Origen" value={form.origen} onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
      <textarea name="motivo_consulta" placeholder="Motivo de consulta" value={form.motivo_consulta} onChange={handleChange} />

      <button type="submit">Registrar Paciente</button>
        <ToastContainer position="top-right" autoClose={3000}/>
    </form>
  );
}

export default RegistroPaciente;