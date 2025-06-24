import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material";

// Mock the RegistrationForm component
vi.mock("./components/RegistrationForm", () => ({
  RegistrationForm: () => <div data-testid="registration-form">Registration Form</div>,
}));

// Mock the pages
vi.mock("./pages/RegisterPage", () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock("./pages/LoginPage", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock("./pages/DashboardPage", () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

// Mock the API service
vi.mock("./services/api", () => ({
  apiService: {
    registerUser: vi.fn(),
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const theme = createTheme();

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe("App Component", () => {
  it("should render the registration page by default", () => {
    renderWithRouter(<App />);

    const registerPage = screen.getByTestId("register-page");
    expect(registerPage).toBeInTheDocument();
  });

  it("should handle routing correctly", () => {
    renderWithRouter(<App />);

    // Should redirect to register page by default
    const registerPage = screen.getByTestId("register-page");
    expect(registerPage).toBeInTheDocument();
  });

  it("should render without crashing", () => {
    renderWithRouter(<App />);
    
    // Just check that something renders without errors
    expect(document.body).toBeInTheDocument();
  });
});
