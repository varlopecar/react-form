import { Toaster } from "react-hot-toast";
import { RegistrationForm } from "./components/RegistrationForm";
import "./App.css";

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
    <div>
      <Toaster position="top-right" />
      <RegistrationForm onSubmit={console.log} />
    </div>
  );
}

export default App;