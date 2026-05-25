import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import PublicLayout from "../components/layout/PublicLayout";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import AiAssistantPage from "../pages/AiAssistantPage";
import CarsPage from "../pages/CarsPage";
import DashboardPage from "../pages/DashboardPage";
import ElectrobikePage from "../pages/ElectrobikePage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MotorcyclesPage from "../pages/MotorcyclesPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import ScootersPage from "../pages/ScootersPage";
import SettingsPage from "../pages/SettingsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/catalogo/*" element={<Navigate to="/login" replace />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="inventario/autos" element={<CarsPage />} />
        <Route path="inventario/motos" element={<MotorcyclesPage />} />
        <Route path="inventario/electrobikes" element={<ElectrobikePage />} />
        <Route path="inventario/scooters" element={<ScootersPage />} />
        <Route path="ia" element={<AiAssistantPage />} />
        <Route path="configuracion" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
