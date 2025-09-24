from pydantic import BaseModel, EmailStr
from typing import Optional

class Paciente(BaseModel):
    paciente_id: Optional[str] = None
    fecha_registro: Optional[str] = None
    nombres_completos: Optional[str] = None
    estado_civil: Optional[str] = None
    domicilio: Optional[str] = None
    email: Optional[str] = None
    ci: Optional[str] = None
    edad: Optional[int] = None
    sexo: Optional[str] = None
    ciudad: Optional[str] = None
    telefono: Optional[str] = None
    motivo_consulta: Optional[str] = None
