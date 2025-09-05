import { useState, useEffect } from "react";
import { registrarPaciente, obtenerSiguientePacienteId } from "../services/api";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";

function RegistroPaciente() {
  const [form, setForm] = useState({
    fecha_registro: new Date().toISOString().split("T")[0], // ✅ Fecha automática (hoy)
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

    // 📧 Validar email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.com$/;
    if (!emailRegex.test(form.email)) {
      toast.error("❌ Solo se permiten correos de Gmail, Hotmail u Outlook");
      return;
    }

    // 🪪 Validar CI (10 dígitos)
    const ciRegex = /^[0-9]{10}$/;
    if (!ciRegex.test(form.ci)) {
      toast.error("❌ La cédula debe tener exactamente 10 números");
      return;
    }

    // 👶 Validar edad (1 a 110)
    const edad = parseInt(form.edad, 10);
    if (isNaN(edad) || edad < 1 || edad > 110) {
      toast.error("❌ La edad debe estar entre 1 y 110 años");
      return;
    }

    // 📱 Validar teléfono (10 dígitos)
    const telRegex = /^[0-9]{10}$/;
    if (!telRegex.test(form.telefono)) {
      toast.error("❌ El teléfono debe tener exactamente 10 dígitos");
      return;
    }

    try {
      const data = await registrarPaciente(form);
      toast.success(`✅ Paciente registrado con ID: ${data.paciente_id}`);

      setForm({
        fecha_registro: new Date().toISOString().split("T")[0], // ✅ vuelve a poner la fecha de hoy
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

      const next = await obtenerSiguientePacienteId();
      setNextId(next.next_paciente_id);

    } catch (error) {
      console.error("Error en registro:", error);
      toast.error(`❌ ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-paciente">
      <h2>📝 Registro de Paciente</h2>
      <p>Próximo ID asignado: <strong>{nextId}</strong></p>

      {/* ✅ Fecha automática, solo lectura */}
      <input
        name="fecha_registro"
        type="date"
        value={form.fecha_registro}
        readOnly
      />

      <input name="nombres_completos" placeholder="Nombres y Apellidos" value={form.nombres_completos} onChange={handleChange} required />
      <select name="estado_civil" value={form.estado_civil} onChange={handleChange}>
        <option value="soltero">Soltero</option>
        <option value="casado">Casado</option>
        <option value="divorciado">Divorciado</option>
        <option value="viudo">Viudo</option>
      </select>
      <input name="domicilio" placeholder="Domicilio" value={form.domicilio} onChange={handleChange} required />
      <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
      <input name="ci" placeholder="CI (10 dígitos)" value={form.ci} onChange={handleChange} required maxLength="10" />
      <input name="edad" type="number" placeholder="Edad (1-110)" value={form.edad} onChange={handleChange} required min="1" max="110" />
      <select name="sexo" value={form.sexo} onChange={handleChange}>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
      <input name="origen" placeholder="Origen" value={form.origen} onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono (10 dígitos)" value={form.telefono} onChange={handleChange} required maxLength="10" />
      <textarea name="motivo_consulta" placeholder="Motivo de consulta" value={form.motivo_consulta} onChange={handleChange} />

      <button type="submit">Registrar Paciente</button>
      <ToastContainer position="top-right" autoClose={3000}/>
    </form>
  );
}

export default RegistroPaciente;
