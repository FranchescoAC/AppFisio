from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from inventario.database import inventario_collection
from inventario.models import Inventario, InventarioInput
from pydantic import BaseModel

class CambioCantidad(BaseModel):
    cantidad: int

app = FastAPI()

# CORS para que el frontend pueda comunicarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar por el dominio de tu frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------
# ✅ Crear item
# -------------------
@app.post("/inventario/", response_model=Inventario)
def crear_item(item: InventarioInput):
    nuevo_id = f"I{inventario_collection.count_documents({}) + 1:03d}"
    item_dict = item.dict()
    item_dict["item_id"] = nuevo_id
    inventario_collection.insert_one(item_dict)
    return item_dict

# -------------------
# ✅ Obtener inventario
# -------------------
@app.get("/inventario/", response_model=list[Inventario])
def obtener_inventario():
    items = list(inventario_collection.find({}, {"_id": 0}))
    return items

# -------------------
# ✅ Actualizar item (cualquier campo, cantidad se suma o resta correctamente)
# -------------------
@app.put("/inventario/{item_id}")
def actualizar_item(item_id: str, data: dict):
    item = inventario_collection.find_one({"item_id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    update_data = {}
    for key, value in data.items():
        if key in ["nombre", "descripcion", "unidad", "imagen_url", "precio_compra", "precio_venta"]:
            update_data[key] = value
        elif key == "cantidad":
            # Si la cantidad viene negativa, restar; si positiva, sumar
            nueva_cantidad = item.get("cantidad", 0) + value
            if nueva_cantidad < 0:
                raise HTTPException(status_code=400, detail="Cantidad no puede ser negativa")
            update_data["cantidad"] = nueva_cantidad

    inventario_collection.update_one({"item_id": item_id}, {"$set": update_data})
    return {"msg": "Item actualizado", **update_data}

# -------------------
# ✅ Eliminar item
# -------------------
@app.delete("/inventario/{item_id}")
def eliminar_item(item_id: str):
    result = inventario_collection.delete_one({"item_id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    return {"msg": "Item eliminado"}
