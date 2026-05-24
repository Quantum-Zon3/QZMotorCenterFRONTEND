export interface Motorcycle {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  year: number;
  precio: number;
  cilindraje: number;
  image_url?: string | null;
  creada_el?: string | null;
}

export interface CrearMotorcycleInput {
  placa: string;
  marca: string;
  modelo: string;
  year: number;
  precio: number;
  cilindraje: number;
  image_url?: string | null;
  creada_el?: string | null;
}