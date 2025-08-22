from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from atenciones.models import Atencion
from atenciones.database import atenciones_collection, get_next_atencion_id
from pymongo.errors import DuplicateKeyError
from pymongo import MongoClient

# Conectar también a pacientes
client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]
pacientes_collection = db["pacientes"]

app = FastAPI(title="Atenciones Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar atención
@app.post("/atenciones/register")
def registrar_atencion(atencion: Atencion):
    atencion_dict = atencion.dict(exclude={"atencion_id"})
    atencion_dict["atencion_id"] = get_next_atencion_id()

    try:
        result = atenciones_collection.insert_one(atencion_dict)
        return {
            "message": "Atención registrada",
            "atencion_id": atencion_dict["atencion_id"],
            "id": str(result.inserted_id)
        }
    except DuplicateKeyError:
        return {"error": "Ya existe una atención con este ID. Intenta de nuevo."}
    except Exception as e:
        return {"error": f"Error al registrar atención: {e}"}

# Listar atenciones por paciente_id
@app.get("/atenciones/listar/{paciente_id}")
def listar_atenciones(paciente_id: str):
    atenciones = []
    for a in atenciones_collection.find({"paciente_id": paciente_id}):
        a["_id"] = str(a["_id"])
        atenciones.append(a)
    return atenciones

# 🔎 Nuevo: buscar atenciones por nombre o id
@app.get("/atenciones/buscar")
def buscar_atenciones(query: str = Query(..., description="Nombre o ID del paciente")):
    # 1. Buscar paciente por nombre o id
    paciente = pacientes_collection.find_one({
        "$or": [
            {"paciente_id": query},
            {"nombres_completos": {"$regex": query, "$options": "i"}}
        ]
    })

    if not paciente:
        return []

    paciente_id = paciente["paciente_id"]

    # 2. Buscar atenciones del paciente
    atenciones = []
    for a in atenciones_collection.find({"paciente_id": paciente_id}):
        a["_id"] = str(a["_id"])
        atenciones.append(a)

    return atenciones
