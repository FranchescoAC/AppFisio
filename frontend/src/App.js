import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistroPaciente from "./pages/RegistroPaciente";
import ListadoPacientes from "./pages/ListadoPacientes";
import RegistroAtencion from "./pages/RegistroAtencion";
import ListadoAtenciones from "./pages/ListadoAtenciones";
import RegistroInventario from "./pages/RegistroInventario";
import ListadoInventario from "./pages/ListadoInventario";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/registro-paciente">Registrar Paciente</Link>
        <Link to="/listado-pacientes">Listado Pacientes</Link>
        <Link to="/registro-atencion">Registrar Atención</Link>
        <Link to="/listado-atenciones">Listado Atenciones</Link>
        <Link to="/registro-inventario">Registrar Inventario</Link>
        <Link to="/listado-inventario">Listado Inventario</Link>
      </nav>

      <Routes>
        <Route path="/registro-paciente" element={<RegistroPaciente />} />
        <Route path="/listado-pacientes" element={<ListadoPacientes />} />
        <Route path="/registro-atencion" element={<RegistroAtencion />} />
        <Route path="/listado-atenciones" element={<ListadoAtenciones />} />
        <Route path="/registro-inventario" element={<RegistroInventario />} />
        <Route path="/listado-inventario" element={<ListadoInventario />} />
      </Routes>
    </Router>
  );
}

export default App;
