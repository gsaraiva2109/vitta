import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-blue/theme.css"; // Tema claro com azul
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css"; // Tailwind v4 deve vir DEPOIS do PrimeReact
import "./custom-theme.css";

import AppRouter from "./router";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <AppRouter />
    </PrimeReactProvider>
  </StrictMode>,
);
