import { ChevronDown, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePenampungan } from "./hooks/usePenampungan";
import { useDebounce } from "@/hooks/useDebounce";
import { useDepartments } from "@/hooks/useDepartments";
import { useJts } from "@/hooks/useJts";
import { useJenisKendaraan } from "@/hooks/useJenisKendaraan";
import Pagination from "@/components/ui/Pagination";
import { useTnkbTps } from "@/hooks/useTnkbTps";
import { useLambungTps } from "@/hooks/useLambungTps";
import ActionButton from "./components/ActionButton";
import Dialog from "@/components/ui/Dialog";
import { useDialog } from "@/hooks/useDialog";
import type { PenampunganRes } from "./__types";
import FormEdit from "./components/FormEdit";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const PenampunganPages = () => {
  useDocumentTitle('TPS')

  const { mode } = useDialog<PenampunganRes>();

  const [search, setSearch] = useState("");
  const [unitKerja, setUnitKerja] = useState<number | undefined>();
  const [jts, setJts] = useState<number | undefined>();
  const [jenisKendaraan, setJenisKendaraan] = useState<number | undefined>();
  const [tnkb, setTnkb] = useState("");
  const [lambung, setLambung] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { departments } = useDepartments();
  const { jts: dataJts } = useJts();
  const { jenisKendaraan: dataJk } = useJenisKendaraan();
  const { tnkbTps } = useTnkbTps();
  const { lambungTps } = useLambungTps();

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
  } = usePenampungan(
    debouncedSearch,
    unitKerja,
    jts,
    jenisKendaraan,
    tnkb,
    lambung,
  );

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
        <td>{d?.jenis_titik_sampah?.nama ?? "-"}</td>
        <td>
          <div className="w-30">{d.nama}</div>
        </td>
        <td>
          <div className="w-30">{d.nama_jalan}</div>
        </td>
        <td className="capitalize">
          {d?.kelurahan ? d?.kelurahan.toLowerCase() : "-"}
        </td>
        <td className="capitalize">
          {d?.kecamatan ? d?.kecamatan.toLowerCase() : "-"}
        </td>
        <td className="text-left">{d?.jenis_kendaraan?.nama ?? "-"}</td>
        <td className="text-center">
          {d?.vol_sampah ? `${d?.vol_sampah} KG` : "-"}
        </td>
        <td className="text-center capitalize">{d?.status_kontainer ?? "-"}</td>
        <td className="text-left">
          <div className="w-64">{d?.rute_kerja ?? "-"}</div>
        </td>
        <td className="text-left">{d?.kendaraan?.nama_sopir ?? "-"}</td>
        <td className="text-left whitespace-nowrap">{d?.armada ?? "-"}</td>
        <td className="text-center whitespace-nowrap">
          {d?.no_lambung ?? "-"}
        </td>
        <td className="text-left">-</td>
        <td className="text-left">{d?.keterangan ?? "-"}</td>
        <td className="sticky right-0 z-0 bg-white text-center">
          {/* <button
            type="button"
            className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-200"
          >
            <Pencil className="max-w-5" />
          </button> */}
          <ActionButton data={d} />
        </td>
      </tr>
    ));
  }, [data, meta?.from]);

  return (
    <section className="flex flex-1 flex-col gap-3 overflow-auto p-3">
      <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-white p-3 shadow">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">
            Titik Sampah Sementara (TPS)
          </h4>

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
                htmlFor="id_jts"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="id_jts"
                  name="id_jts"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={jts}
                  onChange={(e) => {
                    setJts(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Jenis Titik Sampah</option>
                  {dataJts.map((dept, index) => (
                    <option key={dept.id ?? index} value={dept.id}>
                      {dept.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
              <label
                htmlFor="id_jk"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="id_jk"
                  name="id_jk"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={jenisKendaraan}
                  onChange={(e) => {
                    setJenisKendaraan(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Jenis Kendaraan</option>
                  {dataJk.map((data, index) => (
                    <option key={data.id ?? index} value={data.id}>
                      {data.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
              <label
                htmlFor="no_tnkb"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="no_tnkb"
                  name="no_tnkb"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={tnkb}
                  onChange={(e) => {
                    setTnkb(e.target.value);
                  }}
                >
                  <option value="">Pilih No Tnkb</option>
                  {tnkbTps.map((data, index) => (
                    <option key={data ?? index} value={data}>
                      {data}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
              <label
                htmlFor="no_lambung"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="no_lambung"
                  name="no_lambung"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={lambung}
                  onChange={(e) => {
                    setLambung(e.target.value);
                  }}
                >
                  <option value="">Pilih No Lambung</option>
                  {lambungTps.map((data, index) => (
                    <option key={data ?? index} value={data}>
                      {data}
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
                  <tr className="*:sticky *:top-0 *:bg-white *:p-2">
                    <th className="w-12">
                      <div className="w-12">#</div>
                    </th>
                    <th className="text-left whitespace-nowrap">Jenis TPS</th>
                    <th className="text-left">Nama TPS</th>
                    <th className="text-left">Nama Jalan</th>
                    <th className="text-left">Kelurahan</th>
                    <th className="text-left">Kecamatan</th>
                    <th className="text-left">Jenis Kendaraan</th>
                    <th className="text-center whitespace-nowrap">
                      Vol. Sampah
                    </th>
                    <th className="text-center">Status Kontainer</th>
                    <th className="text-left">Rute Angkutan</th>
                    <th className="text-left whitespace-nowrap">Nama Sopir</th>
                    <th className="text-left whitespace-nowrap">No. TNKB</th>
                    <th className="text-left whitespace-nowrap">No. Lambung</th>
                    <th className="text-left whitespace-nowrap">Foto Lokasi</th>
                    <th className="text-left">Keterangan</th>
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
        {mode == "edit" ? (
          <FormEdit refetch={fetch} />
        ) : (
          <>Detail Penampungan</>
        )}
      </Dialog>
    </section>
  );
};

export default PenampunganPages;
