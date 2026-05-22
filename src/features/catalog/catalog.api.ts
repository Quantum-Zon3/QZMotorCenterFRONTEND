import { serviceRegistry } from "../../config/service-registry";
import {
  carsClient,
  electroBikesClient,
  motorcyclesClient,
  scootersClient,
} from "../../lib/http/clients";

export type InventoryServiceKey =
  | "cars"
  | "motorcycles"
  | "electrobikes"
  | "scooters";

export interface CatalogItem {
  id: string | number;
  title: string;
  subtitle: string;
  badge: string;
  meta: string[];
  imageUrl?: string | null;
  price?: number | null;
  source: InventoryServiceKey;
}

export interface InventorySnapshot {
  serviceKey: InventoryServiceKey;
  serviceName: string;
  items: CatalogItem[];
}

const buildAssetUrl = (baseUrl: string, imagePath?: string | null) => {
  if (!imagePath) {
    return null;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${baseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

const normalizeCars = (items: Array<Record<string, unknown>>): CatalogItem[] =>
  items.map((item) => ({
    id: String(item.id ?? item.plate ?? Math.random()),
    title: `${item.brand ?? "Sin marca"} ${item.model ?? ""}`.trim(),
    subtitle: String(item.plate ?? "Sin placa"),
    badge: String(item.color ?? "Vehículo"),
    meta: [
      `Año ${item.year ?? "N/D"}`,
      `Empleado ${item.employeeId ?? "N/D"}`,
    ],
    imageUrl: buildAssetUrl(serviceRegistry.cars.baseUrl, item.photoUrl as string | null),
    price: Number(item.price ?? 0),
    source: "cars",
  }));

const normalizeMotorcycles = (
  items: Array<Record<string, unknown>>,
): CatalogItem[] =>
  items.map((item) => ({
    id: String(item.placa ?? item.id ?? Math.random()),
    title: `${item.marca ?? "Sin marca"} ${item.modelo ?? ""}`.trim(),
    subtitle: String(item.placa ?? "Sin placa"),
    badge: `${item.cilindraje ?? "N/D"} cc`,
    meta: [`Año ${item.year ?? "N/D"}`],
    imageUrl: buildAssetUrl(
      serviceRegistry.motorcycles.baseUrl,
      item.image_url as string | null,
    ),
    price: Number(item.precio ?? 0),
    source: "motorcycles",
  }));

const normalizeElectroBikes = (
  items: Array<Record<string, unknown>>,
): CatalogItem[] =>
  items.map((item) => ({
    id: String(item.id ?? Math.random()),
    title: String(item.modelo ?? "Electrobike"),
    subtitle: String(item.categoria ?? "Sin categoría"),
    badge: String(item.estado ?? "Sin estado"),
    meta: [
      `${item.autonomiaKm ?? "N/D"} km autonomía`,
      `Stock ${item.stock ?? "N/D"}`,
    ],
    imageUrl: buildAssetUrl(
      serviceRegistry.electrobikes.baseUrl,
      item.fotoUrl as string | null,
    ),
    price: Number(item.precio ?? 0),
    source: "electrobikes",
  }));

const normalizeScooters = (
  items: Array<Record<string, unknown>>,
): CatalogItem[] =>
  items.map((item) => ({
    id: String(item.id ?? Math.random()),
    title: `${item.marca ?? "Sin marca"} ${item.modelo ?? ""}`.trim(),
    subtitle: `${item.autonomia ?? "N/D"} km autonomía`,
    badge: `${item.voltaje ?? "N/D"} v`,
    meta: [`Año ${item["año"] ?? "N/D"}`, `Color ${item.color ?? "N/D"}`],
    imageUrl: buildAssetUrl(serviceRegistry.scooters.baseUrl, item.photoUrl as string | null),
    price: Number(item.precio ?? 0),
    source: "scooters",
  }));

const fetchers: Record<
  InventoryServiceKey,
  () => Promise<Array<Record<string, unknown>>>
> = {
  cars: async () => {
    const { data } = await carsClient.get<Array<Record<string, unknown>>>("/api/cars");
    return data;
  },
  motorcycles: async () => {
    const { data } = await motorcyclesClient.get<Array<Record<string, unknown>>>(
      "/api/motorcycles/",
    );
    return data;
  },
  electrobikes: async () => {
    const { data } = await electroBikesClient.get<Array<Record<string, unknown>>>(
      "/api/electrobikes",
    );
    return data;
  },
  scooters: async () => {
    const { data } = await scootersClient.get<Array<Record<string, unknown>>>(
      "/api/scooters",
    );
    return data;
  },
};

const normalizers: Record<
  InventoryServiceKey,
  (items: Array<Record<string, unknown>>) => CatalogItem[]
> = {
  cars: normalizeCars,
  motorcycles: normalizeMotorcycles,
  electrobikes: normalizeElectroBikes,
  scooters: normalizeScooters,
};

export const fetchInventoryCollection = async (
  serviceKey: InventoryServiceKey,
): Promise<InventorySnapshot> => {
  const rawItems = await fetchers[serviceKey]();

  return {
    serviceKey,
    serviceName: serviceRegistry[serviceKey].label,
    items: normalizers[serviceKey](rawItems),
  };
};

export const fetchInventoryCounts = async () => {
  const keys: InventoryServiceKey[] = [
    "cars",
    "motorcycles",
    "electrobikes",
    "scooters",
  ];
  const settled = await Promise.allSettled(keys.map(fetchInventoryCollection));

  return settled.reduce<Record<InventoryServiceKey, number>>(
    (accumulator, result, index) => {
      const key = keys[index];
      accumulator[key] =
        result.status === "fulfilled" ? result.value.items.length : 0;
      return accumulator;
    },
    {
      cars: 0,
      motorcycles: 0,
      electrobikes: 0,
      scooters: 0,
    },
  );
};
