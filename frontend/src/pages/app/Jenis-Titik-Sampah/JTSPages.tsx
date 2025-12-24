import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ChevronDown, Pencil, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useJenisTitikSampah } from "./hooks/useJenisTitikSampah";
import Dialog from "@/components/ui/Dialog";
import { useDialog } from "@/hooks/useDialog";
import FormEdit from "./components/FormEdit";

const JTSPages = () => {
  useDocumentTitle("Jenis Titik Sampah");

  const { mode, openDialog } = useDialog();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    meta,
    loading,
    error,
    fetch,
    setPage,
    perPage,
    setPerPage,
    resetToFirstPage,
  } = useJenisTitikSampah(debouncedSearch);

  useEffect(() => {
    resetToFirstPage();
  }, [debouncedSearch, resetToFirstPage]);

  const tableRows = useMemo(() => {
    const startIndex = (meta?.from ?? 1) - 1;

    return data?.map((d, index) => (
      <tr
        key={d.id ?? index}
        className="*:border-y *:border-gray-300 *:p-2 hover:*:bg-gray-300"
      >
        <td className="w-12 text-center">
          <div className="w-12">{startIndex + index + 1}</div>
        </td>
        <td className="w-25 text-center">
          {d.icon ? (
            <>
              <a
                href={`${import.meta.env.VITE_API_BASE}/api/jenis-titik-sampah/${d.id}/icon?v=${encodeURIComponent(d.updated_at ?? "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block rounded p-2 transition-colors duration-300 hover:bg-gray-200"
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE}/api/jenis-titik-sampah/${d.id}/icon?v=${encodeURIComponent(d.updated_at ?? "")}`}
                  alt="Icon Penugasan"
                  className="size-13 rounded object-cover"
                />
              </a>
            </>
          ) : (
            "-"
          )}
        </td>
        <td>{d?.nama ?? "-"}</td>
        <td className="sticky right-0 z-0 bg-white text-center">
          <button
            type="button"
            onClick={() => openDialog(d, "edit")}
            className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-200 focus:outline-none"
          >
            <Pencil className="max-w-5" />
          </button>
        </td>
      </tr>
    ));
  }, [data, meta?.from, openDialog]);

  return (
    <section className="flex flex-1 flex-col gap-3 overflow-auto p-3">
      <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-white p-3 shadow">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">Jenis Titik Sampah</h4>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              Show:
              <label
                htmlFor="per_page"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="per_page"
                  name="per_page"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
            </div>

            <label htmlFor="search" className="inline-block">
              <input
                type="search"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Search..."
                autoComplete="off"
                className="rounded-sm border border-gray-400 px-3 py-2 text-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="h-full w-full flex-1 touch-pan-x touch-pan-y overflow-auto">
          {loading ? (
            <div className="grid h-full w-full place-items-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="animate-spin" />
                <div>Memuat data</div>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="grid h-full w-full place-items-center">
              Data tidak ditemukan
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="*:sticky *:top-0 *:bg-white *:p-2">
                    <th className="w-12">
                      <div className="w-12">#</div>
                    </th>
                    <th className="text-center">Icon</th>
                    <th className="text-left">Nama Jenis Titik Sampah</th>
                    {/* <th className="text-left">Nama Kelurahan</th> */}
                    <th className="sticky top-0 right-0 z-10">Action</th>
                  </tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </table>
            </>
          )}
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      <Dialog>{mode === "edit" && <FormEdit refetch={fetch} />}</Dialog>
    </section>
  );
};

export default JTSPages;
