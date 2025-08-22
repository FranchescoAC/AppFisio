from pydantic import BaseModel
from typing import Optional

class Inventario(BaseModel):
    item_id: Optional[str]  # Generado automáticamente
    nombre: str
    descripcion: Optional[str] = None
    cantidad: int
    unidad: str  # ej: "cajas", "frascos", "paquetes"
    imagen_url: Optional[str] = None
    precio_compra: float = 0.0
    precio_venta: float = 0.0
