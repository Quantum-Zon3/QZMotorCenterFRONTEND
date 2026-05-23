import { electroBikesClient } from "../../lib/http/clients";
import type {
  CrearElectroBikeInput,
  CrearMarcaInput,
  ElectroBike,
  FiltrosElectroBike,
  Marca,
  ResumenCatalogo,
} from "./electrobike.type";

// ─── Marcas ──────────────────────────────────────────────────────────────────

/** GET /api/marcas — lista todas las marcas */
export async function getMarcas(): Promise<Marca[]> {
  const res = await electroBikesClient.get<Marca[]>("/api/marcas");
  return res.data;
}

/** POST /api/marcas — crea una marca nueva */
export async function createMarca(data: CrearMarcaInput): Promise<Marca> {
  const res = await electroBikesClient.post<Marca>("/api/marcas", data);
  return res.data;
}

// ─── ElectroBikes ─────────────────────────────────────────────────────────────

/**
 * GET /api/electrobikes — lista con filtros opcionales.
 * Todos los parámetros son query strings; solo se envían los que están definidos.
 */
export async function getElectroBikes(
  filtros?: FiltrosElectroBike
): Promise<ElectroBike[]> {
  const params: Record<string, string> = {};

  if (filtros?.marcaId !== undefined)
    params.marcaId = String(filtros.marcaId);
  if (filtros?.estado !== undefined)
    params.estado = filtros.estado;
  if (filtros?.minAutonomiaKm !== undefined)
    params.minAutonomiaKm = String(filtros.minAutonomiaKm);
  if (filtros?.maxPrecio !== undefined)
    params.maxPrecio = String(filtros.maxPrecio);

  const res = await electroBikesClient.get<ElectroBike[]>("/api/electrobikes", { params });
  return res.data;
}

/** GET /api/electrobikes/resumen — totales y distribución por estado */
export async function getResumenCatalogo(): Promise<ResumenCatalogo> {
  const res = await electroBikesClient.get<ResumenCatalogo>("/api/electrobikes/resumen");
  return res.data;
}

/** GET /api/electrobikes/:id — una sola electrobike */
export async function getElectroBikeById(id: number): Promise<ElectroBike> {
  const res = await electroBikesClient.get<ElectroBike>(`/api/electrobikes/${id}`);
  return res.data;
}

/** POST /api/electrobikes — crea una electrobike nueva */
export async function createElectroBike(
  data: CrearElectroBikeInput
): Promise<ElectroBike> {
  const res = await electroBikesClient.post<ElectroBike>("/api/electrobikes", data);
  return res.data;
}

/** PUT /api/electrobikes/:id — actualiza una electrobike existente */
export async function updateElectroBike(
  id: number,
  data: Partial<CrearElectroBikeInput>
): Promise<ElectroBike> {
  const res = await electroBikesClient.put<ElectroBike>(`/api/electrobikes/${id}`, data);
  return res.data;
}

/** DELETE /api/electrobikes/:id — elimina una electrobike */
export async function deleteElectroBike(
  id: number
): Promise<{ message: string; id: number }> {
  const res = await electroBikesClient.delete<{ message: string; id: number }>(
    `/api/electrobikes/${id}`
  );
  return res.data;
}
