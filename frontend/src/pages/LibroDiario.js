// src/pages/LibroDiario.js
import { useState, useEffect } from "react";
import {
  listarPacientes,
  buscarPacientes,
  listarAtenciones,
  listarFisioterapeutas,
} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function LibroDiario() {
  const [pacientes, setPacientes] = useState([]);
  const [queryPaciente, setQueryPaciente] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const [atenciones, setAtenciones] = useState([]);
  const [seleccionAtencionId, setSeleccionAtencionId] = useState("");
  const [seleccionCitaIndex, setSeleccionCitaIndex] = useState(null);

  const [materialesCita, setMaterialesCita] = useState([]);
  const [costoMaterial, setCostoMaterial] = useState(null);
  const [costoTratamiento, setCostoTratamiento] = useState(null);
  const [efectivo, setEfectivo] = useState("");
  const [transferencia, setTransferencia] = useState("");
  const [total, setTotal] = useState(0);
  const [formaPago, setFormaPago] = useState("");

  const [fecha, setFecha] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [registros, setRegistros] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);

  const [fisioterapeutas, setFisioterapeutas] = useState([]);

  // --- Traer fisioterapeutas ---
  useEffect(() => {
    const fetchFisio = async () => {
      try {
        const fisios = await listarFisioterapeutas();
        setFisioterapeutas(fisios);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar fisioterapeutas");
      }
    };
    fetchFisio();
  }, []);

  // --- Buscar pacientes ---
  useEffect(() => {
    const fetch = async () => {
      if (!queryPaciente.trim()) {
        setPacientes([]);
        return;
      }
      try {
        const res = await buscarPacientes(queryPaciente);
        setPacientes(Array.isArray(res) ? res : []);
      } catch {
        toast.error("Error buscando pacientes");
      }
    };
    const t = setTimeout(fetch, 250);
    return () => clearTimeout(t);
  }, [queryPaciente]);

  // --- Seleccionar paciente ---
  const handleSeleccionPaciente = async (p) => {
    setPacienteSeleccionado(p);
    setQueryPaciente(p.nombres_completos);
    try {
      const data = await listarAtenciones(p.paciente_id);
      setAtenciones(Array.isArray(data) ? data : []);
      setSeleccionAtencionId("");
      setSeleccionCitaIndex(null);
      setMaterialesCita([]);
      setCostoMaterial(null);
      setCostoTratamiento(null);
      setEfectivo("");
      setTransferencia("");
      setTotal(0);
      setFormaPago("");
    } catch {
      toast.error("Error al traer atenciones");
    }
  };

  // --- Seleccionar atención/cita ---
  const handleSeleccionAtencionYCita = (value) => {
    if (!value) {
      setSeleccionAtencionId("");
      setSeleccionCitaIndex(null);
      return;
    }
    const [aid, idx] = value.split("|");
    const idxNum = Number(idx);
    setSeleccionAtencionId(aid);
    setSeleccionCitaIndex(idxNum);

    const at = atenciones.find((a) => a.atencion_id === aid);
    if (!at) return;

    const c = at.citas?.[idxNum];
    const costo_trat = c?.precio_cita ?? at?.precio_cita ?? 0;
    const costo_mat = c?.costo_materiales ?? c?.costo_material ?? 0;
    const mats = c?.material ?? [];

    setMaterialesCita(Array.isArray(mats) ? mats : []);
    setCostoMaterial(costo_mat);
    setCostoTratamiento(costo_trat);

    const ef = c?.efectivo ?? "";
    const tr = c?.transferencia ?? "";
    setEfectivo(ef !== undefined && ef !== null ? String(ef) : "");
    setTransferencia(tr !== undefined && tr !== null ? String(tr) : "");

    setTotal((Number(costo_trat) || 0) + (Number(costo_mat) || 0));
    actualizarFormaPago(ef, tr);
  };

  // --- Actualizar forma de pago ---
  const actualizarFormaPago = (ef, tr) => {
    const e = Number(ef || 0);
    const t = Number(tr || 0);
    if (e > 0 && t > 0) setFormaPago("multiple");
    else if (e > 0) setFormaPago("efectivo");
    else if (t > 0) setFormaPago("transferencia");
    else setFormaPago("gratis");
  };

  const handleEfectivoChange = (v) => {
    setEfectivo(v);
    actualizarFormaPago(v, transferencia);
  };

  const handleTransferenciaChange = (v) => {
    setTransferencia(v);
    actualizarFormaPago(efectivo, v);
  };

  // --- Guardar registro en Libro Diario ---
  const handleGuardar = async () => {
  const at = atenciones.find((a) => a.atencion_id === seleccionAtencionId);
  const c = at?.citas?.[seleccionCitaIndex] ?? {};
  
  // Buscar el nombre del fisio
  const fisio = fisioterapeutas.find(f => f.id === c.quien_atiende);

  const payload = {
    fecha: fecha || null,
    paciente_id: pacienteSeleccionado?.paciente_id ?? null,
    nombres_completos: pacienteSeleccionado?.nombres_completos ?? null,
    ci: pacienteSeleccionado?.ci ?? null,
    telefono: pacienteSeleccionado?.telefono ?? null,
    email: pacienteSeleccionado?.email ?? null,
    atencion_id: seleccionAtencionId || null,
    cita_id: seleccionCitaIndex ?? null,
    motivo_consulta: at?.motivo_consulta ?? null,
    costo_tratamiento: c?.precio_cita ?? at?.precio_cita ?? 0,
    material: c?.material ?? [],
    costo_material: c?.costo_materiales ?? 0,
    efectivo: efectivo === "" ? null : Number(efectivo),
    transferencia: transferencia === "" ? null : Number(transferencia),
    total: (Number(c?.precio_cita ?? at?.precio_cita) || 0) + (Number(c?.costo_materiales) || 0),
    forma_pago: formaPago ?? null,
    fisioterapeuta_id: c?.quien_atiende ?? null,
    fisioterapeuta_nombre: fisio ? fisio.nombre : null, // ✅ Aquí guardamos el nombre
  };

  try {
    const res = await fetch("http://localhost:8006/librodiario/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error guardando registro");
    toast.success("Registro guardado en Libro Diario");
    // Limpiar campos...
    setPacienteSeleccionado(null);
    setAtenciones([]);
    setSeleccionAtencionId("");
    setSeleccionCitaIndex(null);
    setMaterialesCita([]);
    setCostoMaterial(null);
    setCostoTratamiento(null);
    setEfectivo("");
    setTransferencia("");
    setTotal(0);
    setFormaPago("");
    setQueryPaciente("");
    setFecha("");
    fetchRegistros();
  } catch {
    toast.error("Error guardando registro");
  }
};


  // --- Traer registros ---
  const fetchRegistros = async () => {
    try {
      const url = filtroFecha
        ? `http://localhost:8006/librodiario/listar?fecha=${filtroFecha}`
        : `http://localhost:8006/librodiario/listar`;
      const r = await fetch(url);
      const data = await r.json();
      setRegistros(Array.isArray(data) ? data : []);
      const totalDia = (Array.isArray(data) ? data : []).reduce(
        (acc, it) =>
          acc + (Number(it.costo_tratamiento || 0) + Number(it.costo_material || 0)),
        0
      );
      setTotalVentas(totalDia);
    } catch {
      toast.error("Error cargando registros");
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, [filtroFecha]);

  return (
    <div className="section-container">
      <h2>Libro Diario</h2>

      <div className="card">
        <label>Buscar paciente (nombre o CI)</label>
        <input
          className="input-buscar"
          value={queryPaciente}
          onChange={(e) => setQueryPaciente(e.target.value)}
          placeholder="Buscar por nombre o CI"
        />
        {pacientes.length > 0 && (
          <ul className="autocomplete-list card">
            {pacientes.map((p) => (
              <li
                key={p._id ?? p.paciente_id}
                onClick={() => handleSeleccionPaciente(p)}
                style={{ cursor: "pointer", padding: "6px 8px" }}
              >
                {p.nombres_completos} ({p.ci})
              </li>
            ))}
          </ul>
        )}

        {pacienteSeleccionado && (
          <div className="detalle-paciente">
            <h2>Detalle del Paciente</h2>
            <p>
              <strong>Nombre:</strong> {pacienteSeleccionado.nombres_completos}
              <br />
              <strong>CI:</strong> {pacienteSeleccionado.ci}
              <br />
              <strong>Teléfono:</strong> {pacienteSeleccionado.telefono}
              <br />
              <strong>Email:</strong> {pacienteSeleccionado.email}
            </p>

            <h3>Atención / Cita</h3>
            <select
              value={
                seleccionAtencionId && seleccionCitaIndex !== null
                  ? `${seleccionAtencionId}|${seleccionCitaIndex}`
                  : ""
              }
              onChange={(e) => handleSeleccionAtencionYCita(e.target.value)}
            >
              <option value="">-- Seleccione --</option>
              {atenciones.map((a) =>
                (a.citas || []).map((c, i) => (
                  <option key={`${a.atencion_id}|${i}`} value={`${a.atencion_id}|${i}`}>
                    {a.atencion_id} - Cita {i + 1} ({c.fecha})
                  </option>
                ))
              )}
            </select>

            <h3>Materiales (de la cita)</h3>
            <ul>
              {materialesCita.length > 0
                ? materialesCita.map((m, idx) => <li key={idx}>{m}</li>)
                : <li>No hay materiales en la cita</li>
              }
            </ul>

            <h3>Costos y Pagos</h3>
            <label>Costo tratamiento</label>
            <input
              type="number"
              value={costoTratamiento ?? ""}
              onChange={(e) => setCostoTratamiento(Number(e.target.value))}
            />

            <label>Costo material</label>
            <input
              type="number"
              value={costoMaterial ?? ""}
              onChange={(e) => setCostoMaterial(Number(e.target.value))}
            />

            <label>Efectivo</label>
            <input
              type="number"
              value={efectivo}
              onChange={(e) => handleEfectivoChange(e.target.value)}
            />

            <label>Transferencia</label>
            <input
              type="number"
              value={transferencia}
              onChange={(e) => handleTransferenciaChange(e.target.value)}
            />

            <p>
              <strong>Total:</strong> {(Number(costoTratamiento) || 0) + (Number(costoMaterial) || 0)}
              <br />
              <strong>Forma de pago:</strong> {formaPago}
            </p>

            <label>Fecha del registro</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />

            <div style={{ marginTop: 8 }}>
              <button className="btn-guardar" onClick={handleGuardar}>
                💾 Guardar en Libro Diario
              </button>
            </div>
          </div>
        )}
      </div>

      <hr />

      <div>
        <h3>Registros Libro Diario</h3>
        <label>Filtrar por fecha</label>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        <p>Total ventas: ${totalVentas}</p>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>CI</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Motivo</th>
              <th>Costo Trat.</th>
              <th>Material</th>
              <th>Costo Mat.</th>
              <th>Efectivo</th>
              <th>Transfer.</th>
              <th>Total</th>
              <th>Forma</th>
              <th>Fisio</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r._id}>
                <td>{r.fecha}</td>
                <td>{r.nombres_completos}</td>
                <td>{r.ci}</td>
                <td>{r.telefono}</td>
                <td>{r.email}</td>
                <td>{r.motivo_consulta}</td>
                <td>{r.costo_tratamiento ?? "-"}</td>
                <td>{Array.isArray(r.material) ? r.material.join(", ") : r.material}</td>
                <td>{r.costo_material ?? "-"}</td>
                <td>{r.efectivo ?? "-"}</td>
                <td>{r.transferencia ?? "-"}</td>
                <td>{r.total ?? "-"}</td>
                <td>{r.forma_pago ?? "-"}</td>
                <td>{r.fisioterapeuta_nombre ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default LibroDiario;
