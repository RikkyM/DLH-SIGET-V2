import Dialog from "@/components/ui/Dialog";
import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import EditButton from "./components/EditButton";
import FormEdit from "./components/FormEdit";
import { usePetugas } from "./hooks/usePetugas";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useDepartments } from "@/hooks/useDepartments";
import { usePenugasan } from "@/hooks/usePenugasan";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const PetugasPages = () => {
  useDocumentTitle('Petugas')
  const [search, setSearch] = useState("");
  const [unitKerja, setUnitKerja] = useState<number | undefined>();
  const [penugasan, setPenugasan] = useState<number | undefined>();
  const debouncedSearch = useDebounce(search, 500);

  const { departments } = useDepartments();
  const { penugasan: dataPenugasan } = usePenugasan();

  const {
    data,
    meta,
    loading,
    error,
    // fetch,
    setPage,
    perPage,
    setPerPage,
    resetToFirstPage,
  } = usePetugas(debouncedSearch, unitKerja, penugasan);

  useEffect(() => {
    resetToFirstPage();
  }, [debouncedSearch, unitKerja, penugasan, resetToFirstPage]);

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
        <td className="text-center">{d.nik}</td>
        <td>{d.nama}</td>
        <td>{d?.department?.nama ?? "-"}</td>
        <td className="capitalize">
          {d?.penugasan?.nama.toLowerCase() ?? "-"}
        </td>
        <td className="capitalize">
          {d.tempat_lahir ? d.tempat_lahir.toLowerCase() : "-"}
        </td>
        <td className="text-center capitalize">
          {d.tanggal_lahir
            ? new Date(d.tanggal_lahir).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </td>
        <td className="text-center whitespace-nowrap capitalize">
          {d.tanggal_lahir ? `${d.usia} Tahun` : "-"}
        </td>
        <td className="text-center capitalize">{d?.jenis_kelamin ?? "-"}</td>
        <td className="w-72 text-left capitalize">
          <div className="w-72 max-w-72">{d?.alamat ?? "-"}</div>
        </td>
        <td className="text-center">{d?.rt ?? "-"}</td>
        <td className="text-center">{d?.rw ?? "-"}</td>
        <td className="capitalize">
          {d?.nama_kelurahan ? d.nama_kelurahan.toLowerCase() : "-"}
        </td>
        <td className="capitalize">
          {d?.nama_kecamatan ? d.nama_kecamatan.toLowerCase() : "-"}
        </td>
        <td className="capitalize">{d.agama ? d.agama.toLowerCase() : "-"}</td>
        <td className="capitalize">
          {d.status_perkawinan ? d.status_perkawinan.toLowerCase() : "-"}
        </td>
        <td className="capitalize">-</td>
        <td className="capitalize">-</td>
        <td className="text-center capitalize">
          {d?.panjang_jalur ? `${d.panjang_jalur} M` : "-"}
        </td>
        <td className="w-72 capitalize">
          <div className="w-72">{d?.rute_kerja ?? "-"}</div>
        </td>
        <td className="text-center capitalize">
          <span
            className={`font-medium ${
              d?.department?.nama != "NON AKTIF"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {d?.department?.nama != "NON AKTIF" ? "Aktif" : "Tidak Aktif"}
          </span>
        </td>
        <td className="sticky right-0 z-0 bg-white text-center">
          <EditButton data={d} />
        </td>
      </tr>
    ));
  }, [data, meta?.from]);

  return (
    <section className="flex flex-1 flex-col gap-3 overflow-auto p-3">
      <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-white p-3 shadow">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">Petugas</h4>

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

            <div className="flex items-center gap-2 text-sm text-gray-700">
              Filter:
              <label
                htmlFor="unit_kerja"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="unit_kerja"
                  name="unit_kerja"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={unitKerja}
                  onChange={(e) => {
                    setUnitKerja(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Unit Kerja</option>
                  {departments.map((dept, index) => (
                    <option key={dept.id ?? index} value={dept.id}>
                      {dept.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
              <label
                htmlFor="penugasan"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="penugasan"
                  name="penugasan"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={penugasan}
                  onChange={(e) => {
                    setPenugasan(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Penugasan</option>
                  {dataPenugasan.map((dept, index) => (
                    <option key={dept.id ?? index} value={dept.id}>
                      {dept.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
            </div>

            {/* <button
              onClick={() => fetch()}
              className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm"
              type="button"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </button> */}
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
                  <tr className="whitespace-nowrap *:sticky *:top-0 *:bg-white *:p-2">
                    <th className="w-12">
                      <div className="w-12">#</div>
                    </th>
                    <th>NIK</th>
                    <th className="text-left">Nama</th>
                    <th className="text-left">Unit Kerja</th>
                    <th className="text-left">Penugasan</th>
                    <th className="text-left">Tempat Lahir</th>
                    <th className="text-center">Tanggal Lahir</th>
                    <th className="text-center">Usia</th>
                    <th className="text-center">Jenis Kelamin</th>
                    <th className="text-left">Alamat</th>
                    <th className="text-center">RT</th>
                    <th className="text-center">RW</th>
                    <th className="text-left">Kelurahan</th>
                    <th className="text-left">Kecamatan</th>
                    <th className="text-left">Agama</th>
                    <th className="text-left">Status Perkawinan</th>
                    <th className="text-left">Pas Foto</th>
                    <th className="text-left">Foto Lapangan</th>
                    <th className="text-center">Panjang Jalur</th>
                    <th className="text-left">Rute / Jalur</th>
                    <th>Status</th>
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

      <Dialog>
        <FormEdit
        //  refetch={fetch}
        />
      </Dialog>
    </section>
  );
};

export default PetugasPages;
