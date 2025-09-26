import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import {
  obtenerAtencionById,
  updateAtencion,
  listarFisioterapeutas,
  agregarFisioterapeuta,
  eliminarFisioterapeuta,
} from "../services/api";

function CitaDetalle() {
  const { atencionId, citaIndex } = useParams();
  const navigate = useNavigate();

  const [atencion, setAtencion] = useState(null);
  const [cita, setCita] = useState({
    fecha: new Date().toISOString().split("T")[0],
    texto: "",
    material: [""],
    costo_materiales: "",
    precio_cita: "",
    signos_vitales: {
      talla: "",
      peso: "",
      frecuencia_respiratoria: "",
      frecuencia_cardiaca: "",
      temperatura: "",
      tension_arterial: "",
    },
    quien_atiende: "",
  });

  const [fisioterapeutas, setFisioterapeutas] = useState([]);
  const [nuevoFisio, setNuevoFisio] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Traer atención ---
  useEffect(() => {
    const fetchAtencion = async () => {
      setLoading(true);
      try {
        const a = await obtenerAtencionById(atencionId);
        setAtencion(a);
        if (citaIndex !== "new" && a.citas?.[citaIndex]) {
          setCita({
            ...a.citas[citaIndex],
            material: a.citas[citaIndex].material || [""],
            costo_materiales: a.citas[citaIndex].costo_materiales || "",
            precio_cita: a.citas[citaIndex].precio_cita || "",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar atención");
      } finally {
        setLoading(false);
      }
    };
    fetchAtencion();
  }, [atencionId, citaIndex]);

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

  // --- Cambios de campos ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCita({ ...cita, [name]: value });
  };

  const handleSignosChange = (e) => {
    const { name, value } = e.target;
    setCita({
      ...cita,
      signos_vitales: { ...cita.signos_vitales, [name]: value },
    });
  };

  const handleMaterialChange = (i, value) => {
    const newMaterial = [...cita.material];
    newMaterial[i] = value;
    setCita({ ...cita, material: newMaterial });
  };

  const addMaterial = () => setCita({ ...cita, material: [...cita.material, ""] });
  const removeMaterial = (i) =>
    setCita({ ...cita, material: cita.material.filter((_, idx) => idx !== i) });

  // --- Fisioterapeutas ---
  const agregarFisioClick = async () => {
    if (!nuevoFisio.trim()) return;
    try {
      const res = await agregarFisioterapeuta(nuevoFisio.trim());
      setFisioterapeutas([...fisioterapeutas, { nombre: nuevoFisio.trim(), id: res.id }]);
      setNuevoFisio("");
      toast.success("Fisioterapeuta agregado");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const eliminarFisioClick = async (id) => {
    try {
      await eliminarFisioterapeuta(id);
      setFisioterapeutas(fisioterapeutas.filter(f => f.id !== id));
      if (cita.quien_atiende === id) setCita({ ...cita, quien_atiende: "" });
      toast.success("Fisioterapeuta eliminado");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- Guardar cita ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!atencion) return;

    try {
      const citaLimpia = {
        ...cita,
        material: cita.material?.map(m => m || "") || [],
        costo_materiales: parseFloat(cita.costo_materiales) || 0,
        precio_cita: parseFloat(cita.precio_cita) || 0,
        quien_atiende: cita.quien_atiende || null,
      };

      const nuevasCitas = [...(atencion.citas || [])];
      if (citaIndex === "new") {
        nuevasCitas.push(citaLimpia);
      } else {
        nuevasCitas[citaIndex] = citaLimpia;
      }

      await updateAtencion(atencion._id, { citas: nuevasCitas });
      toast.success("Cita guardada correctamente");
      navigate(`/atenciones`);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la cita");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <form className="form-paciente" onSubmit={handleSubmit}>
      <h2>Detalle de Cita</h2>

      <label>Fecha</label>
      <input type="date" name="fecha" value={cita.fecha} onChange={handleChange} />

      <label>Notas</label>
      <textarea name="texto" value={cita.texto} onChange={handleChange} />

      <label>Material</label>
      {cita.material.map((mat, i) => (
        <div key={i} style={{ display: "flex", gap: "5px" }}>
          <input value={mat} onChange={e => handleMaterialChange(i, e.target.value)} />
          <button type="button" onClick={() => removeMaterial(i)}>Quitar</button>
        </div>
      ))}
      <button type="button" onClick={addMaterial}>+ Agregar Material</button>

      <label>Costo Materiales</label>
      <input type="number" name="costo_materiales" value={cita.costo_materiales} onChange={handleChange} />

      <label>Precio Cita</label>
      <input type="number" name="precio_cita" value={cita.precio_cita} onChange={handleChange} />

      <label>Fisioterapeuta que Atiende</label>
      <select value={cita.quien_atiende} onChange={e => setCita({ ...cita, quien_atiende: e.target.value })}>
        <option value="">Seleccione...</option>
        {fisioterapeutas.map(f => (
          <option key={f.id} value={f.id}>{f.nombre}</option>
        ))}
      </select>

      <div>
        <input value={nuevoFisio} onChange={e => setNuevoFisio(e.target.value)} placeholder="Nuevo fisioterapeuta" />
        <button type="button" onClick={agregarFisioClick}>+ Agregar</button>
      </div>

      <h3>Signos Vitales</h3>
      {["talla","peso","frecuencia_respiratoria","frecuencia_cardiaca","temperatura","tension_arterial"].map(field => (
        <input
          key={field}
          name={field}
          placeholder={field.replace("_", " ").toUpperCase()}
          value={cita.signos_vitales[field]}
          onChange={handleSignosChange}
        />
      ))}

      <button type="submit">Guardar Cita</button>
    </form>
  );
}

export default CitaDetalle;
