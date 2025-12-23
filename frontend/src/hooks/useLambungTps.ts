import { http } from "@/services/http";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: string[];
  loading: boolean;
  error: string | null;
};

export const useLambungTps = (opts?: { autoFetch?: boolean }) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getLambungTps = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ lambung: string[] }>("/api/tps/lambung");

      setState((prev) => ({ ...prev, data: res.data.lambung }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil lambung kendaraan.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getLambungTps();
  }, [autoFetch, getLambungTps]);

  return {
    lambungTps: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getLambungTps,
  };
};
