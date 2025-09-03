import { useState } from "react";
import { registerUsuario } from "../services/api";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUsuario(email, password);
      alert(`✅ Fisioterapeuta registrado: ${data.email}`);
      onRegister(data.rol);
    } catch (err) {
      alert("❌ Error al registrar fisioterapeuta");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro Fisioterapeuta</h2>
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
      <button type="submit">Registrar</button>
    </form>
  );
}

export default Register;
