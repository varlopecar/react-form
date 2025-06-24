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

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

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

  test('redirects to register when accessing root path', () => {
    window.history.pushState({}, '', '/');
    renderWithRouter(<App />);
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('shows 404 page for unknown routes', () => {
    window.history.pushState({}, '', '/unknown-route');
    renderWithRouter(<App />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  test('handles redirect parameter from 404.html', () => {
    // Simulate the redirect parameter that would be set by 404.html
    window.history.pushState({}, '', '/?redirect=%2Fdashboard');
    renderWithRouter(<App />);
    // Should redirect to dashboard, but since no auth token, should redirect to login
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
