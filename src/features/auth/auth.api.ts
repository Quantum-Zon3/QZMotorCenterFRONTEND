import { authClient, authProtectedClient } from "../../lib/http/clients";
import type { AuthResponse, LoginPayload } from "./auth.types";

export const loginRequest = async (payload: LoginPayload) => {
  const { data } = await authClient.post<AuthResponse>(
    "/qzwork_hub/auth/login",
    payload,
  );
  return data;
};

export const refreshTokenRequest = async (refreshToken: string) => {
  const { data } = await authClient.post<AuthResponse>(
    "/qzwork_hub/auth/refresh-token",
    { refreshToken },
  );
  return data;
};

export const logoutRequest = async () => {
  await authProtectedClient.post("/qzwork_hub/auth/logout");
};
