from pymongo import MongoClient
from bson.objectid import ObjectId

MONGO_URL = "mongodb://localhost:27017"
client = MongoClient(MONGO_URL)
db = client["clinica_fisio"]

usuarios_collection = db["usuarios"]
