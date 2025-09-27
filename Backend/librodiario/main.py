# librodiario/main.py
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from librodiario.models import RegistroLibroDiario
from pymongo import MongoClient
from bson import ObjectId
from atenciones.database import atenciones_collection
from atenciones.main import fisioterapeutas_collection
from pydantic import BaseModel
from typing import List
from datetime import datetime

# --- MongoDB ---
client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]
libro_collection = db["libro_diario"]
fisioterapeutas_collection = db["fisioterapeutas"]

# --- FastAPI ---
app = FastAPI(title="Libro Diario Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

# --- Modelo para agregar material ---
class MaterialUpdate(BaseModel):
    paciente: str
    material: str
    costo_material: float

# --- Registrar un registro en Libro Diario ---
@app.post("/librodiario/register")
async def registrar_libro(registro: RegistroLibroDiario):
    try:
        registro_dict = {k: v for k, v in registro.dict().items() if v is not None}
        result = libro_collection.insert_one(registro_dict)
        return {"message": "Registro agregado", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Listar registros ---
@app.get("/librodiario/listar")
async def listar_libro(
    fecha: Optional[str] = Query(None, description="YYYY-MM-DD"),
    mes: Optional[int] = Query(None, ge=1, le=12, description="Mes en formato numérico"),
    anio: Optional[int] = Query(None, description="Año en formato YYYY")
):
    filtro = {}

    # Filtrar por fecha exacta
    if fecha:
        filtro["fecha"] = fecha

    # Filtrar por mes y año
    elif mes and anio:
        # Rango de inicio y fin del mes
        inicio = f"{anio}-{str(mes).zfill(2)}-01"
        if mes == 12:
            fin = f"{anio+1}-01-01"
        else:
            fin = f"{anio}-{str(mes+1).zfill(2)}-01"

        filtro["fecha"] = {"$gte": inicio, "$lt": fin}

    resultados = list(libro_collection.find(filtro).sort("_id", -1).limit(1000))

    for r in resultados:
        r["_id"] = str(r["_id"])
        r["fisioterapeuta_nombre"] = r.get("fisioterapeuta_nombre", "-")

    return resultados

# --- Agregar material a un registro ---
@app.post("/librodiario/agregar-material")
async def agregar_material(data: MaterialUpdate):
    # actualizar en libro diario
    libro_collection.update_one(
        {"paciente_id": data.paciente},
        {"$set": {"material": data.material, "costo_material": data.costo_material}}
    )

    # actualizar también en cita (colección atenciones)
    atenciones_collection.update_one(
        {"paciente_id": data.paciente},
        {"$set": {"material": data.material, "costo_material": data.costo_material}}
    )

    return {"msg": "Material agregado correctamente"}
