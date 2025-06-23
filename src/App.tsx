import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { RegistrationForm } from "./components/RegistrationForm";
import { LoginForm } from "./components/LoginForm";
import { UserList } from "./components/UserList";
import { apiService, User } from "./services/api";
import { RegistrationFormData } from "./schemas/registrationSchema";
import "./App.css";

type View = "registration" | "login" | "admin";

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
  const [currentView, setCurrentView] = useState<View>("registration");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
      loadCurrentUser(token);
    }
  }, []);

  const loadCurrentUser = async (token: string) => {
    try {
      const user = await apiService.getCurrentUser(token);
      setCurrentUser(user);
      if (user.is_admin) {
        setCurrentView("admin");
      }
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
      console.log("User registered successfully:", data);
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

      // Load user info and redirect to admin if admin
      await loadCurrentUser(response.access_token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentView("registration");
    localStorage.removeItem("authToken");
  };

  const renderView = () => {
    switch (currentView) {
      case "registration":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                Formulaire d'Inscription
              </h1>
              <RegistrationForm onSubmit={handleRegistration} />
              <div className="text-center mt-6">
                <button
                  onClick={() => setCurrentView("login")}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Connexion Admin
                </button>
              </div>
            </div>
          </div>
        );

      case "login":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4">
              <LoginForm onLogin={handleLogin} />
              <div className="text-center mt-6">
                <button
                  onClick={() => setCurrentView("registration")}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Retour à l'inscription
                </button>
              </div>
            </div>
          </div>
        );

      case "admin":
        if (!authToken) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Accès non autorisé
                </h1>
                <button
                  onClick={() => setCurrentView("login")}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Se connecter
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <h1 className="text-xl font-semibold text-gray-800">
                    Panel d'Administration
                  </h1>
                  <div className="flex items-center space-x-4">
                    {currentUser && (
                      <span className="text-sm text-gray-600">
                        Connecté en tant que: {currentUser.email}
                      </span>
                    )}
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <UserList token={authToken} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      {renderView()}
    </div>
  );
}

export default App;