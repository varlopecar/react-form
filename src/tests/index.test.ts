import { describe, it, expect } from "vitest";
import * as indexExports from "../index";

describe("index.ts exports", () => {
  it("should export RegistrationForm component", () => {
    expect(indexExports.RegistrationForm).toBeDefined();
    expect(typeof indexExports.RegistrationForm).toBe("function");
  });

  it("should export registrationSchema", () => {
    expect(indexExports.registrationSchema).toBeDefined();
    expect(typeof indexExports.registrationSchema).toBe("object");
  });

  // Note: We can't directly test TypeScript types at runtime
  // The RegistrationFormData type and Person interface are exported but don't exist as values at runtime
  // This is a limitation of TypeScript's type system
});
