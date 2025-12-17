import { useEffect, useMemo, useRef, useState } from "react";

export type MultiSelectOption = {
  value: string;
  label: string;
  count: number;
};

type Props = {
  label?: string;
  count?: number;
  placeholder?: string;
  options: MultiSelectOption[];
  value: string[]; // selected values
  onChange: (next: string[]) => void;
  className?: string;
};

export default function MultiSelectDropdown({
  label,
  placeholder = "Pilih...",
  options,
  value,
  onChange,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedLabels = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]));
    return value.map((v) => map.get(v) ?? v);
  }, [options, value]);

  const toggleValue = (v: string) => {
    const next = new Set(value);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange(Array.from(next));
  };

  const clearAll = () => onChange([]);

  // ✅ Toggle 1 tombol: Check all / Uncheck all
  const allValues = useMemo(() => options.map((o) => o.value), [options]);
  const allSelected = value.length > 0 && value.length === options.length;

  const toggleAll = () => {
    onChange(allSelected ? [] : allValues);
  };

  // close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm",
          "shadow-sm transition",
          "border-slate-200 hover:bg-slate-50",
          "focus:ring-2 focus:ring-slate-200 focus:outline-none",
        ].join(" ")}
      >
        <span className="min-w-0 flex-1 truncate text-slate-700">
          {value.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : value.length <= 2 ? (
            selectedLabels.join(", ")
          ) : (
            `${value.length} dipilih`
          )}
        </span>

        <span className="flex items-center gap-2">
          {value.length > 0 ? (
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearAll();
              }}
              className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100"
              role="button"
              aria-label="Clear"
              title="Clear"
            >
              Clear
            </span>
          ) : null}

          <svg
            className={`h-4 w-4 text-slate-500 transition ${
              open ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          className={[
            "absolute top-[calc(100%+6px)] left-0 z-50 w-full overflow-hidden rounded-md border bg-white shadow-lg",
            "border-slate-200",
          ].join(" ")}
        >
          <div className="p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari..."
              className={[
                "w-full rounded-md border px-3 py-2 text-sm",
                "border-slate-200 bg-white",
                "focus:ring-2 focus:ring-slate-200 focus:outline-none",
              ].join(" ")}
            />
          </div>

          <div className="max-h-56 overflow-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500">
                Tidak ada data.
              </div>
            ) : (
              filtered.map((opt) => {
                const checked = selectedSet.has(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={[
                      "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm",
                      "hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleValue(opt.value)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span className="flex-1 text-slate-700">
                      {opt.label} {opt.count}
                    </span>

                    {checked ? (
                      <span className="text-xs text-slate-500">✓</span>
                    ) : null}
                  </label>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-slate-100 p-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {value.length}/{options.length} dipilih
              </span>
              <button
                type="button"
                onClick={toggleAll}
                className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                {allSelected ? "Hapus semua centang" : "Pilih Semua"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
            >
              Selesai
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
