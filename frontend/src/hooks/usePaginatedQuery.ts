import { http } from "@/services/http";
import type { PaginatedResponse, PaginationMeta } from "@/types/paginated";
import { useCallback, useEffect, useState } from "react";

type State<T> = {
  data: T[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
};

type Params = Record<string, unknown>;

export const usePaginatedQuery = <T>(opts: {
  url: string;
  params?: Params;
  initialPerPage?: number;
  enabled?: boolean;
}) => {
  const { url, params = {}, initialPerPage = 25, enabled = true } = opts;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  const [state, setState] = useState<State<T>>({
    data: [],
    meta: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    if (!enabled) return;

    setState((p) => ({ ...p, loading: true }));

    try {
      const res = await http.get<PaginatedResponse<T>>(url, {
        params: { ...params, page, per_page: perPage },
        headers: { Accept: "application/json" },
      });

      setState((p) => ({
        ...p,
        data: res.data.data ?? [],
        meta: res.data.meta ?? null,
      }));
    } catch {
      setState((p) => ({
        ...p,
        error: "Gagal mengambil data.",
      }));
    } finally {
      setState((p) => ({
        ...p,
        loading: false,
      }));
    }
  }, [url, params, page, perPage, enabled]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const goToPage = useCallback((next: number) => {
    setPage(() => {
      if (next < 1) return 1;
      return next;
    });
  }, []);

  const resetToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    data: state.data,
    meta: state.meta,
    loading: state.loading,
    error: state.error,

    page,
    perPage,
    setPerPage: (n: number) => {
      setPerPage(n);
      setPage(1);
    },
    setPage: goToPage,

    fetch,
    resetToFirstPage,
  };
};
