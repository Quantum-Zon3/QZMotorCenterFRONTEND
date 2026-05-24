import { reportsClient } from "../../lib/http/clients";

export interface SaleItemInput {
  productId: string;
  productType: string;
  productName: string;
  unitPrice: number;
  subtotal: number;
}

export interface CrearReporte200OKInput {
  items: SaleItemInput[];
  totalAmount: number;
  saleDate?: string;
}

export interface CrearReporteDeletedInput {
  items: SaleItemInput[];
  totalAmount?: number;
  saleDate?: string;
}

export interface ReporteItem {
  productId: string;
  productType: string;
  productName: string;
  unitPrice: number;
  subtotal: number;
  _id?: string;
}

export interface Reporte {
  _id: string;
  items: ReporteItem[];
  totalAmount: number;
  saleDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetReportsResponse {
  total: number;
  data: Reporte[];
}

/**
 * POST /api/reports/200OK — registra un nuevo reporte de creación de producto
 */
export async function createReport200OK(
  data: CrearReporte200OKInput
): Promise<{ message: string; data: Reporte }> {
  console.debug("[reports] createReport200OK payload:", data);
  const res = await reportsClient.post<{ message: string; data: Reporte }>("/api/reports/200OK", data);
  console.debug("[reports] createReport200OK response:", res.status, res.data);
  return res.data;
}

export async function createReportDeleted(
  data: CrearReporteDeletedInput
): Promise<{ message: string; data: Reporte }> {
  console.debug("[reports] createReportDeleted payload:", data);
  const res = await reportsClient.post<{ message: string; data: Reporte }>("/api/reports/deleted", data);
  console.debug("[reports] createReportDeleted response:", res.status, res.data);
  return res.data;
}

/**
 * GET /api/reports — lista todos los reportes ordenados por fecha
 */
export async function getAllReports(): Promise<GetReportsResponse> {
  const res = await reportsClient.get<GetReportsResponse>("/api/reports");
  return res.data;
}
