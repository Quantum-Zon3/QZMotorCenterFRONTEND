export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  price: number | string;
  employeeId: number;
  photoUrl?: string | null;
}

export interface CarFormInput {
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  price: number;
  employeeId: number;
  photo?: File | null;
}
