from pymongo import MongoClient, ReturnDocument

client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]

atenciones_collection = db["atenciones"]
counters_collection = db["counters"]

# ⚠️ Eliminar índice antiguo si existiera
try:
    atenciones_collection.drop_index("atencion_id_1")
except Exception:
    pass

# ✅ Índice único compuesto: paciente_id + atencion_id
atenciones_collection.create_index(
    [("paciente_id", 1), ("atencion_id", 1)],
    unique=True,
    name="uniq_paciente_atencion"
)

def get_next_atencion_id(paciente_id: str) -> str:
    """
    Genera A1, A2, A3... POR PACIENTE.
    Guarda el contador en 'counters' con clave paciente_id.
    """
    key = f"atencion_id:{paciente_id}"
    counter = counters_collection.find_one_and_update(
        {"_id": key},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return f"A{counter['seq']}"
