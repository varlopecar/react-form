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

  it("should render the documentation link with correct path", () => {
    render(<App />);

    const documentationLink = screen.getByText("Documentation");
    expect(documentationLink).toBeInTheDocument();
    expect(documentationLink).toHaveAttribute("href", "/react-form/docs/index.html");
    expect(documentationLink).toHaveAttribute("target", "_blank");
  });

  it("should render the header and footer", () => {
    render(<App />);

    expect(screen.getByText("Formulaire d'inscription")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});