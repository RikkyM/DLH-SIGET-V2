import type { PaginationMeta } from "@/types/paginated";

function getPages(current: number, last: number, windowSize = 2) {
  const pages: (number | "...")[] = [];
  if (last <= 1) return [1];

  const push = (v: number | "...") => pages.push(v);

  const start = Math.max(1, current - windowSize);
  const end = Math.min(last, current + windowSize);

  push(1);

  if (start > 2) push("...");

  for (let p = start; p <= end; p++) {
    if (p !== 1 && p !== last) push(p);
  }

  if (end < last - 1) push("...");

  if (last !== 1) push(last);

  return pages;
}

export default function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}) {
  if (!meta || meta.last_page <= 1) return null;

  const pages = getPages(meta.current_page, meta.last_page);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
      <div className="text-sm text-gray-600">
        Menampilkan <span className="font-medium">{meta.from ?? 0}</span> -{" "}
        <span className="font-medium">{meta.to ?? 0}</span> dari{" "}
        <span className="font-medium">{meta.total}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="cursor-pointer rounded border border-gray-500 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          Prev
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`e-${i}`}
              className="px-2 text-sm text-gray-500 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`cursor-pointer rounded border border-gray-500 px-2 py-1 text-sm ${
                p === meta.current_page ? "bg-gray-200 font-semibold" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}

        <button
          className="cursor-pointer rounded border border-gray-500 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
