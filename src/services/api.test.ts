import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiService } from "./api";
import { RegistrationFormData } from "../schemas/registrationSchema";
import type { Mock } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

// Create a test instance with a fixed base URL
const apiService = new ApiService("http://localhost:8000");

describe("ApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage for auth token
    global.localStorage = {
      getItem: vi.fn(() => "user@example.com"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 1,
    } as unknown as Storage;
  });

  describe("registerUser", () => {
    it("should register a user successfully", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        birth_date: "1990-01-01",
        city: "Paris",
        postal_code: "75001",
        is_admin: false,
        created_at: "2024-01-01T00:00:00Z",
      };

      (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: "Registration successful!",
          user: mockUser,
        }),
      });

      const userData: RegistrationFormData & { password: string } = {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        birthDate: new Date("1990-01-01"),
        city: "Paris",
        postalCode: "75001",
      };

      const result = await apiService.registerUser(userData);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: "Test",
          last_name: "User",
          email: "test@example.com",
          birth_date: "1990-01-01",
          city: "Paris",
          postal_code: "75001",
          password: "password123",
        }),
        credentials: "omit",
        mode: "cors",
      });
      expect(result).toEqual(mockUser);
    });

    it("should handle registration errors", async () => {
      (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: false, 
          error: "Email already registered" 
        }),
      });

      const userData: RegistrationFormData & { password: string } = {
        email: "existing@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        birthDate: new Date("1990-01-01"),
        city: "Paris",
        postalCode: "75001",
      };

      await expect(apiService.registerUser(userData)).rejects.toThrow(
        "Email already registered"
      );
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        first_name: "Test",
        last_name: "User",
        birth_date: "1990-01-01",
        city: "Paris",
        postal_code: "75001",
        is_admin: false,
        created_at: "2024-01-01T00:00:00Z",
      };

      const mockResponse = {
        success: true,
        access_token: "user@example.com",
        token_type: "bearer",
        user: mockUser,
      };

      (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const credentials = {
        email: "user@example.com",
        password: "password123",
      };

      const result = await apiService.login(credentials);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "omit",
        mode: "cors",
      });
      expect(result).toEqual({
        access_token: "user@example.com",
        token_type: "bearer",
        user: mockUser,
      });
    });

    it("should handle login errors", async () => {
      (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: false, 
          error: "Incorrect email or password" 
        }),
      });

      const credentials = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      await expect(apiService.login(credentials)).rejects.toThrow(
        "Incorrect email or password"
      );
    });
  });

  describe("getUsers", () => {
    it("should fetch users without authentication", async () => {
      const mockUsers = [
        {
          id: 1,
          email: "user1@example.com",
          first_name: "User1",
          last_name: "Test",
          birth_date: "1990-01-01",
          city: "Paris",
          postal_code: "75001",
          is_admin: false,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

      const result = await apiService.getUsers();

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        mode: "cors",
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      const mockResponse = { message: "User deleted successfully" };

      (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Set the correct token for this test
      (global.localStorage.getItem as Mock).mockReturnValue(
        "admin@example.com"
      );

      const userId = 1;
      const result = await apiService.deleteUser(userId);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users/1", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer admin@example.com",
        },
        credentials: "omit",
        mode: "cors",
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("error handling", () => {
    it("should handle network errors", async () => {
      (fetch as unknown as Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(
        apiService.login({ email: "test@example.com", password: "test" })
      ).rejects.toThrow("Network error");
    });

    it("should handle JSON parsing errors", async () => {
      (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(
        apiService.login({ email: "test@example.com", password: "test" })
      ).rejects.toThrow("HTTP error! status: 500");
    });
  });
});
