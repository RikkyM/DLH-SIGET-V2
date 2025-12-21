import { http } from "@/services/http";
import type { Departments } from "@/types/master-data.types";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: Departments[];
  loading: boolean;
  error: string | null;
};

export const useDepartments = (options?: { autoFetch?: boolean }) => {
  const autoFetch = options?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getDepartment = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ departments: Departments[] }>(
        "/api/department",
      );

      setState((prev) => ({ ...prev, data: res.data.departments }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil data department.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getDepartment();
  }, [autoFetch, getDepartment]);

  return {
    departments: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getDepartment,
  };
};
