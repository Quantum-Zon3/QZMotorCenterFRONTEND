import { motorcyclesClient } from "../../lib/http/clients";
import type {
  CrearMotorcycleInput,
  CrearMarcaInput,
  Motorcycle,
  FiltrosMotorcycle,
  Marca,
  ResumenCatalogo,
} from "./motorcycle.type";

// ─── Marcas ──────────────────────────────────────────────────────────────────

export async function getMarcas(): Promise<Marca[]> {
  const res = await motorcyclesClient.get<Marca[]>("/api/brands");
  return res.data;
}

export async function createMarca(data: CrearMarcaInput): Promise<Marca> {
  const res = await motorcyclesClient.post<Marca>("/api/brands", data);
  return res.data;
}

// ─── Motorcycles ─────────────────────────────────────────────────────────────

export async function getMotorcycles(filtros?: FiltrosMotorcycle): Promise<Motorcycle[]> {
  const params: Record<string, string> = {};
  if (filtros?.marcaId !== undefined)   params.marcaId   = String(filtros.marcaId);
  if (filtros?.estado !== undefined)    params.estado    = filtros.estado;
  if (filtros?.categoria !== undefined) params.categoria = filtros.categoria;
  if (filtros?.maxPrecio !== undefined) params.maxPrecio = String(filtros.maxPrecio);

  const res = await motorcyclesClient.get<Motorcycle[]>("/api/motorcycles", { params });
  return res.data;
}

export async function getResumenCatalogo(): Promise<ResumenCatalogo> {
  const res = await motorcyclesClient.get<ResumenCatalogo>("/api/motorcycles/resumen");
  return res.data;
}

export async function getMotorcycleById(id: number): Promise<Motorcycle> {
  const res = await motorcyclesClient.get<Motorcycle>(`/api/motorcycles/${id}`);
  return res.data;
}

export async function createMotorcycle(data: CrearMotorcycleInput): Promise<Motorcycle> {
  const res = await motorcyclesClient.post<Motorcycle>("/api/motorcycles", data);
  return res.data;
}

export async function updateMotorcycle(id: number, data: Partial<CrearMotorcycleInput>): Promise<Motorcycle> {
  const res = await motorcyclesClient.put<Motorcycle>(`/api/motorcycles/${id}`, data);
  return res.data;
}

export async function deleteMotorcycle(id: number): Promise<{ message: string; id: number }> {
  const res = await motorcyclesClient.delete<{ message: string; id: number }>(`/api/motorcycles/${id}`);
  return res.data;
}