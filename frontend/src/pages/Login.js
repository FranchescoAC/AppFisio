import { useState } from "react";
import { loginUsuario } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";

function Login({ setRol }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("❌ Llene todos los parámetros");
      return;
    }

    try {
      const data = await loginUsuario(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);

      setRol(data.rol);
      toast.success(`✅ Bienvenido ${data.email} (${data.rol})`);

      // Redirección por rol (página principal)
      if (data.rol === "admin") {
        navigate("/analisis-ventas");
      } else {
        navigate("/listado-inventario");
      }
    } catch (err) {
      toast.error(err.message || "❌ Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
      <button type="submit">Ingresar</button>
      {/* ⚠️ Quitamos el botón de "Registrarse" aquí.
          El registro solo lo verá el admin dentro de la app en /register */}
    </form>
  );
}

export default Login;
