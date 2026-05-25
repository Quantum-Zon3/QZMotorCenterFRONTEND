import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { sessionStorageAdapter } from "../session/storage";
import type { AuthResponse, AuthSession } from "../../features/auth/auth.types";

type RetriableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

interface CreateClientOptions {
  withAuth?: boolean;
}

export const createServiceClient = (
  baseURL: string,
  options: CreateClientOptions = {},
) => {
  const instance = axios.create({
    baseURL,
    timeout: 12000,
    headers: {
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    if (options.withAuth === false) {
      return config;
    }

    const session = sessionStorageAdapter.get();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const isLoginPage =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/login");
      const originalRequest = error.config as RetriableRequest | undefined;

      if (
        status === 401 &&
        options.withAuth !== false &&
        originalRequest &&
        !originalRequest._retry
      ) {
        const session = sessionStorageAdapter.get();

        if (session?.refreshToken) {
          originalRequest._retry = true;

          try {
            const { data } = await axios.post<AuthResponse>(
              `${baseURL}/qzMotorCenter/auth/refresh-token`,
              { refreshToken: session.refreshToken },
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              },
            );

            const nextSession: AuthSession = {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken ?? session.refreshToken,
              user: data.usuario ?? session.user,
            };

            sessionStorageAdapter.set(nextSession);
            originalRequest.headers.Authorization = `Bearer ${nextSession.accessToken}`;
            return instance(originalRequest);
          } catch {
            sessionStorageAdapter.clear();
          }
        }
      }

      if (status === 401 && options.withAuth !== false) {
        sessionStorageAdapter.clear();
        if (typeof window !== "undefined" && !isLoginPage) {
          window.location.assign("/login");
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
