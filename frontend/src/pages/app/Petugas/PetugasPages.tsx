import Dialog from "@/components/ui/Dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { http } from "@/services/http";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PetugasRes } from "./__types";
import EditButton from "./components/EditButton";
import FormEdit from "./components/FormEdit";

const PetugasPages = () => {
  const [data, setData] = useState<PetugasRes[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");

  const fetchPetugas = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await http.get("/api/petugas", {
        params: { search: debouncedSearch || undefined },
        headers: { Accept: "application/json" },
      });

      setData(res.data.data ?? []);
    } catch (err: unknown) {
      // kalau request dibatalkan, abaikan
      if (axios.isCancel(err)) return;
      if (err instanceof DOMException && err.name === "AbortError") return;

      setError("Gagal memuat data petugas.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchPetugas();
  }, [fetchPetugas]);

  const tableRows = useMemo(() => {
    return data?.map((d, index) => (
      <tr key={d.id} className="*:p-2">
        <td className="text-center">{index + 1}</td>
        <td className="text-center">{d.nik}</td>
        <td>{d.nama}</td>
        <td>{d?.nama_kelurahan ?? "-"}</td>
        <td>{d?.nama_kecamatan ?? "-"}</td>
        <td className="text-center capitalize">{d?.status ?? "-"}</td>
        <td className="text-center">
          <EditButton data={d} />
        </td>
      </tr>
    ));
  }, [data]);

  return (
    <section className="flex h-133 h-full flex-col gap-3 p-3">
      <div className="h-full space-y-2 rounded-lg border border-gray-300 bg-white p-3 shadow">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">Petugas</h4>
          <label htmlFor="search" className="inline-block">
            <input
              type="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search..."
              className="rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="max-h-133 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="*:sticky *:top-0 *:bg-white *:p-2">
                <th className="w-20">
                  <div className="w-20">No.</div>
                </th>
                <th>NIK</th>
                <th className="text-left">Nama</th>
                <th className="text-left">Kelurahan</th>
                <th className="text-left">Kecamatan</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    Loading data petugas...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                tableRows
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog>
        <FormEdit refetch={fetchPetugas} />
      </Dialog>
    </section>
  );
};

export default PetugasPages;
