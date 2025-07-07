from pydantic import BaseModel, EmailStr
from datetime import date

class UserRegister(BaseModel):
    last_name: str
    first_name: str
    email: EmailStr
    birth_date: date
    city: str
    postal_code: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    email: str
    birth_date: date
    city: str
    postal_code: str
    role: str 