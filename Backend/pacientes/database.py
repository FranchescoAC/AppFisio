from pymongo import MongoClient, ReturnDocument

client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]

pacientes_collection = db["pacientes"]
counters_collection = db["counters"]

pacientes_collection.create_index("paciente_id", unique=True)

def get_next_paciente_id():
    counter = counters_collection.find_one_and_update(
        {"_id": "paciente_id"},
        {"$inc": {"seq": 1}},  # Incremento de 1
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return f"P{counter['seq']}"
