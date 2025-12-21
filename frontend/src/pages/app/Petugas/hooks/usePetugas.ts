import { useMemo } from "react";
import type { PetugasRes } from "../__types";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";

export const usePetugas = (
  search: string,
  unit_kerja?: number,
  penugasan?: number,
) => {
  const params = useMemo(
    () => ({ search: search || undefined, unit_kerja, penugasan }),
    [search, unit_kerja, penugasan],
  );
  return usePaginatedQuery<PetugasRes>({
    url: "/api/petugas",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
