import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useMemo } from "react";
import type { KendaraanRes } from "../__types";

export const useKendaraan = (
  search: string,
  unit_kerja?: number,
  jenis_kendaraan?: number,
  tahun?: number,
) => {
  const params = useMemo(
    () => ({
      search: search || undefined,
      unit_kerja,
      jenis_kendaraan,
      tahun,
    }),
    [search, unit_kerja, jenis_kendaraan, tahun],
  );
  return usePaginatedQuery<KendaraanRes>({
    url: "/api/data-kendaraan",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
