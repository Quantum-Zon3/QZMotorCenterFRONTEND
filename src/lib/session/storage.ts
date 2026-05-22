import type { AuthSession } from "../../features/auth/auth.types";

const SESSION_KEY = "qzmc.session";

const canUseStorage = () => typeof window !== "undefined";

export const sessionStorageAdapter = {
  get(): AuthSession | null {
    if (!canUseStorage()) {
      return null;
    }

    const rawValue = window.localStorage.getItem(SESSION_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as AuthSession;
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },
  set(session: AuthSession) {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  clear() {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.removeItem(SESSION_KEY);
  },
};

