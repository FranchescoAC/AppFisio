from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pacientes.models import Paciente
from pacientes.database import pacientes_collection, get_next_paciente_id, peek_next_paciente_id

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
