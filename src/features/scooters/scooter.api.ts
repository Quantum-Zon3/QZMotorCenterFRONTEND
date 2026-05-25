import { scootersClient } from "../../lib/http/clients";
import type { Scooter, ScooterFormInput } from "./scooter.type";

export async function getScooters(): Promise<Scooter[]> {
  const res = await scootersClient.get<Scooter[]>("/api/scooters");
  return res.data;
}

export async function createScooter(data: ScooterFormInput): Promise<Scooter> {
  const res = await scootersClient.post<Scooter>("/api/scooters", data);
  return res.data;
}

export async function updateScooter(id: number, data: ScooterFormInput): Promise<Scooter> {
  const res = await scootersClient.put<Scooter>(`/api/scooters/${id}`, data);
  return res.data;
}

export async function deleteScooter(id: number): Promise<Scooter> {
  const res = await scootersClient.delete<Scooter>(`/api/scooters/${id}`);
  return res.data;
}
