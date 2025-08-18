from pymongo import MongoClient

# Conexión a MongoDB (local por ahora)
client = MongoClient("mongodb://localhost:27017/")
db = client["clinica_fisio"]

pacientes_collection = db["pacientes"]
