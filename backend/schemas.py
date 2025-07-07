from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional


class UserBase(BaseModel):
    last_name: str = Field(alias="lastName")
    first_name: str = Field(alias="firstName")
    email: EmailStr
    birth_date: date = Field(alias="birthDate")
    city: str
    postal_code: str = Field(alias="postalCode")

    class Config:
        populate_by_name = True


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    email: str
    role: str
    birth_date: date
    city: str
    postal_code: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
