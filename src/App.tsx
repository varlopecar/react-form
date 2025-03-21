import { Toaster } from "react-hot-toast";
import { RegistrationForm } from "./components/RegistrationForm";
import "./App.css";

function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <RegistrationForm onSubmit={console.log} />
    </div>
  );
}

export default App;