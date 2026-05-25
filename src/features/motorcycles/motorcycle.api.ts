import { motorcyclesClient } from "../../lib/http/clients";
import type { Motorcycle, CrearMotorcycleInput } from "./motorcycle.type";

export async function getMotorcycles(): Promise<Motorcycle[]> {
  const res = await motorcyclesClient.get<Motorcycle[]>("/api/motorcycles/");
  return res.data;
}

export async function getMotorcycleByPlaca(placa: string): Promise<Motorcycle> {
  const res = await motorcyclesClient.get<Motorcycle>(`/api/motorcycles/${placa}`);
  return res.data;
}

export async function createMotorcycle(data: CrearMotorcycleInput): Promise<Motorcycle> {
  const res = await motorcyclesClient.post<Motorcycle>("/api/motorcycles/", data);
  return res.data;
}

export async function updateMotorcycle(placa: string, data: Partial<CrearMotorcycleInput>): Promise<Motorcycle> {
  const res = await motorcyclesClient.put<Motorcycle>(`/api/motorcycles/${placa}`, data);
  return res.data;
}

export async function deleteMotorcycle(placa: string): Promise<void> {
  await motorcyclesClient.delete(`/api/motorcycles/${placa}`);
}