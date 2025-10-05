# librodiario/models.py
from pydantic import BaseModel, Field, root_validator
from typing import List, Optional, Union

class Material(BaseModel):
    nombre: str
    cantidad: Optional[int] = 1
    precio: Optional[float] = 0.0

class RegistroLibroDiario(BaseModel):
    fecha: str
    paciente_id: str
    nombres_completos: str
    ci: str
    telefono: Optional[str] = None
    email: Optional[str] = None
    motivo_consulta: Optional[str] = None
    costo_tratamiento: float = 0.0
    material: List[Union[str, dict]] = []
    costo_material: float = 0.0
    efectivo: Optional[float] = None
    transferencia: Optional[float] = None
    bancos: Optional[str] = None
    total: float = 0.0
    forma_pago: Optional[str] = None
    fisioterapeuta_nombre: Optional[str] = None

    @root_validator(pre=True)
    def convertir_material(cls, values):
        mats = values.get("material", [])
        nuevo = []
        for m in mats:
            if isinstance(m, dict):
                nuevo.append(m)
            elif isinstance(m, str):
                nuevo.append({"nombre": m, "cantidad": 1, "precio": 0.0})
        values["material"] = nuevo
        return values
