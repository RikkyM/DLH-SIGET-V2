import type { AuthState, LoginCredentials } from "@/types/auth.types";
import { createContext } from "react";

export type AuthContextType = AuthState & {
  login: (cred: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
