import { serviceList, serviceRegistry, type ServiceKey } from "../../config/service-registry";
import { aiClient, electroBikesClient, reportsClient } from "../../lib/http/clients";
import { fetchInventoryCounts } from "../catalog/catalog.api";

export interface DashboardMetric {
  label: string;
  value: number;
  detail: string;
}

export interface ServiceHealth {
  key: ServiceKey;
  label: string;
  status: "online" | "offline" | "manual";
  endpoint: string;
  detail: string;
}

export interface DashboardOverview {
  metrics: DashboardMetric[];
  serviceHealth: ServiceHealth[];
}

const buildEndpoint = (baseUrl: string, path: string) =>
  `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

const probeHealth = async (key: ServiceKey): Promise<ServiceHealth> => {
  const service = serviceRegistry[key];
  if (!service.healthPath) {
    return {
      key,
      label: service.label,
      status: "manual",
      endpoint: buildEndpoint(service.baseUrl, service.routeBase),
      detail: "Este servicio no expone health-check formal.",
    };
  }

  try {
    if (key === "reports") {
      await reportsClient.get(service.healthPath);
    } else if (key === "ai") {
      await aiClient.get(service.healthPath);
    } else if (key === "electrobikes") {
      await electroBikesClient.get(service.healthPath);
    }

    return {
      key,
      label: service.label,
      status: "online",
      endpoint: buildEndpoint(service.baseUrl, service.healthPath),
      detail: "Health-check respondió correctamente.",
    };
  } catch {
    return {
      key,
      label: service.label,
      status: "offline",
      endpoint: buildEndpoint(service.baseUrl, service.healthPath),
      detail: "No se logró establecer conexión desde el frontend.",
    };
  }
};

export const loadDashboardOverview = async (): Promise<DashboardOverview> => {
  const inventoryCounts = await fetchInventoryCounts().catch(() => ({
    cars: 0,
    motorcycles: 0,
    electrobikes: 0,
    scooters: 0,
  }));

  const [reportsResult, conversationsResult, electrobikeSummaryResult, healthChecks] =
    await Promise.all([
      reportsClient.get<Array<Record<string, unknown>>>("/api/reports").catch(() => null),
      aiClient
        .get<Array<Record<string, unknown>>>("/api/v1/conversations")
        .catch(() => null),
      electroBikesClient
        .get<{ totalElectroBikes?: number; electroBikesDisponibles?: number }>(
          "/api/electrobikes/resumen",
        )
        .catch(() => null),
      Promise.all(serviceList.map((service) => probeHealth(service.key))),
    ]);

  return {
    metrics: [
      {
        label: "Servicios mapeados",
        value: serviceList.length,
        detail: "Todos los microservicios ya tienen base URL y contrato inicial dentro del frontend.",
      },
      {
        label: "Inventario total",
        value:
          inventoryCounts.cars +
          inventoryCounts.motorcycles +
          inventoryCounts.electrobikes +
          inventoryCounts.scooters,
        detail: "Conteo agregado desde los dominios de inventario disponibles.",
      },
      {
        label: "Reportes leídos",
        value: reportsResult?.data?.length ?? 0,
        detail: "Consulta inicial al microservicio de reportes.",
      },
      {
        label: "Conversaciones IA",
        value: conversationsResult?.data?.length ?? 0,
        detail: "Historial actual detectado en el microservicio de IA.",
      },
      {
        label: "Electrobikes disponibles",
        value: electrobikeSummaryResult?.data?.electroBikesDisponibles ?? 0,
        detail: "Dato obtenido del resumen del catálogo eléctrico.",
      },
    ],
    serviceHealth: healthChecks,
  };
};

