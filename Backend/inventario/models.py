from pydantic import BaseModel
from typing import Optional

# Modelo que se envía y recibe en frontend
class Inventario(BaseModel):
    item_id: Optional[str]  # Se genera automáticamente
    nombre: str
    descripcion: Optional[str] = None
    cantidad: int
    unidad: str
    imagen_url: Optional[str] = None
    precio_compra: float = 0.0
    precio_venta: float = 0.0

# Modelo de input para creación (sin item_id)
class InventarioInput(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    cantidad: int
    unidad: str
    imagen_url: Optional[str] = None
    precio_compra: float = 0.0
    precio_venta: float = 0.0
