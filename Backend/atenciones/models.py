from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Subdocumento Cita
class SignosVitales(BaseModel):
    talla: Optional[str] = None
    peso: Optional[str] = None
    frecuencia_respiratoria: Optional[str] = None
    frecuencia_cardiaca: Optional[str] = None
    temperatura: Optional[str] = None
    tension_arterial: Optional[str] = None

class Cita(BaseModel):
    fecha: Optional[str] = None
    texto: Optional[str] = None
    material: Optional[str] = None
    costo_materiales: Optional[str] = None
    precio_cita: Optional[str] = None
    signos_vitales: Optional[SignosVitales] = SignosVitales()
    quien_atiende: Optional[str] = None

# Documento principal: Atencion
class Atencion(BaseModel):
    atencion_id: Optional[str] = None
    paciente_id: str
    fecha: str
    motivo_consulta: Optional[str] = None
    antecedentes: Optional[List[str]] = []
    notas: Optional[str] = None
    citas: Optional[List[Cita]] = []   # 👈 Array de citas embebidas

class AtencionUpdate(BaseModel):
    notas: Optional[str] = None
    antecedentes: Optional[List[str]] = None
    motivo_consulta: Optional[str] = None
    citas: Optional[List[Cita]] = None   # 👈 también permitir actualizar citas
