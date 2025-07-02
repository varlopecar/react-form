import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PostsPage from "./pages/PostsPage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
      loadCurrentUser();
    }
  }, []);

  useEffect(() => {
    // Handle redirects from 404.html
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get('redirect');

    if (redirectPath) {
      // Navigate to the original path
      navigate(redirectPath, { replace: true });
    }
  }, [location, navigate]);

  const loadCurrentUser = async () => {
    try {
      const user = await apiService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
      // Token might be invalid, clear it
      localStorage.removeItem("authToken");
      setAuthToken(null);
      setCurrentUser(null);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
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
      await loadCurrentUser();
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
      <Navigation
        currentUser={currentUser}
        onLogout={handleLogout}
        onMenuToggle={handleSidebarToggle}
      />

      <Box sx={{ display: 'flex' }}>
        {/* Sidebar - only show when user is logged in */}
        {currentUser && (
          <Sidebar
            currentUser={currentUser}
            onLogout={handleLogout}
            open={sidebarOpen}
            onToggle={handleSidebarToggle}
          />
        )}

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: currentUser && !isMobile ? '240px' : 0, // Account for sidebar width
            mt: '64px', // Account for app bar height
            minHeight: 'calc(100vh - 64px)',
            p: 2
          }}
        >
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
            <Route
              path="/posts"
              element={
                authToken && currentUser ? (
                  <PostsPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/users"
              element={
                authToken && currentUser ? (
                  <UsersPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;