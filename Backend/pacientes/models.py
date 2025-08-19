from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class Paciente(BaseModel):
    paciente_id: Optional[str] = None  # Ahora opcional
    fecha_registro: str
    nombres_completos: str
    estado_civil: str
    domicilio: str
    email: EmailStr
    ci: str
    edad: int
    sexo: str
    origen: str
    telefono: str
    motivo_consulta: Optional[str] = None
