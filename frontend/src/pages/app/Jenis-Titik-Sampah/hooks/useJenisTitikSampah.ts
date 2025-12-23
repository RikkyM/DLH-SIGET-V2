import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import type { JenisTitikSampah } from "@/types/master-data.types";
import { useMemo } from "react";

export const useJenisTitikSampah = (search: string) => {
  const params = useMemo(() => ({ search: search || undefined }), [search]);
  return usePaginatedQuery<JenisTitikSampah>({
    url: "/api/master-data/jenis-titik-sampah",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
