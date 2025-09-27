# librodiario/models.py
from pydantic import BaseModel
from typing import List, Optional

class RegistroLibroDiario(BaseModel):
    fecha: Optional[str] = None
    paciente_id: Optional[str] = None
    nombres_completos: Optional[str] = None
    ci: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    atencion_id: Optional[str] = None
    cita_id: Optional[int] = None
    motivo_consulta: Optional[str] = None
    costo_tratamiento: Optional[float] = None
    material: Optional[List[str]] = []
    costo_material: Optional[float] = None
    efectivo: Optional[float] = None
    transferencia: Optional[float] = None
    bancos: Optional[str] = None  # ✅ Nuevo campo
    total: Optional[float] = None
    forma_pago: Optional[str] = None
    fisioterapeuta_id: Optional[str] = None
    fisioterapeuta_nombre: Optional[str] = None  # ✅ Nuevo campo
