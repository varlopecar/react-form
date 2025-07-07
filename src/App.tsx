import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";

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
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Routes>
    </>
  );
}

export default App;