from pymongo import MongoClient

# Cambia la URI si tu MongoDB tiene usuario/contraseña
MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)

db = client["clinica_fisio"]  # Nombre de la base de datos
atenciones_collection = db["atenciones"]
