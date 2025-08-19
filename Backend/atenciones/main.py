from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from atenciones.models import Atencion
from atenciones.database import atenciones_collection, get_next_atencion_id
from pymongo.errors import DuplicateKeyError


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

# Listar atenciones por paciente
@app.get("/atenciones/listar/{paciente_id}")
def listar_atenciones(paciente_id: str):
    atenciones = []
    for a in atenciones_collection.find({"paciente_id": paciente_id}):
        a["_id"] = str(a["_id"])
        atenciones.append(a)
    return atenciones
