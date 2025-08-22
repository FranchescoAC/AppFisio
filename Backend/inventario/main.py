from fastapi import FastAPI, HTTPException
from bson.objectid import ObjectId
from inventario.database import inventario_collection
from inventario.models import Inventario
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o el dominio de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Registrar item
@app.post("/inventario/")
def crear_item(item: Inventario):
    ultimo = inventario_collection.find().sort("_id", -1).limit(1)
    nuevo_id = f"I{inventario_collection.count_documents({}) + 1:03d}"

    item_dict = item.dict()
    item_dict["item_id"] = nuevo_id
    result = inventario_collection.insert_one(item_dict)
    return {"msg": "Item agregado", "id": str(result.inserted_id)}

# ✅ Ver inventario completo
@app.get("/inventario/")
def obtener_inventario():
    items = list(inventario_collection.find({}, {"_id": 0}))
    return items

# ✅ Actualizar stock
@app.put("/inventario/{item_id}")
def actualizar_item(item_id: str, data: Inventario):
    result = inventario_collection.update_one(
        {"item_id": item_id}, {"$set": data.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    return {"msg": "Item actualizado"}

# ✅ Eliminar item
@app.delete("/inventario/{item_id}")
def eliminar_item(item_id: str):
    result = inventario_collection.delete_one({"item_id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    return {"msg": "Item eliminado"}
