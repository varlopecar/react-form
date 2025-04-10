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
  // Create docs path - hardcoded for clarity and testability
  // NOTE: In a real app with dynamic environments, you might want to use:
  // const docsPath = `${import.meta.env.BASE_URL || '/'}docs/index.html`.replace(/\/\//g, '/');
  const docsPath = "/vitest-vite-app/docs/index.html";

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Formulaire d'inscription</h1>
        <a
          href={docsPath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Documentation
        </a>
      </header>

      <RegistrationForm onSubmit={console.log} />

      <footer className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} - Formulaire d'inscription
      </footer>
    </div>
  );
}

export default App;