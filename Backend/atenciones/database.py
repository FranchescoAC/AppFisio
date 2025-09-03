from pymongo import MongoClient, ReturnDocument

client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]

atenciones_collection = db["atenciones"]
counters_collection = db["counters"]

# ⚠️ Asegúrate de NO tener ya un índice único solo por "atencion_id"
# Intenta eliminarlo si existe (no rompe si no existe)
try:
    atenciones_collection.drop_index("atencion_id_1")
except Exception:
    pass

# ✅ Índice único compuesto: por paciente y por nro de atención
atenciones_collection.create_index(
    [("paciente_id", 1), ("atencion_id", 1)],
    unique=True,
    name="uniq_paciente_atencion"
)

def get_next_atencion_id(paciente_id: str) -> str:
    """
    Genera A1, A2, A3... PERO por paciente.
    Guarda el contador en la colección 'counters' con clave por paciente.
    """
    key = f"atencion_id:{paciente_id}"
    counter = counters_collection.find_one_and_update(
        {"_id": key},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return f"A{counter['seq']}"
