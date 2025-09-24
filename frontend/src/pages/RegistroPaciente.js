import { useState, useEffect } from "react";
import { registrarPaciente, obtenerSiguientePacienteId } from "../services/api";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";

function RegistroPaciente() {
  const [form, setForm] = useState({
    fecha_registro: new Date().toISOString().split("T")[0],
    nombres_completos: null,
    estado_civil: "soltero",
    domicilio: null,
    email: null,
    ci: null,
    edad: null,
    sexo: "Masculino",
    origen: null,
    telefono: null,
    motivo_consulta: null,
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
    const value = e.target.value === "" ? null : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registrarPaciente(form);
      toast.success(`✅ Paciente registrado con ID: ${data.paciente_id}`);

      setForm({
        fecha_registro: new Date().toISOString().split("T")[0],
        nombres_completos: null,
        estado_civil: "soltero",
        domicilio: null,
        email: null,
        ci: null,
        edad: null,
        sexo: "Masculino",
        origen: null,
        telefono: null,
        motivo_consulta: null,
      });

      const next = await obtenerSiguientePacienteId();
      setNextId(next.next_paciente_id);

    } catch (error) {
      console.error("Error en registro:", error);

      let msg = error?.message || JSON.stringify(error);
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-paciente">
      <h2>📝 Registro de Paciente</h2>
      <p>Próximo ID asignado: <strong>{nextId}</strong></p>

      <input name="fecha_registro" type="date" value={form.fecha_registro} onChange={handleChange} />
      <input name="nombres_completos" placeholder="Nombres y Apellidos" value={form.nombres_completos || ""} onChange={handleChange} />
      <select name="estado_civil" value={form.estado_civil} onChange={handleChange}>
        <option value="soltero">Soltero</option>
        <option value="casado">Casado</option>
        <option value="divorciado">Divorciado</option>
        <option value="viudo">Viudo</option>
      </select>
      <input name="domicilio" placeholder="Domicilio" value={form.domicilio || ""} onChange={handleChange} />
      <input name="email" placeholder="E-mail" value={form.email || ""} onChange={handleChange} />
      <input name="ci" placeholder="CI" value={form.ci || ""} onChange={handleChange} />
      <input name="edad" type="number" placeholder="Edad" value={form.edad || ""} onChange={handleChange} />
      <select name="sexo" value={form.sexo} onChange={handleChange}>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
      <input name="origen" placeholder="Ciudad" value={form.origen || ""} onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono || ""} onChange={handleChange} />
      
      <button type="submit">Registrar Paciente</button>
      <ToastContainer position="top-right" autoClose={3000}/>
    </form>
  );
}

export default RegistroPaciente;
