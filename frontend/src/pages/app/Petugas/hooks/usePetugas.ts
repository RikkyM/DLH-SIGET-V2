import { useCallback, useEffect, useState } from "react";
import type { PetugasRes } from "../__types";
import { http } from "@/services/http";

type PetugasState = {
  data: PetugasRes[] | [];
  loading: boolean;
  error: string | null;
};

export const usePetugas = (search?: string) => {
  const [state, setState] = useState<PetugasState>({
    data: [],
    loading: false,
    error: null,
  });

  const getPetugas = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get("/api/petugas", {
        params: { search }
      });

      setState((prev) => ({ ...prev, data: res.data.data, loading: false }));
    } catch (err: unknown) {
      if (err instanceof DOMException) return;

      setState((prev) => ({ ...prev, data: [], error: "Gagal mengambil data petugas." }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [search]);

  useEffect(() => {
    void getPetugas();
  }, [getPetugas]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    fetch: getPetugas,
  };
};
