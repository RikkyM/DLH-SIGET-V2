import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import type { UnitKerja } from "@/types/master-data.types";
import { useMemo } from "react";

export const useUnitKerja = (search: string) => {
  const params = useMemo(
    () => ({
      search: search || undefined,
    }),
    [search],
  );
  return usePaginatedQuery<UnitKerja>({
    url: "/api/unit-kerja",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
