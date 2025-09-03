from pydantic import BaseModel
from typing import Literal

class Usuario(BaseModel):
    email: str
    password: str
    rol: Literal["paciente", "fisioterapeuta", "admin"]
