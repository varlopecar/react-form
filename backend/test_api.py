#!/usr/bin/env python3
"""
Simple API test script
Tests the main endpoints of the User Registration API
"""

import requests
import json
from datetime import datetime


def test_api():
    """Test the API endpoints"""

    base_url = "http://localhost:8000"

    print("🧪 Testing User Registration API")
    print("=" * 50)

    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Status: {data.get('status')}")
            print(f"   Database: {data.get('database')}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return

    # Test 2: CORS debug
    print("\n2. Testing CORS debug endpoint...")
    try:
        response = requests.get(f"{base_url}/cors-debug")
        print(f"✅ CORS debug: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   CORS origins: {data.get('cors_origins')}")
    except Exception as e:
        print(f"❌ CORS debug failed: {e}")

    # Test 3: Register a test user
    print("\n3. Testing user registration...")
    test_user = {
        "firstName": "Test",
        "lastName": "User",
        "email": f"test{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
        "birthDate": "1990-01-01",
        "city": "Test City",
        "postalCode": "12345",
        "password": "testpassword123"
    }

    try:
        response = requests.post(f"{base_url}/register", json=test_user)
        print(f"✅ Registration: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   User ID: {data.get('id')}")
            print(f"   Email: {data.get('email')}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Registration failed: {e}")

    # Test 4: Login with admin user
    print("\n4. Testing admin login...")
    admin_credentials = {
        "email": "admin@example.com",
        "password": "admin123"
    }

    try:
        response = requests.post(f"{base_url}/login", json=admin_credentials)
        print(f"✅ Admin login: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Token: {data.get('access_token')[:20]}...")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Admin login failed: {e}")

    print("\n" + "=" * 50)
    print("🎯 API Test Complete!")


if __name__ == "__main__":
    test_api()
