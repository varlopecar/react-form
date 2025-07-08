import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, test, describe, beforeEach, it, expect } from 'vitest';
import "@testing-library/jest-dom";
import App from './App';
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

vi.mock("./pages/HomePage", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("./pages/PostsPage", () => ({
  default: () => <div data-testid="posts-page">Posts Page</div>,
}));

vi.mock("./pages/UsersPage", () => ({
  default: () => <div data-testid="users-page">Users Page</div>,
}));

vi.mock("./pages/NotFoundPage", () => ({
  default: () => <div data-testid="not-found-page">404 Page Not Found</div>,
}));

vi.mock("./components/Navigation", () => ({
  default: () => <div data-testid="navigation">Navigation</div>,
}));

vi.mock("./components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
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
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
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

  it("should render the home page by default", () => {
    renderWithRouter(<App />);

    const homePage = screen.getByTestId("home-page");
    expect(homePage).toBeInTheDocument();
  });

  it("should handle routing correctly", () => {
    renderWithRouter(<App />);

    // Should show home page by default
    const homePage = screen.getByTestId("home-page");
    expect(homePage).toBeInTheDocument();
  });

  it("should render without crashing", () => {
    renderWithRouter(<App />);

    // Just check that something renders without errors
    expect(document.body).toBeInTheDocument();
  });

  test('shows home page when accessing root path', () => {
    window.history.pushState({}, '', '/');
    renderWithRouter(<App />);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  test('shows 404 page for unknown routes', () => {
    window.history.pushState({}, '', '/unknown-route');
    renderWithRouter(<App />);
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });
});
