import { useDebounce } from "@/hooks/useDebounce";
import { ChevronDown, Pencil, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useKendaraan } from "./hooks/useKendaraan";
import Pagination from "@/components/ui/Pagination";
import { useDepartments } from "@/hooks/useDepartments";
import { useJenisKendaraan } from "@/hooks/useJenisKendaraan";
import { useTahunPembuatan } from "@/hooks/useTahunPembuatan";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useDialog } from "@/hooks/useDialog";
import Dialog from "@/components/ui/Dialog";
import FormEdit from "./components/FormEdit";
import FormTambah from "./components/FormTambah";

const DataKendaraanPages = () => {
  useDocumentTitle("Data Kendaraan");

  const { openDialog } = useDialog();

  const [search, setSearch] = useState("");
  const [unitKerja, setUnitKerja] = useState<number | undefined>();
  const [jenisKendaraan, setJenisKendaraan] = useState<number | undefined>();
  const [tahun, setTahun] = useState<number | undefined>();
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
  } = useKendaraan(debouncedSearch, unitKerja, jenisKendaraan, tahun);

  useEffect(() => {
    resetToFirstPage();
  }, [debouncedSearch, resetToFirstPage]);

  const { departments } = useDepartments();
  const { jenisKendaraan: dataJk } = useJenisKendaraan();
  const { tahunPembuatan: dataTahun } = useTahunPembuatan();

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
        <td className="text-center whitespace-nowrap">{d?.no_plat}</td>
        <td className="text-center">{d?.lambung_baru ?? "-"}</td>
        <td className="text-center">{d?.no_rangka ?? "-"}</td>
        <td className="text-center">{d?.no_mesin ?? "-"}</td>
        <td className="text-center">{d?.no_stnk ?? "-"}</td>
        <td className="text-left">
          <div className="w-38">{d?.merk ? d?.merk : "-"}</div>
        </td>
        <td className="text-center">{d?.jenis_kendaraan?.nama ?? "-"}</td>
        <td className="text-center">{d?.uptd ?? "-"}</td>
        <td className="text-center">{d?.tahun_pembuatan ?? "-"}</td>
        <td className="text-center">{d?.kapasitas_mesin ?? "-"}</td>
        <td className="text-center">{d?.berat ?? "-"}</td>
        <td className="text-center">{d?.warna ?? "-"}</td>
        <td className="text-center">{d?.jumlah_kontainer ?? "-"}</td>
        <td className="text-center">{d?.kondisi ?? "-"}</td>
        <td className="text-center">{d?.nama_sopir ?? "-"}</td>
        <td className="text-center">{d?.keterangan ?? "-"}</td>
        <td className="sticky right-0 z-0 bg-white text-center">
          <button
            type="button"
            onClick={() => openDialog("edit", d)}
            className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-200"
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
          <h4 className="text-xl font-semibold">Data Kendaraan</h4>

          <div className="flex flex-wrap items-center justify-between gap-2">
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
                    {dataJk.map((dept, index) => (
                      <option key={dept.id ?? index} value={dept.id}>
                        {dept.nama}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
                </label>
                <label
                  htmlFor="tahun_pembuatan"
                  className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
                >
                  <select
                    id="tahun_pembuatan"
                    name="tahun_pembuatan"
                    className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                    value={tahun}
                    onChange={(e) => {
                      setTahun(Number(e.target.value));
                    }}
                  >
                    <option value="">Pilih Tahun Pembuatan</option>
                    {dataTahun.map((dept, index) => (
                      <option key={dept ?? index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openDialog("tambah")}
              className="cursor-pointer rounded-md border border-gray-300 bg-green-500 px-3 py-2 text-sm font-medium text-white shadow-xs transition-colors duration-300 hover:bg-green-600"
            >
              Tambah
            </button>
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
                    <th className="text-left whitespace-nowrap">No. TNKB</th>
                    <th className="text-left whitespace-nowrap">No. Lambung</th>
                    <th className="text-left whitespace-nowrap">No. Rangka</th>
                    <th className="text-center whitespace-nowrap">No. Mesin</th>
                    <th className="text-center whitespace-nowrap">No. STNK</th>
                    <th className="text-left">Merk</th>
                    <th className="text-center">Jenis Kendaraan</th>
                    <th className="text-center">Wilayah UPTD</th>
                    <th className="text-left">Tahun</th>
                    <th className="text-center">Kapasitas Mesin</th>
                    <th className="text-center">Berat</th>
                    <th className="text-center">Warna</th>
                    <th className="text-left">Jumlah Kontainer</th>
                    <th className="text-left">Kondisi</th>
                    <th className="text-center">Nama Sopir</th>
                    <th className="text-left">Keterangan</th>
                    <th className="sticky top-0 right-0 z-10 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </table>
            </>
          )}
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      <Dialog size="max-w-4xl">
        <FormEdit refetch={fetch} />
        <FormTambah />
      </Dialog>
    </section>
  );
};

export default DataKendaraanPages;
