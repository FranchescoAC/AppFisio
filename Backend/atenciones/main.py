from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from atenciones.models import Atencion, AtencionUpdate
from atenciones.database import atenciones_collection, get_next_atencion_id
from pymongo.errors import DuplicateKeyError
from pymongo import MongoClient
from bson import ObjectId

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
    # ✅ Generar ID por paciente
    atencion_dict["atencion_id"] = get_next_atencion_id(atencion.paciente_id)

    try:
        result = atenciones_collection.insert_one(atencion_dict)
        return {
            "message": "Atención registrada",
            "atencion_id": atencion_dict["atencion_id"],
            "id": str(result.inserted_id)
        }
    except DuplicateKeyError:
        # Esto solo saldría si intentaras duplicar (paciente_id, atencion_id)
        raise HTTPException(status_code=409, detail="Ya existe una atención con ese ID para este paciente")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al registrar atención: {e}")

# Listar atenciones por paciente_id
@app.get("/atenciones/listar/{paciente_id}")
def listar_atenciones(paciente_id: str):
    atenciones = []
    # Puedes ordenar por fecha si quieres mantener cronología
    for a in atenciones_collection.find({"paciente_id": paciente_id}):
        a["_id"] = str(a["_id"])
        atenciones.append(a)
    return atenciones

# 🔎 Buscar atenciones por nombre o id de paciente
@app.get("/atenciones/buscar")
def buscar_atenciones(query: str = Query(..., description="Nombre o ID del paciente")):
    paciente = pacientes_collection.find_one({
        "$or": [
            {"paciente_id": query},
            {"nombres_completos": {"$regex": query, "$options": "i"}}
        ]
    })
    if not paciente:
        return []

    paciente_id = paciente["paciente_id"]
    atenciones = []
    for a in atenciones_collection.find({"paciente_id": paciente_id}):
        a["_id"] = str(a["_id"])
        atenciones.append(a)
    return atenciones

# ✅ Actualizar por _id de Mongo (lo que manda tu frontend)
@app.put("/atenciones/{atencion_id}")
def update_atencion(atencion_id: str, datos_actualizados: dict = Body(...)):
    """
    Actualiza una atención parcialmente.
    Se puede enviar solo los campos que se desean modificar, por ejemplo:
    {
        "tratamiento": { "fase_intermedia": "...", "fase_final": "..." },
        "notas": "..."
    }
    """
    # Convertimos el _id a ObjectId si es necesario
    from bson import ObjectId

    # Intentamos actualizar
    result = atenciones_collection.update_one(
        {"_id": ObjectId(atencion_id)},
        {"$set": datos_actualizados}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Atención no encontrada")

    return {"message": "Atención actualizada correctamente"}