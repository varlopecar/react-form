#!/usr/bin/env python3
"""
Test script to verify SSL connection configuration
"""
import os
import sys
from database import get_ssl_config, create_engine_with_retry


def test_ssl_config():
    """Test SSL configuration for different database URLs"""

    # Test cases
    test_urls = [
        "mysql+pymysql://user:pass@localhost:3306/db",
        "mysql+pymysql://user:pass@planetscale.com:3306/db",
        "mysql+pymysql://user:pass@railway.app:3306/db",
        "mysql+pymysql://user:pass@vercel.com:3306/db?ssl-mode=REQUIRED",
        "mysql+pymysql://user:pass@heroku.com:3306/db?ssl-mode=REQUIRED&other=param",
    ]

    print("Testing SSL configuration...")

    for url in test_urls:
        print(f"\nTesting URL: {url}")
        try:
            ssl_config = get_ssl_config(url)
            print(f"SSL Config: {ssl_config}")
        except Exception as e:
            print(f"Error: {e}")

    print("\n✅ SSL configuration test completed")


def test_connection_creation():
    """Test that engine creation doesn't fail with ssl-mode error"""
    print("\nTesting engine creation...")

    # Set a test DATABASE_URL
    os.environ["DATABASE_URL"] = "mysql+pymysql://test:test@localhost:3306/test"

    try:
        # This should not raise the ssl-mode error
        engine = create_engine_with_retry()
        print("✅ Engine creation successful (connection will fail but no ssl-mode error)")
    except Exception as e:
        if "ssl-mode" in str(e).lower():
            print(f"❌ SSL-mode error still present: {e}")
            return False
        else:
            print(f"✅ Expected connection error (not ssl-mode): {e}")

    return True


if __name__ == "__main__":
    test_ssl_config()
    test_connection_creation()
    print("\n🎉 All tests completed!")
