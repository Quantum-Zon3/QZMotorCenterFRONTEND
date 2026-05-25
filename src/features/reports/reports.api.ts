import { reportsClient } from "../../lib/http/clients";

export interface SaleItemInput {
  productId: string;
  productType: string;
  productName: string;
  quantity?: number;
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
  productType?: string;
  productName: string;
  quantity?: number;
  unitPrice: number;
  subtotal: number;
  _id?: string;
}

export interface Reporte {
  _id: string;
  items: ReporteItem[];
  totalAmount: number;
  status?: "pending" | "completed" | "failed";
  eventType?: "create" | "sale" | "delete" | "other";
  saleDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetReportsResponse {
  total: number;
  data: Reporte[];
}

type ReportEventType = "create" | "sale" | "delete";

const buildSaleReportPayload = (
  data: CrearReporte200OKInput | CrearReporteDeletedInput,
  eventType: ReportEventType,
) => {
  const saleDate = data.saleDate ?? new Date().toISOString();
  const totalAmount =
    data.totalAmount ??
    data.items.reduce((sum, item) => sum + Number(item.subtotal ?? 0), 0);

  return {
    items: data.items.map((item) => ({
      productId: item.productId,
      productType: item.productType,
      productName: item.productName,
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
    totalAmount,
    status: "completed",
    eventType,
    saleDate,
  };
};

export async function createReport200OK(
  data: CrearReporte200OKInput,
): Promise<{ message: string; data: Reporte }> {
  const payload = buildSaleReportPayload(data, "create");
  const res = await reportsClient.post<{ message: string; data: Reporte }>(
    "/api/reports/200OK",
    payload,
  );
  return res.data;
}

export async function createReportDeleted(
  data: CrearReporteDeletedInput,
): Promise<{ message: string; data: Reporte }> {
  const payload = buildSaleReportPayload(data, "delete");
  const res = await reportsClient.post<{ message: string; data: Reporte }>(
    "/api/reports/deleted",
    payload,
  );
  return res.data;
}

export async function getAllReports(): Promise<GetReportsResponse> {
  const res = await reportsClient.get<GetReportsResponse>("/api/reports");
  return res.data;
}
