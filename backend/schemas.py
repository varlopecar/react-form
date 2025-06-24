from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(alias="firstName")
    last_name: str = Field(alias="lastName")
    birth_date: date = Field(alias="birthDate")
    city: str
    postal_code: str = Field(alias="postalCode")


class UserCreate(UserBase):
    password: str

    class Config:
        populate_by_name = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    birth_date: date
    city: str
    postal_code: str
    is_admin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
