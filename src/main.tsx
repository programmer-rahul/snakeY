import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GameOptionsProvider } from "./context/SnakeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameOptionsProvider>
      <App />
    </GameOptionsProvider>
  </React.StrictMode>,
);
