export interface AuthUser {
  cedula?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  contraseña?: string;
  fechaRegistro?: Date;
  telefono?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  cedula: number;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  telefono: string;
  fechaRegistro: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  usuario?: AuthUser | null;
}
