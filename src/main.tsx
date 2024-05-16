import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { SnakeProvider } from "./context/SnakeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnakeProvider>
      <Toaster position="bottom-right" />
      <App />
    </SnakeProvider>
  </React.StrictMode>,
);
