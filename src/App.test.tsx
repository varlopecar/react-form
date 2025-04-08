import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock the RegistrationForm component
vi.mock("./components/RegistrationForm", () => ({
  RegistrationForm: () => <div data-testid="registration-form">Registration Form</div>,
}));

describe("App Component", () => {
  it("should render the registration form", () => {
    render(<App />);

    const registrationForm = screen.getByTestId("registration-form");
    expect(registrationForm).toBeInTheDocument();
  });
});