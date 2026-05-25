import { authClient, authProtectedClient } from "../../lib/http/clients";
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
