import { useState } from "react";
import { loginUsuario, registerUsuario } from "../services/api";

function Login({ setRol }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [rolRegistro, setRolRegistro] = useState("fisioterapeuta"); // rol para registrar

  // 🔑 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUsuario(email, password);

      // Guardamos token y rol en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);

      alert(`Bienvenido ${data.email} (${data.rol})`);
      setRol(data.rol); // actualizamos App.js
    } catch (err) {
      alert("❌ Credenciales inválidas");
    }
  };

  // 🔑 REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUsuario({
        email,
        password,
        rol: rolRegistro,
      });
      alert(`✅ Usuario ${data.email} registrado como ${rolRegistro}`);
      setIsRegistering(false);
    } catch (err) {
      alert("❌ Error al registrar usuario (solo admin puede hacerlo)");
    }
  };

  return (
    <div>
      {isRegistering ? (
        <form onSubmit={handleRegister}>
          <h2>Registrar Usuario</h2>
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
          <button type="button" onClick={() => setIsRegistering(false)}>
            Volver al Login
          </button>
        </form>
      ) : (
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
          <button type="button" onClick={() => setIsRegistering(true)}>
            Registrarse (solo fisioterapeutas/admin)
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
