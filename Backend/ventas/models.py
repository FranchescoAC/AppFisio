from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VentaInput(BaseModel):
    item_id: str
    cantidad: int
    precio_unitario: float

class Venta(VentaInput):
    venta_id: Optional[str]  # Generado automáticamente
    fecha: datetime = datetime.now()
