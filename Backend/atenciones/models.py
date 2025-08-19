from pydantic import BaseModel
from typing import List, Dict, Optional

class SignosVitales(BaseModel):
    tension_arterial: str
    temperatura: str
    frecuencia_cardiaca: int
    frecuencia_respiratoria: int
    peso: float
    talla: float

class Atencion(BaseModel):
    atencion_id: Optional[str] = None  # <-- ahora es opcional
    paciente_id: str
    fecha: str
    quien_atiende: str
    motivo_consulta: Optional[str] = None
    antecedentes: Optional[list] = []
    signos_vitales: Optional[dict] = {}
    diagnostico: Optional[str] = None
    tratamiento: Optional[str] = None
    notas: Optional[str] = None
