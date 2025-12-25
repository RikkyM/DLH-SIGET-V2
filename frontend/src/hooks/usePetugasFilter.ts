import { http } from "@/services/http";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type Petugas = {
  id: number;
  nama: string;
};

type State = {
  data: Petugas[];
  loading: boolean;
  error: string | null;
};

export const usePetugasFilter = (opts?: { autoFetch?: boolean }) => {
  const autoFetch = opts?.autoFetch ?? true;

  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const getPetugasFilter = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await http.get<{ petugas: Petugas[] }>("/api/petugas-filter");

      setState((prev) => ({ ...prev, data: res.data.petugas }));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.errors) {
          setState((prev) => ({
            ...prev,
            error: err.response?.data?.errors,
          }));
        }
        return;
      }
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;

    getPetugasFilter();
  }, [autoFetch, getPetugasFilter]);

  return {
    petugas: state.data,
    loading: state.loading,
    error: state.error,
    refetch: getPetugasFilter,
  };
};
