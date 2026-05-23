// Tipos que reflejan exactamente el dominio del microservicio ElectroBike

export const CATEGORIAS_ELECTROBIKE = [
  "urbana",
  "deportiva",
  "doble_proposito",
  "delivery",
] as const;

export const ESTADOS_ELECTROBIKE = [
  "disponible",
  "reservada",
  "mantenimiento",
] as const;

export type CategoriaElectroBike = (typeof CATEGORIAS_ELECTROBIKE)[number];
export type EstadoElectroBike = (typeof ESTADOS_ELECTROBIKE)[number];

// Marca (tabla `marcas`)
export interface Marca {
  id: number;
  nombre: string;
  pais: string;
  anioFundacion?: number | null;
  sitioWeb?: string | null;
}

// ElectroBike completa (respuesta del backend, incluye marca anidada)
export interface ElectroBike {
  id: number;
  marcaId: number;
  marca?: Pick<Marca, "id" | "nombre" | "pais">;
  modelo: string;
  categoria: CategoriaElectroBike;
  capacidadBateriaWh: number;
  autonomiaKm: number;
  velocidadMaximaKmh: number;
  tiempoCargaHoras: number;
  precio: number;
  stock: number;
  estado: EstadoElectroBike;
  fotoUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Payload para crear
export interface CrearElectroBikeInput {
  marcaId: number;
  modelo: string;
  categoria: CategoriaElectroBike;
  capacidadBateriaWh: number;
  autonomiaKm: number;
  velocidadMaximaKmh: number;
  tiempoCargaHoras: number;
  precio: number;
  stock: number;
  estado?: EstadoElectroBike;
  fotoUrl?: string | null;
}

// Payload para crear marca
export interface CrearMarcaInput {
  nombre: string;
  pais: string;
  anioFundacion?: number | null;
  sitioWeb?: string | null;
}

// Resumen del catálogo (endpoint /resumen)
export interface ResumenCatalogo {
  totalElectroBikes: number;
  electroBikesDisponibles: number;
  precioPromedio: number;
  totalMarcas: number;
  distribucionPorEstado: Record<EstadoElectroBike, number>;
}

// Filtros disponibles en GET /api/electrobikes
export interface FiltrosElectroBike {
  marcaId?: number;
  estado?: EstadoElectroBike;
  minAutonomiaKm?: number;
  maxPrecio?: number;
}
