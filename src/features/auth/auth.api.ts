import { authClient, authProtectedClient, serverlessClient } from "../../lib/http/clients";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "./auth.types";

export const registerRequest = async (payload: RegisterPayload) => {
  const { data } = await authClient.post<AuthUser>("/qzMotorCenter/auth", payload);
  return data;
};

export const loginRequest = async (payload: LoginPayload) => {
  const { data } = await authClient.post<AuthResponse>(
    "/qzMotorCenter/auth/login",
    payload,
  );
  return data;
};

export const refreshTokenRequest = async (refreshToken: string) => {
  const { data } = await authClient.post<AuthResponse>(
    "/qzMotorCenter/auth/refresh-token",
    { refreshToken },
  );
  return data;
};

export const logoutRequest = async () => {
  await authProtectedClient.post("/qzMotorCenter/auth/logout");
};

export const sendLoginEmailRequest = async (email: string) => {
  await serverlessClient.post("/api/enviarCorreo", {
    email,
    tipo: "inicio_sesion",
  });
};

export const getUsersRequest = async () => {
  const { data } = await authProtectedClient.get<AuthUser[]>("/qzMotorCenter/auth");
  return data;
};

export const updateUserRequest = async (cedula: number, payload: Partial<RegisterPayload>) => {
  const { data } = await authProtectedClient.put<AuthUser>(
    `/qzMotorCenter/auth/${cedula}`,
    payload,
  );
  return data;
};

export const deleteUserRequest = async (cedula: number) => {
  await authProtectedClient.delete(`/qzMotorCenter/auth/${cedula}`);
};
