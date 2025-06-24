import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import { apiService, User } from "./services/api";
import { RegistrationFormData } from "./schemas/registrationSchema";

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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
      loadCurrentUser(token);
    }
  }, []);

  useEffect(() => {
    // Handle redirects from 404.html
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get('redirect');

    if (redirectPath) {
      // Remove the redirect parameter from the URL
      const newSearch = urlParams.toString().replace(/redirect=[^&]*&?/, '').replace(/&$/, '');
      const newUrl = location.pathname + (newSearch ? '?' + newSearch : '') + location.hash;

      // Navigate to the original path
      navigate(redirectPath, { replace: true });
    }
  }, [location, navigate]);

  const loadCurrentUser = async (token: string) => {
    try {
      const user = await apiService.getCurrentUser(token);
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
      // Token might be invalid, clear it
      localStorage.removeItem("authToken");
      setAuthToken(null);
      setCurrentUser(null);
    }
  };

  const handleRegistration = async (data: RegistrationFormData) => {
    try {
      // Generate a simple password for demo purposes
      const password = "password123";
      const userData = { ...data, password };

      await apiService.registerUser(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await apiService.login(data);
      setAuthToken(response.access_token);
      localStorage.setItem("authToken", response.access_token);
      await loadCurrentUser(response.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage onSubmit={handleRegistration} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            authToken && currentUser ? (
              <DashboardPage onLogout={handleLogout} user={currentUser} token={authToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;