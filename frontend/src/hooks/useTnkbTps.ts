import { http } from "@/services/http";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: string[];
  loading: boolean;
  error: string | null;
};

export const useTnkbTps = (opts?: { autoFetch?: boolean }) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getTnkbTps = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ tnkb: string[] }>("/api/tps/tnkb");

      setState((prev) => ({ ...prev, data: res.data.tnkb }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil tnkb kendaraan.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getTnkbTps();
  }, [autoFetch, getTnkbTps]);

  return {
    tnkbTps: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getTnkbTps,
  };
};
