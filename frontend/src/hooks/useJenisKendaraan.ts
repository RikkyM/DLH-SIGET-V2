import { http } from "@/services/http";
import type { JenisKendaraan } from "@/types/master-data.types";
import { useCallback, useEffect, useState } from "react";

type State = {
  data: JenisKendaraan[];
  loading: boolean;
  error: string | null;
};

export const useJenisKendaraan = (options?: { autoFetch?: boolean }) => {
  const autoFetch = options?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getJenisKendaraan = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ jenis_kendaraan: JenisKendaraan[] }>(
        "/api/jenis-kendaraan",
      );

      setState((prev) => ({ ...prev, data: res.data.jenis_kendaraan }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil data jenis kendaraan.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getJenisKendaraan();
  }, [autoFetch, getJenisKendaraan]);

  return {
    jenisKendaraan: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getJenisKendaraan,
  };
};
