from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pacientes.models import Paciente
from pacientes.database import pacientes_collection

app = FastAPI(title="Pacientes Service")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Listar todos los pacientes
@app.get("/pacientes/listar")
def listar_pacientes():
    pacientes = []
    for p in pacientes_collection.find():
        p["_id"] = str(p["_id"])
        pacientes.append(p)
    return pacientes



# Registro de paciente
@app.post("/pacientes/register")
def registrar_paciente(paciente: Paciente):
    paciente_dict = paciente.dict()

    # Generar paciente_id automático (ejemplo: P1001, P1002, ...)
    total = pacientes_collection.count_documents({})
    paciente_dict["paciente_id"] = f"P{1000 + total + 1}"

    result = pacientes_collection.insert_one(paciente_dict)
    return {"message": "Paciente registrado", "paciente_id": paciente_dict["paciente_id"], "id": str(result.inserted_id)}

