import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import PublicLayout from "../components/layout/PublicLayout";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import AiAssistantPage from "../pages/AiAssistantPage";
import CarsPage from "../pages/CarsPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import InventoryPage from "../pages/InventoryPage";
import LoginPage from "../pages/LoginPage";
import MotorcyclesPage from "../pages/MotorcyclesPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import ReportsPage from "../pages/ReportsPage";
import ScootersPage from "../pages/ScootersPage";
import SettingsPage from "../pages/SettingsPage";
import UsersPage from "../pages/UsersPage";
import ElectrobikePage from "../pages/ElectrobikePage";

export function AppRouter() {
  return (
    <Routes>
      {/* Public zone */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/catalogo/autos"
          element={<InventoryPage heading="Catálogo de Autos" description="Vehículos disponibles en nuestra flota de automóviles." serviceKey="cars" audience="public" />}
        />
        <Route
          path="/catalogo/motos"
          element={<InventoryPage heading="Catálogo de Motos" description="Motocicletas de todas las cilindradas para cada estilo." serviceKey="motorcycles" audience="public" />}
        />
        <Route
          path="/catalogo/electrobikes"
          element={<InventoryPage heading="Catálogo de Electrobikes" description="Movilidad eléctrica sostenible — autonomía, voltaje y stock." serviceKey="electrobikes" audience="public" />}
        />
        <Route
          path="/catalogo/scooters"
          element={<InventoryPage heading="Catálogo de Scooters" description="Scooters eléctricas urbanas para desplazamiento eficiente." serviceKey="scooters" audience="public" />}
        />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Private zone (admin panel) */}
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
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="inventario/autos" element={<CarsPage />} />
        <Route path="inventario/motos" element={<MotorcyclesPage />} />
        <Route path="inventario/electrobikes" element={<ElectrobikePage />} />
        <Route path="inventario/scooters" element={<ScootersPage />} />
        <Route path="reportes" element={<ReportsPage />} />
        <Route path="ia" element={<AiAssistantPage />} />
        <Route path="configuracion" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}