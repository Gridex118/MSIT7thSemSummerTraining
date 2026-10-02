import { useContext, createContext } from "react";

export type AuthContextType = {
  token: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
