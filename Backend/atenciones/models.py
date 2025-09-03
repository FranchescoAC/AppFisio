from pydantic import BaseModel
from typing import Optional

class SignosVitales(BaseModel):
    tension_arterial: str
    temperatura: str
    frecuencia_cardiaca: int
    frecuencia_respiratoria: int
    peso: float
    talla: float

class Tratamiento(BaseModel):
    fase_inicial: str
    fase_intermedia: Optional[str] = None
    fase_final: Optional[str] = None

class Atencion(BaseModel):
    atencion_id: Optional[str] = None
    paciente_id: str
    fecha: str
    quien_atiende: str
    motivo_consulta: Optional[str] = None
    antecedentes: Optional[list] = []
    signos_vitales: Optional[dict] = {}
    tratamiento: Tratamiento
    notas: Optional[str] = None

# ✅ Modelo para actualizaciones parciales desde ListadoAtenciones
class AtencionUpdate(BaseModel):
    tratamiento: Optional[Tratamiento] = None
    notas: Optional[str] = None
