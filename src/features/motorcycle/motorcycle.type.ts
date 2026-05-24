export const CATEGORIAS_MOTORCYCLE = [
  "naked",
  "deportiva",
  "touring",
  "custom",
  "doble_proposito",
  "enduro",
  "scooter",
] as const;

export const ESTADOS_MOTORCYCLE = [
  "disponible",
  "reservada",
  "mantenimiento",
] as const;

export type CategoriaMotorcycle = (typeof CATEGORIAS_MOTORCYCLE)[number];
export type EstadoMotorcycle    = (typeof ESTADOS_MOTORCYCLE)[number];

export interface Marca {
  id: number;
  nombre: string;
  pais: string;
  anioFundacion?: number | null;
  sitioWeb?: string | null;
}

export interface Motorcycle {
  id: number;
  marcaId: number;
  marca?: Pick<Marca, "id" | "nombre" | "pais">;
  modelo: string;
  categoria: CategoriaMotorcycle;
  cilindrada: number;
  potenciaHp: number;
  torqueNm: number;
  velocidadMaximaKmh: number;
  precio: number;
  stock: number;
  estado: EstadoMotorcycle;
  fotoUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearMotorcycleInput {
  marcaId: number;
  modelo: string;
  categoria: CategoriaMotorcycle;
  cilindrada: number;
  potenciaHp: number;
  torqueNm: number;
  velocidadMaximaKmh: number;
  precio: number;
  stock: number;
  estado?: EstadoMotorcycle;
  fotoUrl?: string | null;
}

export interface CrearMarcaInput {
  nombre: string;
  pais: string;
}

export interface FiltrosMotorcycle {
  marcaId?: number;
  estado?: EstadoMotorcycle;
  categoria?: CategoriaMotorcycle;
  maxPrecio?: number;
}

export interface ResumenCatalogo {
  totalMotorcycles: number;
  motorcyclesDisponibles: number;
  precioPromedio: number;
  totalMarcas: number;
  distribucionPorEstado: Record<EstadoMotorcycle, number>;
}