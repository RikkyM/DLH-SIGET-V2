import { http } from "@/services/http";
import type { Kelurahan } from "@/types/master-data.types";

import { useCallback, useEffect, useState } from "react";

type State = {
  data: Kelurahan[];
  loading: boolean;
  error: string | null;
};

export const useKelurahanFilter = (
  idKecamatan: number | null,
  opts?: { autoFetch?: boolean },
) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getKelurahanFilter = useCallback(async () => {
    if (!idKecamatan) {
      setState((p) => ({ ...p, data: [], loading: false, error: null }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ kelurahan: Kelurahan[] }>(
        "/api/kelurahan-filter",
        { params: { id_kecamatan: idKecamatan } },
      );

      setState((prev) => ({ ...prev, data: res.data.kelurahan }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({
        ...prev,
        error: "Gagal mengambil data kendaraan.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [idKecamatan]);

  useEffect(() => {
    if (!autoFetch) return;

    getKelurahanFilter();
  }, [autoFetch, getKelurahanFilter]);

  return {
    kelurahan: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getKelurahanFilter,
  };
};
