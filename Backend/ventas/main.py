from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from bson.objectid import ObjectId
from ventas.database import ventas_collection  # Suponemos MongoDB configurado
from ventas.models import Venta, VentaInput
from inventario.database import inventario_collection 


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# POST /ventas/ -> Registrar una venta
@app.post("/ventas/", response_model=Venta)
def registrar_venta(venta: VentaInput):
    nuevo_id = f"V{ventas_collection.count_documents({}) + 1:03d}"
    venta_dict = venta.dict()
    venta_dict["venta_id"] = nuevo_id
    venta_dict["fecha"] = datetime.now()

    result = ventas_collection.insert_one(venta_dict)
    return venta_dict

# GET /ventas/ -> Listar todas las ventas
@app.get("/ventas/", response_model=list[Venta])
def obtener_ventas():
    ventas = list(ventas_collection.find({}, {"_id": 0}))
    return ventas

# GET /ventas/{item_id} -> Ventas de un producto específico
@app.get("/ventas/{item_id}", response_model=list[Venta])
def ventas_por_item(item_id: str):
    ventas = list(ventas_collection.find({"item_id": item_id}, {"_id": 0}))
    if not ventas:
        raise HTTPException(status_code=404, detail="No hay ventas para este item")
    return ventas

# GET /ventas/reportes -> Resumen de ventas y ganancias
@app.get("/ventas/reportes")
def reporte_ventas():
    ventas = list(ventas_collection.find({}))
    total_vendido = sum(v["cantidad"] for v in ventas)
    ganancia_total = sum(v["cantidad"] * v["precio_unitario"] for v in ventas)
    return {
        "total_ventas": total_vendido,
        "ganancia_total": ganancia_total,
        "cantidad_transacciones": len(ventas)
    }
