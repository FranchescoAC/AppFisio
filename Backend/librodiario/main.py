# librodiario/main.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from librodiario.models import RegistroLibroDiario
from pymongo import MongoClient
from bson import ObjectId
from fastapi import FastAPI, Body
from pydantic import BaseModel
from atenciones.database import atenciones_collection
from atenciones.main import fisioterapeutas_collection

app = FastAPI()

class MaterialUpdate(BaseModel):
    paciente: str
    material: str
    costo_material: float

# Mongo
client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]
libro_collection = db["libro_diario"]
fisioterapeutas_collection = db["fisioterapeutas"]

app = FastAPI(title="Libro Diario Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

@app.post("/librodiario/register")
async def registrar_libro(registro: RegistroLibroDiario):
    # Convertir None a no incluir o dejar, depende de preferencia.
    registro_dict = {k: v for k, v in registro.dict().items()}
    # Si quieres calcular costo_material y total en backend:
    try:
        # Si costo_material es None, intentar calcular desde material si hubiera precios guardados
        # (esto es opcional; por ahora insertamos lo que venga).
        result = libro_collection.insert_one(registro_dict)
        return {"message": "Registro agregado", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/librodiario/listar")
async def listar_libro(fecha: Optional[str] = Query(None, description="YYYY-MM-DD")):
    filtro = {}
    if fecha:
        filtro["fecha"] = fecha

    resultados = list(libro_collection.find(filtro).sort("_id", -1).limit(1000))

    # Recorrer resultados para agregar nombre del fisioterapeuta
    for r in resultados:
        # Convertir _id a string
        r["_id"] = str(r["_id"])

        # Buscar fisioterapeuta por ID si existe
        fisio_id = r.get("fisioterapeuta")
        if fisio_id:
            fisio = fisioterapeutas_collection.find_one({"fisioterapeuta_id": fisio_id})
            r["fisioterapeuta"] = fisio["nombre"] if fisio else "-"
        else:
            r["fisioterapeuta"] = "-"

    return resultados

@app.post("/librodiario/agregar-material")
async def agregar_material(data: MaterialUpdate):
    # actualizar en libro diario
    libro_diario_collection.update_one(
        {"paciente": data.paciente},
        {"$set": {"material": data.material, "costo_material": data.costo_material}}
    )

    # actualizar también en cita (colección atenciones)
    atenciones_collection.update_one(
        {"paciente": data.paciente},
        {"$set": {"material": data.material, "costo_material": data.costo_material}}
    )

    return {"msg": "Material agregado correctamente"}