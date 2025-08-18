import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistroPaciente from "./pages/RegistroPaciente";
import ListadoPacientes from "./pages/ListadoPacientes";
import RegistroAtencion from "./pages/RegistroAtencion";
import ListadoAtenciones from "./pages/ListadoAtenciones";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/registro-paciente">Registrar Paciente</Link>
        <Link to="/listado-pacientes">Listado Pacientes</Link>
        <Link to="/registro-atencion">Registrar Atención</Link>
        <Link to="/listado-atenciones">Listado Atenciones</Link>
      </nav>

      <Routes>
        <Route path="/registro-paciente" element={<RegistroPaciente />} />
        <Route path="/listado-pacientes" element={<ListadoPacientes />} />
        <Route path="/registro-atencion" element={<RegistroAtencion />} />
      <Route path="/listado-atenciones" element={<ListadoAtenciones />} />
      </Routes>
    </Router>
  );
}

export default App;
