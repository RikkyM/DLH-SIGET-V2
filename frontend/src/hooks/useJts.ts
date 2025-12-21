import { http } from "@/services/http";
import type { JTS } from "@/types/master-data.types";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: JTS[];
  loading: boolean;
  error: string | null;
};

export const useJts = (opts?: { autoFetch?: boolean }) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getJTS = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ jts: JTS[] }>("/api/jts");

      setState((prev) => ({ ...prev, data: res.data.jts }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil data Jenis Titik Sampah.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getJTS();
  }, [autoFetch, getJTS])

  return {
    jts: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getJTS,
  };
};
