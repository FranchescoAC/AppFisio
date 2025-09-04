import { useEffect, useState } from "react";
import { registerUsuario, getUserRole } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolRegistro, setRolRegistro] = useState("fisioterapeuta");
  const navigate = useNavigate();

  // Solo admin puede entrar a /register
  useEffect(() => {
    const rol = getUserRole();
    if (rol !== "admin") {
      toast.error("❌ Solo el admin puede registrar usuarios");
      navigate("/login");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("❌ Llene todos los parámetros");
      return;
    }

    try {
      const data = await registerUsuario({ email, password, rol: rolRegistro });
      toast.success(`✅ Usuario ${data.email} registrado como ${data.rol}`);
      navigate("/login"); // volver al login tras registrar
    } catch (err) {
      toast.error(err.message || "❌ Error al registrar usuario");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrar Usuario (solo admin)</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={rolRegistro} onChange={(e) => setRolRegistro(e.target.value)}>
        <option value="fisioterapeuta">Fisioterapeuta</option>
        <option value="admin">Administrador</option>
      </select>
      <button type="submit">Registrar</button>
      <button type="button" onClick={() => navigate(-1)}>
        Volver
      </button>
    </form>
  );
}

export default Register;
