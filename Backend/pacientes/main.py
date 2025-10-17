from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pacientes.models import Paciente
from pacientes.database import pacientes_collection, get_next_paciente_id, peek_next_paciente_id
from bson import ObjectId

app = FastAPI(title="Pacientes Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/pacientes/listar")
def listar_pacientes():
    pacientes = []
    for p in pacientes_collection.find():
        p["_id"] = str(p["_id"])
        pacientes.append(p)
    return pacientes

@app.post("/pacientes/register")
def registrar_paciente(paciente: Paciente):
    paciente_dict = paciente.dict(exclude={"paciente_id"})
    paciente_dict["paciente_id"] = get_next_paciente_id()  # <-- Incrementa solo aquí
    result = pacientes_collection.insert_one(paciente_dict)
    return {
        "message": "Paciente registrado",
        "paciente_id": paciente_dict["paciente_id"],
        "id": str(result.inserted_id)
    }

@app.get("/pacientes/next_id")
def obtener_siguiente_id():
    # Devuelve el próximo ID SIN incrementar el contador
    return {"next_paciente_id": peek_next_paciente_id()}

@app.get("/pacientes/buscar")
def buscar_pacientes(query: str = Query(..., min_length=1)):
    """
    Buscar pacientes por CI o por nombres (parcial o completo).
    """
    filtro = {
        "$or": [
            {"ci": {"$regex": query, "$options": "i"}},
            {"nombres_completos": {"$regex": query, "$options": "i"}}
        ]
    }

    resultados = pacientes_collection.find(filtro).sort("fecha_registro", -1).limit(20)

    pacientes = []
    for p in resultados:
        p["_id"] = str(p["_id"])
        pacientes.append(p)

    return pacientes

@app.put("/pacientes/{paciente_id}")
def actualizar_paciente(paciente_id: str, datos: Paciente):
    if not ObjectId.is_valid(paciente_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    update_result = pacientes_collection.update_one(
        {"_id": ObjectId(paciente_id)},
        {"$set": datos.dict(exclude_unset=True, exclude={"paciente_id"})}
    )

    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    paciente_actualizado = pacientes_collection.find_one({"_id": ObjectId(paciente_id)})
    paciente_actualizado["_id"] = str(paciente_actualizado["_id"])
    return paciente_actualizado

@app.delete("/pacientes/{paciente_id}")
def eliminar_paciente(paciente_id: str):
    if not ObjectId.is_valid(paciente_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    resultado = pacientes_collection.delete_one({"_id": ObjectId(paciente_id)})

    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    return {"message": "Paciente eliminado correctamente"}
