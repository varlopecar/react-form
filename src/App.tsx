import React from "react";
import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <img src={viteLogo} alt="Vite logo"/>
      <img src={reactLogo} alt="React logo"/>
      <button onClick={() => setCount((c) => c + 1)}>Click me</button>
      <span data-testid="count">{count}</span>
    </div>
  );
}

export default App;