import { describe, it, expect } from "vitest";
import { registrationSchema } from "./registrationSchema";

describe("registrationSchema", () => {
  describe("age validation", () => {
    it("should accept dates for users over 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 20);
      const result = registrationSchema.safeParse({
        birthDate: date,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        city: "Paris",
        postalCode: "75001",
      });
      expect(result.success).toBe(true);
    });

    it("should reject dates for users under 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 17);
      const result = registrationSchema.safeParse({
        birthDate: date,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        city: "Paris",
        postalCode: "75001",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("postal code validation", () => {
    it("should accept valid French postal codes", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        city: "Paris",
        postalCode: "75001",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid postal codes", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        city: "Paris",
        postalCode: "7500", // Too short
      });
      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("should accept names with accents and hyphens", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "Jean-François",
        lastName: "Müller-André",
        email: "jean@example.com",
        city: "Saint-Étienne",
        postalCode: "75001",
      });
      expect(result.success).toBe(true);
    });

    it("should reject names with numbers or special characters", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "John123",
        lastName: "Doe",
        email: "john@example.com",
        city: "Paris",
        postalCode: "75001",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("should accept valid email addresses", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        city: "Paris",
        postalCode: "75001",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "John",
        lastName: "Doe",
        email: "not-an-email",
        city: "Paris",
        postalCode: "75001",
      });
      expect(result.success).toBe(false);
    });
  });
});
