import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import PublicLayout from "../components/layout/PublicLayout";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import ArchitecturePage from "../pages/ArchitecturePage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import InventoryPage from "../pages/InventoryPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import UsersPage from "../pages/UsersPage";
import AiAssistantPage from "../pages/AiAssistantPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/catalogo/autos"
          element={
            <InventoryPage
              heading="Catálogo de autos"
              description="Base pública para el inventario automotriz conectado al microservicio de carros."
              serviceKey="cars"
              audience="public"
            />
          }
        />
        <Route
          path="/catalogo/motos"
          element={
            <InventoryPage
              heading="Catálogo de motos"
              description="Vista pública del dominio de motocicletas pensado para búsquedas rápidas y próximas reservas."
              serviceKey="motorcycles"
              audience="public"
            />
          }
        />
        <Route
          path="/catalogo/electrobikes"
          element={
            <InventoryPage
              heading="Catálogo de electrobikes"
              description="Catálogo de movilidad eléctrica con métricas de autonomía, estado y stock."
              serviceKey="electrobikes"
              audience="public"
            />
          }
        />
        <Route
          path="/catalogo/scooters"
          element={
            <InventoryPage
              heading="Catálogo de scooters"
              description="Módulo de scooters eléctricas preparado para comparar autonomía, voltaje y precio."
              serviceKey="scooters"
              audience="public"
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
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
        <Route path="usuarios" element={<UsersPage />} />
        <Route
          path="inventario/autos"
          element={
            <InventoryPage
              heading="Gestión de autos"
              description="Panel inicial para operación del microservicio de carros, con lectura del inventario y conexión preparada."
              serviceKey="cars"
              audience="private"
            />
          }
        />
        <Route
          path="inventario/motos"
          element={
            <InventoryPage
              heading="Gestión de motos"
              description="Base administrativa para el dominio de motocicletas y próximos flujos CRUD."
              serviceKey="motorcycles"
              audience="private"
            />
          }
        />
        <Route
          path="inventario/electrobikes"
          element={
            <InventoryPage
              heading="Gestión de electrobikes"
              description="Vista administrativa del microservicio con mejor capacidad de resumen de catálogo."
              serviceKey="electrobikes"
              audience="private"
            />
          }
        />
        <Route
          path="inventario/scooters"
          element={
            <InventoryPage
              heading="Gestión de scooters"
              description="Módulo administrativo listo para enlazar filtros, formularios y carga de imágenes."
              serviceKey="scooters"
              audience="private"
            />
          }
        />
        <Route path="reportes" element={<ReportsPage />} />
        <Route path="ia" element={<AiAssistantPage />} />
        <Route path="arquitectura" element={<ArchitecturePage />} />
        <Route path="configuracion" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

