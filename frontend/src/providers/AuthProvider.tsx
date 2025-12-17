import { AuthContext } from "@/contexts/AuthContext";
import { getCsrfCookie } from "@/services/csrf.service";
import { http } from "@/services/http.services";
import type { AuthState, LoginCredentials, User } from "@/types/auth.types";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const res = await http.get("/api/user");
      setState((prev) => ({
        ...prev,
        user: res.data,
        loading: false,
        error: null,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Terjadi kesalahan pada server. Silakan coba lagi",
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (cred: LoginCredentials) => {
      await getCsrfCookie();
      await http.post<User>("/api/login", cred);
      await refresh();
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    await http.post("/api/logout");
    setState((prev) => ({
      ...prev,
      user: null,
    }));
  }, []);

  const value = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      refresh,
      login,
      logout,
    }),
    [state, refresh, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
