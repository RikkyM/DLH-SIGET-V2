import { http } from "@/services/http";
import type { Penugasan } from "@/types/master-data.types";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: Penugasan[];
  loading: boolean;
  error: string | null;
};

type PenugasanRes = {
  penugasan: Penugasan[];
};

export const usePenugasan = (options?: { autoFetch?: boolean }) => {
  const autoFetch = options?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getPenugasan = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<PenugasanRes>("/api/penugasan");

      setState((prev) => ({ ...prev, data: res.data.penugasan }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil data penugasan.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getPenugasan()
  }, [autoFetch, getPenugasan])

  return {
    penugasan: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getPenugasan
  }
};
