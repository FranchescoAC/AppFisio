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
import {
  FaHome,
  FaUserPlus,
  FaClipboardList,
  FaFileInvoice,
  FaChartLine,
  FaSignInAlt,
  FaSignOutAlt,
  FaFileAlt,
} from "react-icons/fa";
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
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          backgroundColor: "#1abc9c",
        }}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Logo Rojas"
            style={{ cursor: "pointer", height: "60px" }}
          />
        </Link>

        {/* Links visibles según rol */}
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          {/* Públicos (sin login o con login de cualquier rol) */}
          {!rol && (
            <>
              <Link to="/registro-paciente" title="Registrar Paciente">
                <FaUserPlus size={50} color="#2980b9" />
              </Link>
              <Link to="/registro-atencion" title="Registrar Atención">
                <FaFileInvoice size={50} color="#0f4b28ff" />
              </Link>
              <Link to="/listado-pacientes" title="Listado Pacientes">
                <FaClipboardList size={50} color="#f39c12" />
              </Link>
              <Link to="/libro-diario" title="Libro Diario">
                <FaFileAlt size={50} color="#8e44ad" />
              </Link>
            </>
          )}

          {/* Fisioterapeuta */}
          {rol === "fisioterapeuta" && (
            <>
              <Link to="/libro-diario" title="Libro Diario">
                <FaFileAlt size={50} color="#8e44ad" />
              </Link>
              <Link to="/listado-atenciones" title="Historial Atenciones">
                <FaFileInvoice size={50} color="#c0392b" />
              </Link>
            </>
          )}

          {/* Admin */}
          {rol === "admin" && (
            <>
              <Link to="/registro-paciente" title="Registrar Paciente">
                <FaUserPlus size={50} color="#2980b9" />
              </Link>
              <Link to="/registro-atencion" title="Registrar Atención">
                <FaFileInvoice size={50} color="#0f4b28ff" />
              </Link>
              <Link to="/listado-pacientes" title="Listado Pacientes">
                <FaClipboardList size={50} color="#f39c12" />
              </Link>
              <Link to="/listado-atenciones" title="Historial Atenciones">
                <FaFileInvoice size={50} color="#c0392b" />
              </Link>
              <Link to="/libro-diario" title="Libro Diario">
                <FaFileAlt size={50} color="#8e44ad" />
              </Link>
              <Link to="/analisis-ventas" title="Análisis Ventas">
                <FaChartLine size={50} color="#27ae60" />
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
              <FaSignInAlt size={50} color="#0f6364ff" />
            </Link>
          ) : (
            <button
              className="logout"
              onClick={handleLogout}
              title="Cerrar Sesión"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaSignOutAlt size={50} color="#c0392b" />
            </button>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setRol={setRol} />} />

        {/* Públicos (disponibles si no hay login) */}
        {!rol && (
          <>
            <Route path="/registro-paciente" element={<RegistroPaciente />} />
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
            <Route path="/registro-paciente" element={<RegistroPaciente />} />
            <Route path="/registro-atencion" element={<RegistroAtencion />} />
            <Route path="/listado-pacientes" element={<ListadoPacientes />} />
            <Route path="/listado-atenciones" element={<ListadoAtenciones />} />
            <Route path="/libro-diario" element={<LibroDiario />} />
            <Route path="/analisis-ventas" element={<AnalisisVentas />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {/* Siempre disponible */}
        <Route
          path="/cita/:atencionId/:citaIndex"
          element={<CitaDetalle />}
        />

        {/* Ruta fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
