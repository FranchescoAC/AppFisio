from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from inventario.database import inventario_collection
from inventario.models import Inventario, InventarioInput

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
# ✅ Actualizar item (cantidad o cualquier campo)
# -------------------
@app.put("/inventario/{item_id}", response_model=Inventario)
def actualizar_item(item_id: str, data: InventarioInput):
    result = inventario_collection.update_one(
        {"item_id": item_id},
        {"$set": data.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    item_actualizado = inventario_collection.find_one({"item_id": item_id}, {"_id": 0})
    return item_actualizado

# -------------------
# ✅ Eliminar item
# -------------------
@app.delete("/inventario/{item_id}")
def eliminar_item(item_id: str):
    result = inventario_collection.delete_one({"item_id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    return {"msg": "Item eliminado"}
