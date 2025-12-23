import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import type { JenisKendaraan } from "@/types/master-data.types";
import { useMemo } from "react";

export const useJenisKendaraanData = (search: string) => {
  const params = useMemo(() => ({ search: search || undefined }), [search]);
  return usePaginatedQuery<JenisKendaraan>({
    url: "/api/master-data/jenis-kendaraan",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
