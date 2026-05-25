export interface Scooter {
  id: number;
  marca?: string;
  brand?: string;
  modelo?: string;
  model?: string;
  autonomia: number;
  voltaje: number;
  año?: string | number;
  aÃ±o?: string | number;
  precio: number | string;
  color?: string;
  photoUrl?: string | null;
}

export interface ScooterFormInput {
  marca: string;
  modelo: string;
  autonomia: number;
  voltaje: number;
  año: string;
  precio: number;
  color: string;
  photoUrl: string;
}
