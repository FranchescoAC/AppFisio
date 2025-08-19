from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from atenciones.models import Atencion
from atenciones.database import atenciones_collection

app = FastAPI(title="Atenciones Service")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Listar todas las atenciones
@app.get("/atenciones/listar")
def listar_atenciones():
    atenciones = []
    for a in atenciones_collection.find():
        a["_id"] = str(a["_id"])
        atenciones.append(a)
    return atenciones


# Listar atenciones de un paciente específico
@app.get("/atenciones/listar/{paciente_id}")
def listar_atenciones_por_paciente(paciente_id: str):
    atenciones = []
    for a in atenciones_collection.find({"paciente_id": paciente_id}):
        a["_id"] = str(a["_id"])
        atenciones.append(a)

    if not atenciones:
        return {"message": f"No se encontraron atenciones para el paciente {paciente_id}"}

    return atenciones


# Registro de atención
@app.post("/atenciones/register")
def registrar_atencion(atencion: Atencion):
    atencion_dict = atencion.dict()

    # Generar atención_id automático
    total = atenciones_collection.count_documents({})
    atencion_dict["atencion_id"] = f"A{1 + total + 1}"

    result = atenciones_collection.insert_one(atencion_dict)
    return {
        "message": "Atención registrada",
        "atencion_id": atencion_dict["atencion_id"],
        "id": str(result.inserted_id)
    }

# Buscar atenciones por paciente_id o por fecha
@app.get("/atenciones/buscar")
def buscar_atenciones(paciente_id: str = None, fecha: str = None):
    query = {}
    if paciente_id:
        query["paciente_id"] = paciente_id
    if fecha:
        query["fecha"] = fecha  

    atenciones = []
    for a in atenciones_collection.find(query):
        a["_id"] = str(a["_id"])
        atenciones.append(a)

    return atenciones
