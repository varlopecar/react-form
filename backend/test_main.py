import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import date
import os

from main import app
from database import Base, get_db
from models import User
from passlib.context import CryptContext

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

# Create test tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def admin_user(test_db):
    hashed_password = pwd_context.hash("admin123")
    db = TestingSessionLocal()
    admin = User(
        email="admin@example.com",
        password=hashed_password,
        first_name="Admin",
        last_name="User",
        birth_date=date(1990, 1, 1),
        city="Paris",
        postal_code="75001",
        is_admin=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    db.close()
    return admin


@pytest.fixture
def regular_user(test_db):
    hashed_password = pwd_context.hash("user123")
    db = TestingSessionLocal()
    user = User(
        email="user@example.com",
        password=hashed_password,
        first_name="Regular",
        last_name="User",
        birth_date=date(1995, 5, 15),
        city="Lyon",
        postal_code="69001",
        is_admin=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


class TestRoot:
    def test_read_root(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "React Form API - Updated for deployment test!"
        assert data["status"] == "running"
        assert data["version"] == "1.0.1"


class TestUserRegistration:
    def test_register_user_success(self, test_db):
        user_data = {
            "email": "newuser@example.com",
            "password": "newpassword123",
            "first_name": "New",
            "last_name": "User",
            "birth_date": "1990-01-01",
            "city": "Marseille",
            "postal_code": "13001"
        }
        response = client.post("/register", json=user_data)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["first_name"] == user_data["first_name"]
        assert data["last_name"] == user_data["last_name"]
        assert data["is_admin"] == False

    def test_register_user_duplicate_email(self, test_db, regular_user):
        user_data = {
            "email": "user@example.com",  # Same email as existing user
            "password": "newpassword123",
            "first_name": "New",
            "last_name": "User",
            "birth_date": "1990-01-01",
            "city": "Marseille",
            "postal_code": "13001"
        }
        response = client.post("/register", json=user_data)
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]


class TestUserLogin:
    def test_login_success(self, test_db, regular_user):
        login_data = {
            "email": "user@example.com",
            "password": "user123"
        }
        response = client.post("/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, test_db):
        login_data = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        response = client.post("/login", json=login_data)
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]


class TestUserManagement:
    def test_get_users_as_admin(self, test_db, admin_user, regular_user):
        # Login as admin
        login_response = client.post("/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        token = login_response.json()["access_token"]

        # Get users list
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/users", headers=headers)
        assert response.status_code == 200
        users = response.json()
        assert len(users) == 2  # admin + regular user

    def test_get_users_as_regular_user(self, test_db, regular_user):
        # Login as regular user
        login_response = client.post("/login", json={
            "email": "user@example.com",
            "password": "user123"
        })
        token = login_response.json()["access_token"]

        # Try to get users list
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/users", headers=headers)
        assert response.status_code == 403
        assert "Not authorized" in response.json()["detail"]

    def test_delete_user_as_admin(self, test_db, admin_user, regular_user):
        # Login as admin
        login_response = client.post("/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        token = login_response.json()["access_token"]

        # Delete regular user
        headers = {"Authorization": f"Bearer {token}"}
        response = client.delete(f"/users/{regular_user.id}", headers=headers)
        assert response.status_code == 200
        assert "User deleted successfully" in response.json()["message"]

    def test_delete_admin_user(self, test_db, admin_user):
        # Login as admin
        login_response = client.post("/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        token = login_response.json()["access_token"]

        # Try to delete admin user
        headers = {"Authorization": f"Bearer {token}"}
        response = client.delete(f"/users/{admin_user.id}", headers=headers)
        assert response.status_code == 400
        assert "Cannot delete admin user" in response.json()["detail"]

    def test_get_current_user_info(self, test_db, regular_user):
        # Login as regular user
        login_response = client.post("/login", json={
            "email": "user@example.com",
            "password": "user123"
        })
        token = login_response.json()["access_token"]

        # Get current user info
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "user@example.com"
        assert data["first_name"] == "Regular"
        assert data["last_name"] == "User"


class TestAuthentication:
    def test_protected_endpoint_without_token(self, test_db):
        response = client.get("/users")
        assert response.status_code == 403
        assert "Not authenticated" in response.json()["detail"]

    def test_protected_endpoint_with_invalid_token(self, test_db):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/users", headers=headers)
        assert response.status_code == 401
        assert "Invalid authentication credentials" in response.json()[
            "detail"]
