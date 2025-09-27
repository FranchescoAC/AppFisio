import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RegistroPaciente from "./pages/RegistroPaciente";
import ListadoPacientes from "./pages/ListadoPacientes";
import RegistroAtencion from "./pages/RegistroAtencion";
import ListadoAtenciones from "./pages/ListadoAtenciones";
import AnalisisVentas from "./pages/AnalisisVentas";
import CitaDetalle from "./pages/CitaDetalle";
import LibroDiario from "./pages/LibroDiario";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { FaHome, FaUserPlus, FaClipboardList, FaFileInvoice, FaChartLine, FaSignInAlt, FaSignOutAlt, FaFileAlt } from "react-icons/fa";
import logo from "./img/Logo1.png";
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
        <Link to="/">
          <img src={logo} alt="Logo Rojas" style={{ cursor: "pointer", height: "60px" }} />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          {/* Rol Paciente */}
          {rol === "paciente" && (
            <>
              <Link to="/registro-paciente" title="Registrar Paciente">
                <FaUserPlus size={50} color="#F0F0F0" />
              </Link>
              <Link to="/registro-atencion" title="Registrar Atención">
                <FaFileInvoice size={50} color="#e74c3c" />
              </Link>
              <Link to="/listado-pacientes" title="Listado Pacientes">
                <FaClipboardList size={50} color="#e67e22" />
              </Link>
              <Link to="/libro-diario" title="Libro Diario">
                <FaFileAlt size={50} color="#9b59b6" />
              </Link>
            </>
          )}

          {/* Rol Fisioterapeuta */}
          {rol === "fisioterapeuta" && (
            <>
              <Link to="/libro-diario" title="Libro Diario">
                <FaFileAlt size={50} color="#9b59b6" />
              </Link>
              <Link to="/listado-atenciones" title="Historial Atenciones">
                <FaFileInvoice size={50} color="#e74c3c" />
              </Link>
            </>
          )}

          {/* Rol Admin */}
          {rol === "admin" && (
            <>
              <Link to="/registro-paciente" title="Registrar Paciente">
                <FaUserPlus size={50} color="#F0F0F0" />
              </Link>
              <Link to="/registro-atencion" title="Registrar Atención">
                <FaFileInvoice size={50} color="#e74c3c" />
              </Link>
              <Link to="/listado-pacientes" title="Listado Pacientes">
                <FaClipboardList size={50} color="#e67e22" />
              </Link>
              <Link to="/listado-atenciones" title="Historial Atenciones">
                <FaFileInvoice size={50} color="#e74c3c" />
              </Link>
              <Link to="/libro-diario" title="Libro Diario">
                <FaFileAlt size={50} color="#9b59b6" />
              </Link>
              <Link to="/analisis-ventas" title="Análisis Ventas">
                <FaChartLine size={50} color="#2ecc71" />
              </Link>
              <Link to="/register" title="Registrar Usuario">
                <FaUserPlus size={50} color="#34495e" />
              </Link>
            </>
          )}
        </div>

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
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setRol={setRol} />} />
        {rol === "admin" && <Route path="/register" element={<Register />} />}
        <Route path="/registro-paciente" element={<RegistroPaciente />} />

        {/* Paciente */}
        {rol === "paciente" && (
          <>
            <Route path="/registro-atencion" element={<RegistroAtencion />} />
            <Route path="/listado-pacientes" element={<ListadoPacientes />} />
            <Route path="/libro-diario" element={<LibroDiario />} />
          </>
        )}

        {/* Fisioterapeuta */}
        {rol === "fisioterapeuta" && (
          <>
            <Route path="/listado-atenciones" element={<ListadoAtenciones />} />
            <Route path="/libro-diario" element={<LibroDiario />} />
          </>
        )}

        {/* Admin */}
        {rol === "admin" && (
          <>
            <Route path="/registro-atencion" element={<RegistroAtencion />} />
            <Route path="/listado-pacientes" element={<ListadoPacientes />} />
             <Route path="/listado-atenciones" element={<ListadoAtenciones />} />
            <Route path="/libro-diario" element={<LibroDiario />} />
            <Route path="/analisis-ventas" element={<AnalisisVentas />} />
          </>
        )}

        {/* RUTA DE CITADETALLE SIEMPRE DISPONIBLE */}
        <Route path="/cita/:atencionId/:citaIndex" element={<CitaDetalle />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
