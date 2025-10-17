import { useState, useEffect } from "react";
import {
  listarPacientes,
  buscarPacientes,
  listarAtenciones,
  listarFisioterapeutas,
  borrarRegistro,
  actualizarRegistro,
  registrarRegistro
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
  const [bancos, setBancos] = useState("");
  const [total, setTotal] = useState(0);
  const [formaPago, setFormaPago] = useState("");

  const [fecha, setFecha] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [registros, setRegistros] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [fisioSeleccionado, setFisioSeleccionado] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [fisioterapeutas, setFisioterapeutas] = useState([]);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

  // --- Obtener registros del Libro Diario ---
  const obtenerRegistros = async () => {
    try {
      let url = null;

      if (filtroFecha) {
        url = `http://localhost:8006/librodiario/listar?fecha=${filtroFecha}`;
      } else if (filtroMes && filtroAnio) {
        url = `http://localhost:8006/librodiario/listar?mes=${filtroMes}&anio=${filtroAnio}`;
      }

      if (!url) {
        setRegistros([]);
        setTotalVentas(0);
        return;
      }

      const r = await fetch(url);
      const data = await r.json();
      setRegistros(Array.isArray(data) ? data : []);

      const totalDia = (Array.isArray(data) ? data : []).reduce(
        (acc, it) =>
          acc +
          (Number(it.costo_tratamiento || 0) + Number(it.costo_material || 0)),
        0
      );
      setTotalVentas(totalDia);
    } catch {
      toast.error("Error cargando registros");
    }
  };

  // --- Traer registros cuando cambien los filtros ---
  useEffect(() => {
    obtenerRegistros();
  }, [filtroFecha, filtroMes, filtroAnio]);

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
    setQueryPaciente(p.nombres_completos ?? "");
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
    if (!c) return;
    const costo_trat = c?.precio_cita ?? at?.precio_cita ?? 0;
    const costo_mat = c?.costo_materiales ?? c?.costo_material ?? 0;
    const mats = c?.material ?? [];
    const fisio = fisioterapeutas.find(
      (f) => String(f._id) === String(c.quien_atiende)
    );
    setFisioSeleccionado(fisio ? fisio.nombre : null);

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

  // --- Guardar o actualizar registro ---
  const handleGuardar = async () => {
  try {
    let at, c, fisio;

    if (seleccionAtencionId !== "" && seleccionCitaIndex !== null) {
      at = atenciones.find((a) => a.atencion_id === seleccionAtencionId);
      c = at?.citas?.[seleccionCitaIndex] ?? {};
      fisio = fisioterapeutas.find(
        (f) => String(f._id) === String(c.quien_atiende)
      );
    } else {
      c = {};
      fisio = fisioterapeutas.find((f) => f.nombre === fisioSeleccionado);
    }

    const payload = {
      fecha: fecha || null,
      paciente_id: pacienteSeleccionado?.paciente_id ?? null,
      nombres_completos: pacienteSeleccionado?.nombres_completos ?? null,
      ci: pacienteSeleccionado?.ci ?? null,
      telefono: pacienteSeleccionado?.telefono ?? null,
      email: pacienteSeleccionado?.email ?? null,
      motivo_consulta: at?.motivo_consulta ?? registroSeleccionado?.motivo_consulta ?? null,
      costo_tratamiento: costoTratamiento ?? 0,
      material: materialesCita ?? registroSeleccionado?.material ?? [],
      costo_material: costoMaterial ?? registroSeleccionado?.costo_material ?? 0,
      efectivo: efectivo === "" ? null : Number(efectivo),
      transferencia: transferencia === "" ? null : Number(transferencia),
      bancos: bancos || null,
      total: (Number(costoTratamiento) || 0) + (Number(costoMaterial) || 0),
      forma_pago: formaPago ?? null,
      fisioterapeuta_nombre: fisio?.nombre ?? fisioSeleccionado ?? null,
    };

    if (registroSeleccionado) {
      await actualizarRegistro(registroSeleccionado._id, payload);
    } else {
      await registrarRegistro(payload);
    }

    // 🧹 Limpiar todos los estados después de guardar
    setRegistroSeleccionado(null);
    setEditandoId(null);
    setPacienteSeleccionado(null);
    setPacientes([]);
    setAtenciones([]);
    setSeleccionAtencionId("");
    setSeleccionCitaIndex(null);
    setMaterialesCita([]);
    setCostoMaterial(null);
    setCostoTratamiento(null);
    setEfectivo("");
    setTransferencia("");
    setBancos("");
    setTotal(0);
    setFormaPago("");
    setFecha("");
    setQueryPaciente("");

    // 🔄 Recargar los registros
    await obtenerRegistros();

    toast.success(
      registroSeleccionado
        ? "Registro actualizado correctamente"
        : "Registro guardado en Libro Diario"
    );
  } catch (err) {
    console.error(err);
    toast.error("Error guardando registro: " + err.message);
  }
};


  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      await borrarRegistro(id);
      toast.success("Registro eliminado correctamente");
      obtenerRegistros();
    } catch {
      toast.error("Error al eliminar registro");
    }
  };

  // --- Editar registro ---
  const handleEditarRegistro = async (registro) => {
    setRegistroSeleccionado(registro);
    setEditandoId(registro._id);

    setFecha(registro.fecha || "");
    setEfectivo(registro.efectivo?.toString() || "");
    setTransferencia(registro.transferencia?.toString() || "");
    setBancos(registro.bancos || "");
    setFormaPago(registro.forma_pago || "");
    setCostoTratamiento(Number(registro.costo_tratamiento) || 0);
    setCostoMaterial(Number(registro.costo_material) || 0);
    setTotal(Number(registro.total) || 0);

    setPacienteSeleccionado({
      paciente_id: registro.paciente_id,
      nombres_completos: registro.nombres_completos,
      ci: registro.ci,
      telefono: registro.telefono,
      email: registro.email,
    });

    try {
      const data = await listarAtenciones(registro.paciente_id);
      const atList = Array.isArray(data) ? data : [];
      setAtenciones(atList);

      let encontrada = false;
      for (let i = 0; i < atList.length; i++) {
        const a = atList[i];
        const idx = (a.citas || []).findIndex(
          (c) =>
            (c.fecha === registro.fecha || true) &&
            Number(c.costo_tratamiento || 0) === Number(registro.costo_tratamiento || 0)
        );
        if (idx !== -1) {
          setSeleccionAtencionId(a.atencion_id);
          setSeleccionCitaIndex(idx);

          const c = a.citas[idx];
          setMaterialesCita(c.material ?? []);
          setFisioSeleccionado(
            fisioterapeutas.find((f) => String(f._id) === String(c.quien_atiende))?.nombre ||
              null
          );
          encontrada = true;
          break;
        }
      }

      if (!encontrada) {
        setSeleccionAtencionId("");
        setSeleccionCitaIndex(null);
        setMaterialesCita([]);
        setFisioSeleccionado(null);
      }
    } catch {
      toast.error("Error cargando atenciones del paciente");
    }

    // Subir al top y mostrar notificación
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Se está editando el registro", { autoClose: 2000 });
  };

  const totals = registros.reduce(
    (acc, r) => {
      acc.costoTrat += Number(r.costo_tratamiento || 0);
      acc.costoMat += Number(r.costo_material || 0);
      acc.efectivo += Number(r.efectivo || 0);
      acc.transf += Number(r.transferencia || 0);
      acc.total += Number(r.total || 0);
      return acc;
    },
    { costoTrat: 0, costoMat: 0, efectivo: 0, transf: 0, total: 0 }
  );

  return (
    <>
      <div className="section-container">
        <h2>Libro Diario</h2>

        {/* ---------------------- BUSQUEDA PACIENTE ---------------------- */}
        <div className="card">
          <h3>Buscar paciente (nombre o CI)</h3>
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
                  {p.nombres_completos ?? ""} ({p.ci ?? ""})
                </li>
              ))}
            </ul>
          )}

          {(pacienteSeleccionado || editandoId) && (
            <div
              className="detalle-paciente"
              style={{
                padding: "15px",
                border: editandoId ? "2px solid #36f4ceff" : "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: editandoId
                  ? "0 0 15px rgba(54, 244, 206, 0.7)"
                  : "none",
                transition: "all 0.3s ease",
                backgroundColor: "#fff",
                marginBottom: "20px",
              }}
            >
              <h2>Detalle del Paciente</h2>
              <p>
                <strong>Nombre:</strong> {pacienteSeleccionado?.nombres_completos ?? "-"}
                <br />
                <strong>CI:</strong> {pacienteSeleccionado?.ci ?? "-"}
                <br />
                <strong>Teléfono:</strong> {pacienteSeleccionado?.telefono ?? "-"}
                <br />
                <strong>Email:</strong> {pacienteSeleccionado?.email ?? "-"}
              </p>

              {/* ---------------------- DETALLE ATENCIONES ---------------------- */}
              {atenciones.length > 0 && (
                <div className="detalle-atenciones">
                  <h3>Atenciones del paciente</h3>
                  <label>Seleccionar cita:</label>
                  <select
                    value={
                      seleccionAtencionId && seleccionCitaIndex !== null
                        ? `${seleccionAtencionId}|${seleccionCitaIndex}`
                        : ""
                    }
                    onChange={(e) => handleSeleccionAtencionYCita(e.target.value)}
                  >
                    <option value="">-- Seleccione una cita --</option>
                    {atenciones.map((a) =>
                      a.citas?.map((cita, idx) => (
                        <option key={`${a.atencion_id}-${idx}`} value={`${a.atencion_id}|${idx}`}>
                          {cita.fecha} - {a.motivo_consulta ?? "Sin motivo"}
                        </option>
                      ))
                    )}
                  </select>

                  <div className="materiales-cita">
                    <h4>Materiales utilizados:</h4>
                    {materialesCita.length > 0 ? (
                      <ul>
                        {materialesCita.map((m, i) => (
                          <li key={i}>
                            {m.nombre ?? m} - Cantidad: {m.cantidad ?? "-"} - Precio: {m.precio ?? "-"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay materiales registrados</p>
                    )}
                  </div>

                  <div className="costos-cita">
                    <h4>Costos</h4>
                    <p>
                      <strong>Costo del tratamiento:</strong> ${costoTratamiento ?? 0}
                    </p>
                    <p>
                      <strong>Costo de materiales:</strong> ${costoMaterial ?? 0}
                    </p>
                    <p>
                      <strong>Total:</strong> ${total ?? 0}
                    </p>
                  </div>

                  <div className="formas-pago">
                    <h4>Forma de pago</h4>
                    <label>Efectivo:</label>
                    <input
                      type="number"
                      value={efectivo}
                      onChange={(e) => handleEfectivoChange(e.target.value)}
                      placeholder="0"
                    />
                    <label>Transferencia:</label>
                    <input
                      type="number"
                      value={transferencia}
                      onChange={(e) => handleTransferenciaChange(e.target.value)}
                      placeholder="0"
                    />
                    <label>Bancos:</label>
                    <input
                      type="text"
                      value={bancos}
                      onChange={(e) => setBancos(e.target.value)}
                      placeholder="Nombre del banco"
                    />
                    <p>
                      <strong>Tipo de pago:</strong> {formaPago ?? "-"}
                    </p>
                    <label>Fecha del registro</label>
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                    <button className="btn-guardar" onClick={handleGuardar}>
                      💾 Guardar en Libro Diario
                    </button>
                  </div>

                </div>
              )}
            </div>
            
          )}
                            <h3>Registros Libro Diario</h3>

        <label>Filtrar por fecha (día)</label>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => {
            setFiltroFecha(e.target.value);
            setFiltroMes("");
            setFiltroAnio("");
          }}
        />

        <label>Filtrar por mes</label>
        <select
          value={filtroMes}
          onChange={(e) => {
            setFiltroMes(e.target.value);
            setFiltroFecha("");
          }}
        >
          <option value="">--Mes--</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        <label>Año</label>
        <input
          type="number"
          placeholder="YYYY"
          value={filtroAnio}
          onChange={(e) => {
            setFiltroAnio(e.target.value);
            setFiltroFecha("");
          }}
        />

        <p>Total ventas: ${totalVentas}</p>

        </div>
      </div>

      {/* ==================== TABLA INDEPENDIENTE ==================== */}
<div className="tabla-libro-diario" style={{ overflowX: "auto", marginTop: "20px" }}>
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
        <th>Bancos</th>
        <th>Total</th>
        <th>Forma</th>
        <th>Fisio</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {registros.map((r) => (
        <tr key={r._id}>
          <td>{r.fecha ?? "-"}</td>
          <td>{r.nombres_completos ?? "-"}</td>
          <td>{r.ci ?? "-"}</td>
          <td>{r.telefono ?? "-"}</td>
          <td>{r.email ?? "-"}</td>
          <td>{r.motivo_consulta ?? "-"}</td>
          <td>{r.costo_tratamiento ?? "-"}</td>
          <td>
            {Array.isArray(r.material) && r.material.length > 0
              ? r.material.map((m) => m.nombre).join(", ")
              : "-"}
          </td>
          <td>{r.costo_material ?? "-"}</td>
          <td>{r.efectivo ?? "-"}</td>
          <td>{r.transferencia ?? "-"}</td>
          <td>{r.bancos ?? "-"}</td>
          <td>{r.total ?? "-"}</td>
          <td>{r.forma_pago ?? "-"}</td>
          <td>{r.fisioterapeuta_nombre ?? "-"}</td>
          <td>
            <div className="item-actions">
              <button onClick={() => handleEditarRegistro(r)} className="btn-buscar">
                ✏️ Editar
              </button>
              <button onClick={() => handleEliminar(r._id)} className="delete-btn">
                🗑️ Eliminar
              </button>
            </div>
          </td>
        </tr>
      ))}
      {registros.length > 0 && (
        <tr style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
          <td colSpan={6}>Totales</td>
          <td>{totals.costoTrat}</td>
          <td>-</td>
          <td>{totals.costoMat}</td>
          <td>{totals.efectivo}</td>
          <td>{totals.transf}</td>
          <td>-</td>
          <td>{totals.total}</td>
          <td colSpan={2}>-</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

<ToastContainer position="top-right" />

    </>
  );
}

export default LibroDiario;
