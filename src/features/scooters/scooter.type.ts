export interface Scooter {
  id: number;
  marca?: string;
  brand?: string;
  modelo?: string;
  model?: string;
  autonomia: number;
  voltaje: number;
  precio: number | string;
  estado?: string;
  color?: string;
  photoUrl?: string | null;
}

export interface ScooterFormInput {
  marca: string;
  modelo: string;
  autonomia: number;
  voltaje: number;
  precio: number;
  estado: string;
}
