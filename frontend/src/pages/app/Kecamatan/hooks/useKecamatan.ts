import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import type { Kecamatan } from "@/types/master-data.types";
import { useMemo } from "react";

export const useKecamatan = (search: string) => {
  const params = useMemo(() => ({ search: search || undefined }), [search]);
  return usePaginatedQuery<Kecamatan>({
    url: "/api/kecamatan",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
