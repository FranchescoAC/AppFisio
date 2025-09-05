from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import DuplicateKeyError
from pacientes.models import Paciente
from pacientes.database import pacientes_collection, counters_collection, get_next_paciente_id

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
    paciente_dict = paciente.dict(exclude={"paciente_id"})
    paciente_dict["paciente_id"] = get_next_paciente_id()

    try:
        result = pacientes_collection.insert_one(paciente_dict)
        return {
            "message": "Paciente registrado",
            "paciente_id": paciente_dict["paciente_id"],
            "id": str(result.inserted_id)
        }
    except DuplicateKeyError as e:
        if "email" in str(e):
            raise HTTPException(status_code=400, detail="Email ya registrado")
        elif "ci" in str(e):
            raise HTTPException(status_code=400, detail="CI ya registrada")
        else:
            raise HTTPException(status_code=400, detail="Paciente duplicado")

@app.get("/pacientes/next_id")
def obtener_siguiente_id():
    counter = counters_collection.find_one({"_id": "paciente_id"})
    seq = counter["seq"] + 1 if counter else 1
    return {"next_paciente_id": f"P{seq}"}
