import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import './lib/leaflet.setup'
import AppProviders from "./providers/AppProvider.tsx";
import { AppRoutes } from "./routes/AppRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </StrictMode>,
);
