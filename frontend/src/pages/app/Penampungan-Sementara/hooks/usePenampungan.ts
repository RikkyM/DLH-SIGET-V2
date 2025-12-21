import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useMemo } from "react";
import type { PenampunganRes } from "../__types";

export const usePenampungan = (
  search: string,
  unit_kerja?: number,
  jts?: number,
  jenis_kendaraan?: number
) => {
  const params = useMemo(
    () => ({
      search: search || undefined,
      unit_kerja,
      jenis_titik_sampah: jts,
      jenis_kendaraan
    }),
    [search, unit_kerja, jts, jenis_kendaraan],
  );
  return usePaginatedQuery<PenampunganRes>({
    url: "/api/penampungan-sementara",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
