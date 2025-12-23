import { http } from "@/services/http";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: number[];
  loading: boolean;
  error: string | null;
};

export const useTahunPembuatan = (opts?: { autoFetch?: boolean }) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getTahunPembuatan = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ years: number[] }>(
        "/api/data-kendaraan/tahun-pembuatan",
      );

      setState((prev) => ({ ...prev, data: res.data.years }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil tahun pembuatan kendaraan.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getTahunPembuatan();
  }, [autoFetch, getTahunPembuatan]);

  return {
    tahunPembuatan: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getTahunPembuatan,
  };
};
