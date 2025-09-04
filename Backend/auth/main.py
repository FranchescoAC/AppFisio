from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from auth.database import usuarios_collection
from auth.models import Usuario
from auth.schemas import UsuarioLogin, UsuarioResponse
from auth.utils import hash_password, verify_password, create_token, decode_token

app = FastAPI()

# CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# --- Helpers ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload  # {email, rol}

# --- Endpoints ---
@app.post("/auth/register")
def register(usuario: Usuario, current_user=Depends(get_current_user)):
    # Solo ADMIN puede registrar
    if current_user.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    if usuarios_collection.find_one({"email": usuario.email}):
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    hashed_pass = hash_password(usuario.password)
    usuarios_collection.insert_one({
        "email": usuario.email,
        "password": hashed_pass,
        "rol": usuario.rol
    })
    # Devolvemos email/rol para que el frontend muestre toast correcto
    return {"email": usuario.email, "rol": usuario.rol, "msg": "Usuario creado"}

@app.post("/auth/login", response_model=UsuarioResponse)
def login(usuario: UsuarioLogin):
    user = usuarios_collection.find_one({"email": usuario.email})
    if not user or not verify_password(usuario.password, user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_token({"email": usuario.email, "rol": user["rol"]})
    return {"email": usuario.email, "rol": user["rol"], "token": token}

# Ejemplos de rutas protegidas por rol
@app.get("/pacientes")
def listar_pacientes(user=Depends(get_current_user)):
    if user["rol"] not in ["fisioterapeuta", "admin"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    return [{"nombre": "Paciente 1"}, {"nombre": "Paciente 2"}]

@app.get("/analisis-ventas")
def analisis_ventas(user=Depends(get_current_user)):
    if user["rol"] != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    return {"ventas": "Aquí va el análisis de ventas"}
