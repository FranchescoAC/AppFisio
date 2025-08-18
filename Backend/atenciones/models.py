from pydantic import BaseModel
from typing import List, Dict

class SignosVitales(BaseModel):
    tension_arterial: str
    temperatura: str
    frecuencia_cardiaca: int
    frecuencia_respiratoria: int
    peso: float
    talla: float

class Atencion(BaseModel):
    paciente_id: str  # ejemplo: "P1001"
    fecha: str        # "18/08/2025"
    quien_atiende: str
    motivo_consulta: str
    antecedentes: List[str]
    signos_vitales: SignosVitales
    diagnostico: str = ""
    tratamiento: str = ""
    notas: str = ""
