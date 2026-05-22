import { useState, type ReactNode } from "react";
import { sessionStorageAdapter } from "../../lib/session/storage";
import { loginRequest, logoutRequest } from "./auth.api";
import type { AuthSession, LoginPayload } from "./auth.types";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    sessionStorageAdapter.get(),
  );
  const isBootstrapping = false;

  const login = async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    const nextSession: AuthSession = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: response.usuario ?? null,
    };

    sessionStorageAdapter.set(nextSession);
    setSession(nextSession);
  };

  const logout = async () => {
    try {
      if (session?.accessToken) {
        await logoutRequest();
      }
    } catch {
      // Even if the backend logout fails, the local session should be cleared.
    } finally {
      sessionStorageAdapter.clear();
      setSession(null);
    }
  };

  const value: AuthContextValue = {
    isAuthenticated: Boolean(session?.accessToken),
    isBootstrapping,
    session,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
