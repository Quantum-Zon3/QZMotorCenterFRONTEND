export interface Scooter {
  id: number;
  marca?: string;
  brand?: string;
  modelo?: string;
  model?: string;
  autonomia: number;
  voltaje: number;
  precio: number | string;
  color?: string;
  photoUrl?: string | null;
  [key: string]: unknown;
}

export interface ScooterFormInput {
  marca: string;
  modelo: string;
  autonomia: number;
  voltaje: number;
  anio: string;
  precio: number;
  color: string;
  photoUrl: string;
}
