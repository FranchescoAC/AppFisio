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
import { FaHome, FaUserPlus, FaClipboardList, FaFileInvoice, FaChartLine, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
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
<nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", backgroundColor: "#1abc9c" }}>
  {/* Logo */}
  <Link to="/">
    <img src={logo} alt="Logo Rojas" style={{ cursor: "pointer", height: "60px" }} />
  </Link>

  {/* Íconos principales */}
  <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
    <Link to="/registro-paciente" title="Registrar Paciente">
      <FaUserPlus size={50} color="#F0F0F0" />
    </Link>

    <Link to="/listado-inventario" title="Listado Inventario">
      <FaClipboardList size={50} color="#3498db" />
    </Link>

    {(rol === "fisioterapeuta" || rol === "admin") && (
      <>
        <Link to="/listado-atenciones" title="Listado Atenciones">
          <FaFileInvoice size={50} color="#9b59b6" />
        </Link>
        <Link to="/listado-pacientes" title="Listado Pacientes">
          <FaClipboardList size={50} color="#e67e22" />
        </Link>
        <Link to="/registro-atencion" title="Registrar Atención">
          <FaUserPlus size={50} color="#e74c3c" />
        </Link>
        <Link to="/registro-inventario" title="Registrar Inventario">
          <FaClipboardList size={50} color="#f1c40f" />
        </Link>
      </>
    )}

    {rol === "admin" && (
      <>
        <Link to="/analisis-ventas" title="Análisis Ventas">
          <FaChartLine size={50} color="#2ecc71" />
        </Link>
        <Link to="/register" title="Registrar Usuario">
          <FaUserPlus size={50} color="#34495e" />
        </Link>
      </>
    )}
  </div>

  {/* Login / Logout */}
  <div>
    {!rol ? (
      <Link to="/login" title="Login">
        <FaSignInAlt size={50} color="#2980b9" />
      </Link>
    ) : (
      <button className="logout" onClick={handleLogout} title="Cerrar Sesión" style={{ background: "none", border: "none", cursor: "pointer" }}>
        <FaSignOutAlt size={50} color="#c0392b" />
      </button>
    )}
  </div>
</nav>




      <Routes>
  {/* ✅ Ruta raíz y /Home llevan a Home */}
  <Route path="/" element={<Home />} />
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

  {/* ✅ Si no encuentra ruta, redirige al Home */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>


      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
