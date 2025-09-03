from pydantic import BaseModel

class UsuarioLogin(BaseModel):
    email: str
    password: str

class UsuarioResponse(BaseModel):
    email: str
    rol: str
    token: str
