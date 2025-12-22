import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useMemo } from "react";
import type { KendaraanRes } from "../__types";

export const useKendaraan = (search: string) => {
  const params = useMemo(
    () => ({
      search: search || undefined,
    }),
    [search],
  );
  return usePaginatedQuery<KendaraanRes>({
    url: "/api/data-kendaraan",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
