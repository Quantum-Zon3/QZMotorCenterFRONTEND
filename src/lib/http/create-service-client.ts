import axios from "axios";
import { sessionStorageAdapter } from "../session/storage";

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
    (error) => {
      const status = error.response?.status;
      const isLoginPage =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/login");

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

