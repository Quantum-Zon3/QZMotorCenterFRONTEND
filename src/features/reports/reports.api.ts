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
  quantity: number;
  unitPrice: number;
  subtotal: number;
  _id?: string;
}

export interface Reporte {
  _id: string;
  items: ReporteItem[];
  totalAmount: number;
  status?: "pending" | "completed" | "cancelled";
  saleDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetReportsResponse {
  total: number;
  data: Reporte[];
}

type ReportStatus = "pending" | "completed" | "cancelled";

const buildSaleReportPayload = (
  data: CrearReporte200OKInput | CrearReporteDeletedInput,
  status: ReportStatus,
) => {
  const saleDate = data.saleDate ?? new Date().toISOString();
  const totalAmount =
    data.totalAmount ??
    data.items.reduce((sum, item) => sum + Number(item.subtotal ?? 0), 0);

  return {
    orderId: `${status}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    customerId: "frontend",
    customerName: "QZ Motor Center Frontend",
    items: data.items.map((item) => ({
      productId: item.productId,
      productName: `${item.productType ? `${item.productType} - ` : ""}${item.productName}`,
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
    totalAmount,
    status,
    saleDate,
  };
};

export async function createReport200OK(
  data: CrearReporte200OKInput,
): Promise<{ message: string; data: Reporte }> {
  const payload = buildSaleReportPayload(data, "completed");
  console.debug("[reports] createReport200OK payload:", payload);
  const res = await reportsClient.post<{ message: string; data: Reporte }>(
    "/api/reports/sale",
    payload,
  );
  console.debug("[reports] createReport200OK response:", res.status, res.data);
  return res.data;
}

export async function createReportDeleted(
  data: CrearReporteDeletedInput,
): Promise<{ message: string; data: Reporte }> {
  const payload = buildSaleReportPayload(data, "cancelled");
  console.debug("[reports] createReportDeleted payload:", payload);
  const res = await reportsClient.post<{ message: string; data: Reporte }>(
    "/api/reports/sale",
    payload,
  );
  console.debug("[reports] createReportDeleted response:", res.status, res.data);
  return res.data;
}

export async function getAllReports(): Promise<GetReportsResponse> {
  const res = await reportsClient.get<GetReportsResponse>("/api/reports");
  return res.data;
}
