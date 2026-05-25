import { carsClient } from "../../lib/http/clients";
import type { Car, CarFormInput } from "./car.type";

const buildCarFormData = (data: CarFormInput) => {
  const formData = new FormData();

  formData.append("brand", data.brand);
  formData.append("model", data.model);
  formData.append("year", String(data.year));
  formData.append("plate", data.plate);
  formData.append("color", data.color);
  formData.append("price", String(data.price));
  formData.append("employeeId", String(data.employeeId));

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  return formData;
};

export async function getCars(): Promise<Car[]> {
  const res = await carsClient.get<Car[]>("/api/cars");
  return res.data;
}

export async function getCarById(id: number): Promise<Car> {
  const res = await carsClient.get<Car>(`/api/cars/${id}`);
  return res.data;
}

export async function createCar(data: CarFormInput): Promise<Car> {
  const res = await carsClient.post<Car>("/api/cars", buildCarFormData(data));
  return res.data;
}

export async function updateCar(id: number, data: CarFormInput): Promise<Car> {
  const res = await carsClient.put<Car>(`/api/cars/${id}`, buildCarFormData(data));
  return res.data;
}

export async function deleteCar(id: number): Promise<Car> {
  const res = await carsClient.delete<Car>(`/api/cars/${id}`);
  return res.data;
}
