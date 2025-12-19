import { AuthContext } from "@/contexts/AuthContext";
import {
  login as loginService,
  logout as logoutService,
} from "@/services/auth.service";
import { http } from "@/services/http";
import type { LoginCredentials, User } from "@/types/auth.types";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await http.get("/api/user");
      setUser(res.data);
      setError(null);
    } catch {
      setUser(null);
      setError("Terjadi kesalahan pada server. Silakan coba lagi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (cred: LoginCredentials) => {
      await loginService(cred);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refresh,
      login,
      logout,
    }),
    [user, loading, error, refresh, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
