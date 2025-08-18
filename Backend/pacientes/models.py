from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class Paciente(BaseModel):
    paciente_id: str  # Ej: P 461
    fecha_registro: str  # o date si quieres manejar como fecha
    nombres_completos: str
    estado_civil: str  # casado, soltero, divorciado, viudo
    domicilio: str
    email: EmailStr
    ci: str  # cédula de identidad
    edad: int
    sexo: str  # Masculino / Femenino
    origen: str  # país de origen
    telefono: str
    motivo_consulta: Optional[str] = None
