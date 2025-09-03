import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RegistroPaciente from "./pages/RegistroPaciente";
import ListadoPacientes from "./pages/ListadoPacientes";
import RegistroAtencion from "./pages/RegistroAtencion";
import ListadoAtenciones from "./pages/ListadoAtenciones";
import RegistroInventario from "./pages/RegistroInventario";
import ListadoInventario from "./pages/ListadoInventario";
import AnalisisVentas from "./pages/AnalisisVentas";
import Login from "./pages/Login"; // 👈 tu componente Login.js
import Register from "./pages/Register";
import { getUserRole, logoutUsuario } from "./services/api";
import { useState, useEffect } from "react";

function App() {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    setRol(getUserRole());
  }, []);

  const handleLogout = () => {
    logoutUsuario();
    setRol(null);
  };

  return (
    <Router>
      <nav>
        {/* 🔑 Mostrar botón de login/logout */}
        {!rol ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        )}

        {/* Paciente (público) */}
        <Link to="/registro-paciente">Registrar Paciente</Link>
        <Link to="/listado-inventario">Listado Inventario</Link>

        {/* Fisioterapeuta */}
        {(rol === "fisioterapeuta" || rol === "admin") && (
          <>
            <Link to="/listado-atenciones">Listado Atenciones</Link>
            <Link to="/listado-pacientes">Listado Pacientes</Link>
            <Link to="/registro-atencion">Registrar Atención</Link>
            <Link to="/registro-inventario">Registrar Inventario</Link>
          </>
        )}

        {/* Admin */}
        {rol === "admin" && (
          <Link to="/analisis-ventas">Análisis Ventas</Link>
        )}
      </nav>

      <Routes>
        {/* 🔑 Login */}
        <Route path="/login" element={<Login setRol={setRol} />} />

        {/* Paciente (público) */}
        <Route path="/registro-paciente" element={<RegistroPaciente />} />
        <Route path="/listado-inventario" element={<ListadoInventario />} />

        {/* Fisioterapeuta */}
        {(rol === "fisioterapeuta" || rol === "admin") && (
          <>
            <Route path="/listado-atenciones" element={<ListadoAtenciones />} />
            <Route path="/listado-pacientes" element={<ListadoPacientes />} />
            <Route path="/registro-atencion" element={<RegistroAtencion />} />
            <Route path="/registro-inventario" element={<RegistroInventario />} />
          </>
        )}

        {/* Admin */}
        {rol === "admin" && (
          <Route path="/analisis-ventas" element={<AnalisisVentas />} />
        )}

        {/* Redirección si no existe ruta */}
        <Route path="*" element={<Navigate to="/listado-inventario" />} />
      </Routes>
    </Router>
  );
}

export default App;
