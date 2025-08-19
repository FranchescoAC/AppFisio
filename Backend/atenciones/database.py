from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]

atenciones_collection = db["atenciones"]
counters_collection = db["counters"]

# Crear índice único para atencion_id
atenciones_collection.create_index("atencion_id", unique=True)

def get_next_atencion_id():
    counter = counters_collection.find_one_and_update(
        {"_id": "atencion_id"},
        {"$inc": {"seq": 1}},  # incrementa en 1
        upsert=True,
        return_document=True
    )
    return f"A{counter['seq']}"
