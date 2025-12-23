import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import type { Kelurahan } from "@/types/master-data.types";
import { useMemo } from "react";

export const useKelurahan = (search: string) => {
  const params = useMemo(() => ({ search: search || undefined }), [search]);
  return usePaginatedQuery<Kelurahan>({
    url: "/api/kelurahan",
    params,
    initialPerPage: 25,
    enabled: true
  })
};
