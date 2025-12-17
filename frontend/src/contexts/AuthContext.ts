import type { AuthState, LoginCredentials } from "@/types/auth.types";
import { createContext } from "react";

type AuthContextType = AuthState & {
  refresh: () => Promise<void>;
  login: (cred: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
