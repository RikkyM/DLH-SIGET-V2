import { http } from "@/services/http";
import type { Kecamatan } from "@/types/master-data.types";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: Kecamatan[];
  loading: boolean;
  error: string | null;
};

export const useKecamatanFilter = (opts?: { autoFetch?: boolean }) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getKecamatanFilter = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ kecamatan: Kecamatan[] }>(
        "/api/kecamatan-filter",
      );

      setState((prev) => ({ ...prev, data: res.data.kecamatan }));
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

    getKecamatanFilter();
  }, [autoFetch, getKecamatanFilter]);

  return {
    kecamatan: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getKecamatanFilter
  }
};
