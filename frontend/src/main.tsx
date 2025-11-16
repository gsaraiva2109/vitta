import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import "./index.css";
import AppRouter from "./router";
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

import "primereact/resources/themes/lara-light-blue/theme.css"; // Tema claro com azul
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <AuthProvider> {/* Wrap AppRouter with AuthProvider */}
        <AppRouter />
      </AuthProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
