import { createContext } from "react";
import type { AuthSession, LoginPayload } from "./auth.types";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  session: AuthSession | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

