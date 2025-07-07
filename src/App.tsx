import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PostsPage from "./pages/PostsPage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";
import { apiService } from "./services/api";
import { RegistrationFormData } from "./schemas/registrationSchema";
import { toast } from "react-hot-toast";
import React from "react";

// Wrapper components to handle props
const RegisterPageWrapper = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (data: RegistrationFormData) => {
    try {
      // Add a default password for new users
      const userWithPassword = {
        ...data,
        password: "defaultPassword123" // In a real app, you'd generate this or let admin set it
      };
      await apiService.registerUser(userWithPassword);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return <RegisterPage onSubmit={handleSubmit} />;
};

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await apiService.login(data);
      localStorage.setItem("authToken", response.access_token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return <LoginPage onLogin={handleLogin} />;
};

const DashboardPageWrapper = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Mock user data for now - in a real app this would come from context or state
  const mockUser = {
    id: 1,
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    birth_date: "1990-01-01",
    city: "Test City",
    postal_code: "12345",
    is_admin: false,
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  };

  const token = localStorage.getItem("authToken") || "";

  return <DashboardPage onLogout={handleLogout} user={mockUser} token={token} />;
};

/**
 * The main App component
 * 
 * @component
 * @returns {JSX.Element} The rendered App component
 * 
 * @example
 * ```tsx
 * <App />
 * ```
 */
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      const token = localStorage.getItem("authToken");
      if (token) {
        navigate(decodeURIComponent(redirect), { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, []); // Only run on mount

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/dashboard" element={<DashboardPageWrapper />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;