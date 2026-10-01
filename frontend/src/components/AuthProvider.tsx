import type { ReactNode } from "react";
import { useState } from "react";
import { AuthContext } from "./useAuth";

type TokenPayloadType = { sub: string; exp: number };

const TOKEN_KEY = "token";

function decodeToken(token: string): TokenPayloadType | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as TokenPayloadType;
    return payload.exp * 1000 > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && decodeToken(stored)) return stored;
    localStorage.removeItem(TOKEN_KEY);
    return null;
  });

  const userId = token ? (decodeToken(token)?.sub ?? null) : null;

  const login = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const authFetch = async (url: string, init: RequestInit = {}) => {
    const res = await fetch(url, {
      ...init,
      headers: { ...init.headers, Authorization: `JWT ${token}` },
    });
    if (res.status === 401) logout();
    return res;
  };

  return (
    <AuthContext value={{ token, userId, login, logout, authFetch }}>
      {children}
    </AuthContext>
  );
}
