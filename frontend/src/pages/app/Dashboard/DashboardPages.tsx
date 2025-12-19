import { useEffect, useState } from "react";
import { http } from "@/services/http";
import Table from "./components/Table";

type DashboardRow = {
  uptd_id: number;
  uptd_nama: string;

  petugas_total: number;
  petugas_counts: Record<string, number>;

  tps_total: number;
  tps_counts: Record<string, number>;

  kendaraan_total: number;
  kendaraan_counts: Record<string, number>;
};

type DashboardRes = {
  total_petugas: number;
  total_kendaraan: number;
  total_tps: number;
  total_uptd: number;

  penugasan_headers: string[];
  jenis_tps_headers: string[];
  jenis_kendaraan_headers: string[];

  rows: DashboardRow[];
};

const DashboardPages = () => {
  const [data, setData] = useState<DashboardRes | null>(null);

  const penugasanRows = (data?.rows ?? []).map((r) => ({
    uptd_id: r.uptd_id,
    uptd_nama: r.uptd_nama,
    total: r.petugas_total,
    counts: r.petugas_counts,
  }));

  const jenisTpsRows = (data?.rows ?? []).map((r) => ({
    uptd_id: r.uptd_id,
    uptd_nama: r.uptd_nama,
    total: r.tps_total,
    counts: r.tps_counts,
  }));

  const jenisKendaraanRows = (data?.rows ?? []).map((r) => ({
    uptd_id: r.uptd_id,
    uptd_nama: r.uptd_nama,
    total: r.kendaraan_total,
    counts: r.kendaraan_counts,
  }));

  useEffect(() => {
    (async () => {
      const res = await http.get<DashboardRes>("/api/dashboard");
      setData(res.data);
    })();
  }, []);

  return (
    <section className="flex flex-col gap-3 p-3">
      <div className="grid grid-cols-4 gap-3 *:min-h-28 *:justify-between *:rounded-lg *:border *:border-gray-300 *:bg-white *:p-3 *:shadow">
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold">Total Petugas</h4>
          <p className="text-xl font-medium">{data?.total_petugas ?? "-"}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold">Total Kendaraan</h4>
          <p className="text-xl font-medium">{data?.total_kendaraan ?? "-"}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold">Total Titik Sampah</h4>
          <p className="text-xl font-medium">{data?.total_tps ?? "-"}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold">Total UPTD</h4>
          <p className="text-xl font-medium">{data?.total_uptd ?? "-"}</p>
        </div>
      </div>

      {/* <div className="h-full rounded-lg border border-gray-300 bg-white p-3 shadow">
        <div className="space-y-1">
          <h2 className="font-semibold">Jumlah Penugasan</h2>
          <p className="text-sm text-gray-400">
            Data penugasan petugas berdasarkan UPTD
          </p>
        </div>

        <div className="h-full overflow-auto max-h-96">
          <table className="w-full border-collapse">
            <thead className="whitespace-nowrap">
              <tr className="*:sticky *:top-0 border-b border-gray-400 *:bg-white *:p-2">
                <th className="w-16 max-w-16 text-left">
                  <div className="w-16">No.</div>
                </th>
                <th className="text-left sticky left-0 top-0 z-10">
                  <div className="min-w-40">Nama UPTD</div>
                </th>
                <th className="text-center">Total Petugas</th>

                {data?.penugasan_headers?.map((h) => (
                  <th key={h} className="text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data?.rows?.map((row, index) => (
                <tr key={row.uptd_id} className="border-b *:p-2">
                  <td>{index + 1}</td>
                  <td className="text-left whitespace-nowrap sticky left-0 bg-white">{row.uptd_nama}</td>
                  <td className="text-center">{row.total}</td>

                  {data.penugasan_headers.map((h) => (
                    <td key={h} className="text-center">
                      {row.counts?.[h] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}

              {!data?.rows?.length && (
                <tr>
                  <td
                    colSpan={(data?.penugasan_headers?.length ?? 0) + 3}
                    className="p-4 text-center text-sm text-gray-400"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
      {/* <Table
        title="Jumlah Penugasan"
        subtitle="Data penugasan petugas berdasarkan UPTD"
        headers={data?.penugasan_headers ?? []}
        rows={data?.rows ?? []}
      /> */}

      <Table
        title="Jumlah Penugasan"
        subtitle="Data penugasan petugas berdasarkan UPTD"
        headers={data?.penugasan_headers ?? []}
        rows={penugasanRows}
      />

      <Table
        title="Jumlah Jenis Titik Sampah"
        subtitle="Data titik sampah berdasarkan jenis per UPTD"
        headers={data?.jenis_tps_headers ?? []}
        rows={jenisTpsRows}
      />

      <Table
        title="Jumlah Jenis Kendaraan"
        subtitle="Data kendaraan berdasarkan jenis per UPTD"
        headers={data?.jenis_kendaraan_headers ?? []}
        rows={jenisKendaraanRows}
      />
    </section>
  );
};

export default DashboardPages;
