import Dialog from "@/components/ui/Dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useMemo, useState } from "react";
import EditButton from "./components/EditButton";
import FormEdit from "./components/FormEdit";
import { usePetugas } from "./hooks/usePetugas";
import { RefreshCw } from "lucide-react";

const PetugasPages = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, loading, error, fetch } = usePetugas(debouncedSearch);

  const tableRows = useMemo(() => {
    return data?.map((d, index) => (
      <tr key={d.id ?? index} className="*:p-2 hover:*:bg-gray-300">
        <td className="w-12 text-center">
          <div className="w-12">{index + 1}</div>
        </td>
        <td className="text-center">{d.nik}</td>
        <td>{d.nama}</td>
        <td>{d?.department?.nama ?? "-"}</td>
        <td className="capitalize">
          {d?.penugasan?.nama.toLowerCase() ?? "-"}
        </td>
        <td className="capitalize">
          {d?.nama_kelurahan ? d?.nama_kelurahan.toLowerCase() : "-"}
        </td>
        <td className="capitalize">
          {d?.nama_kecamatan ? d?.nama_kecamatan.toLowerCase() : "-"}
        </td>
        <td className="capitalize text-center">
          {d?.panjang_jalur ? `${d?.panjang_jalur} M` : "-"}
        </td>
        <td className="w-72 capitalize">
          <div className="w-72">{d?.rute_kerja ?? "-"}</div>
        </td>
        <td className="text-center capitalize">{d?.status ?? "-"}</td>
        <td className="sticky right-0 z-0 text-center bg-white">
          <EditButton data={d} />
        </td>
      </tr>
    ));
  }, [data]);

  return (
    <section className="flex flex-1 flex-col gap-3 overflow-auto p-3">
      <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-white p-3 shadow">
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
              autoComplete="off"
              className="rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="h-full w-full flex-1 overflow-auto touch-pan-y touch-pan-x">
          {loading && debouncedSearch?.trim().length > 0 ? (
            <div className="grid h-full w-full place-items-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="animate-spin" />
                <div>Mencari data</div>
              </div>
            </div>
          ) : loading && debouncedSearch?.trim().length === 0 ? (
            <div className="grid h-full w-full place-items-center">
              <RefreshCw className="animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <>Data tidak ditemukan</>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="*:sticky *:top-0 *:bg-white *:p-2 whitespace-nowrap">
                  <th className="w-12">
                    <div className="w-12">No.</div>
                  </th>
                  <th>NIK</th>
                  <th className="text-left">Nama</th>
                  <th className="text-left">Department</th>
                  <th className="text-left">Penugasan</th>
                  <th className="text-left">Kelurahan</th>
                  <th className="text-left">Kecamatan</th>
                  <th className="text-center">Panjang Jalur</th>
                  <th className="text-left">Rute</th>
                  <th>Status</th>
                  <th className="sticky top-0 right-0 z-10">Action</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          )}
        </div>
      </div>
      <Dialog>
        <FormEdit refetch={fetch} />
      </Dialog>
    </section>
  );
};

export default PetugasPages;
