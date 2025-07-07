from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from database import Base
import enum


class UserRole(enum.Enum):
    admin = "admin"
    user = "user"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.user)
    birth_date = Column(Date, nullable=False)
    city = Column(String(100), nullable=False)
    postal_code = Column(String(10), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    @property
    def is_admin(self):
        return self.role == UserRole.admin
