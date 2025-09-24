from pymongo import MongoClient, ReturnDocument

client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]

pacientes_collection = db["pacientes"]
counters_collection = db["counters"]

# Índice único solo para paciente_id (si quieres seguir garantizando ids únicos)
pacientes_collection.create_index("paciente_id", unique=True)

def get_next_paciente_id():
    """
    Incrementa el contador y devuelve el siguiente paciente_id (P1, P2, ...)
    Usar SOLO cuando realmente vayas a insertar un paciente.
    """
    counter = counters_collection.find_one_and_update(
        {"_id": "paciente_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return f"P{counter['seq']}"

def peek_next_paciente_id():
    """
    Lee el contador sin incrementarlo. Ideal para mostrar 'próximo id' en la UI.
    """
    counter = counters_collection.find_one({"_id": "paciente_id"})
    seq = counter["seq"] + 1 if counter and "seq" in counter else 1
    return f"P{seq}"
