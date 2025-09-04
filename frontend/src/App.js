import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RegistroPaciente from "./pages/RegistroPaciente";
import ListadoPacientes from "./pages/ListadoPacientes";
import RegistroAtencion from "./pages/RegistroAtencion";
import ListadoAtenciones from "./pages/ListadoAtenciones";
import RegistroInventario from "./pages/RegistroInventario";
import ListadoInventario from "./pages/ListadoInventario";
import AnalisisVentas from "./pages/AnalisisVentas";
import Home from "./pages/Home";
import "./App.css";
import logo from "./img/Logo1.png";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getUserRole, logoutUsuario } from "./services/api";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  <img src={logo} alt="Logo Rojas" />
  <div>
          <Link to="/registro-paciente">Registrar Paciente</Link>
          <Link to="/listado-inventario">Listado Inventario</Link>

          {(rol === "fisioterapeuta" || rol === "admin") && (
            <>
              <Link to="/listado-atenciones">Listado Atenciones</Link>
              <Link to="/listado-pacientes">Listado Pacientes</Link>
              <Link to="/registro-atencion">Registrar Atención</Link>
              <Link to="/registro-inventario">Registrar Inventario</Link>
            </>
          )}

          {rol === "admin" && (
            <>
              <Link to="/analisis-ventas">Análisis Ventas</Link>
              <Link to="/register">Registrar Usuario</Link>
            </>
          )}
        </div>
<div>
    {!rol ? (
      <Link to="/login">Login</Link>
    ) : (
      <button className="logout" onClick={handleLogout}>
        🔒 Cerrar Sesión
      </button>
    )}
  </div>
</nav>

      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login setRol={setRol} />} />

        {/* /register solo admin */}
        {rol === "admin" && <Route path="/register" element={<Register />} />}

        <Route path="/registro-paciente" element={<RegistroPaciente />} />
        <Route path="/listado-inventario" element={<ListadoInventario />} />

        {(rol === "fisioterapeuta" || rol === "admin") && (
          <>
            <Route path="/listado-atenciones" element={<ListadoAtenciones />} />
            <Route path="/listado-pacientes" element={<ListadoPacientes />} />
            <Route path="/registro-atencion" element={<RegistroAtencion />} />
            <Route path="/registro-inventario" element={<RegistroInventario />} />
          </>
        )}

        {rol === "admin" && (
          <Route path="/analisis-ventas" element={<AnalisisVentas />} />
        )}

        <Route path="*" element={<Navigate to="/listado-inventario" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
