import type { KendaraanRes } from "@/pages/app/Data-Kendaraan/__types";
import { http } from "@/services/http";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: KendaraanRes[];
  loading: boolean;
  error: string | null;
};

export const useKendaraanFilter = (opts?: { autoFetch?: boolean }) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getKendaraanFilter = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ kendaraan: KendaraanRes[] }>(
        "/api/kendaraan-filter",
      );

      setState((prev) => ({ ...prev, data: res.data.kendaraan }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil data kendaraan.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getKendaraanFilter();
  }, [autoFetch, getKendaraanFilter])

  return {
    kendaraan: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getKendaraanFilter
  }
};
