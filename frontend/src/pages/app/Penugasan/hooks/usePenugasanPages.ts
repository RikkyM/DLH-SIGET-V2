import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import type { Penugasan } from "@/types/master-data.types";
import { useMemo } from "react";

export const usePenugasanPages = (search: string) => {
  const params = useMemo(() => ({ search: search || undefined }), [search]);
  return usePaginatedQuery<Penugasan>({
    url: "/api/penugasans",
    params,
    initialPerPage: 25,
    enabled: true,
  });
};
