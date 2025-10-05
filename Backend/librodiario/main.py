# librodiario/main.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from librodiario.models import RegistroLibroDiario
from pymongo import MongoClient
from bson import ObjectId
from typing import Optional
import os

app = FastAPI()

# CORS para tu frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["clinica_fisio"]
registros_col = db["libro_diario"]

# ------------------- CRUD -------------------

@app.post("/librodiario/registrar")
def registrar_registro(registro: RegistroLibroDiario):
    doc = registro.dict()  # ✅ ya material es lista de dicts
    result = registros_col.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


@app.get("/librodiario/listar")
def listar_registros(
    fecha: Optional[str] = None,
    mes: Optional[int] = None,
    anio: Optional[int] = None
):
    query = {}
    if fecha:
        query["fecha"] = fecha
    elif mes and anio:
        # Filtro por mes y año: asumimos fecha como "YYYY-MM-DD"
        query["fecha"] = {"$regex": f"^{anio:04d}-{mes:02d}-"}

    docs = list(registros_col.find(query))
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs

@app.put("/librodiario/actualizar/{id}")
def actualizar_registro(id: str, registro: RegistroLibroDiario):
    result = registros_col.update_one({"_id": ObjectId(id)}, {"$set": registro.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return {"_id": id, "status": "actualizado"}

@app.delete("/librodiario/eliminar/{id}")
def eliminar_registro(id: str):
    result = registros_col.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return {"_id": id, "status": "eliminado"}
