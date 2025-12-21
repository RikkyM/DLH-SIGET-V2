import { useEffect, useState } from "react";
import { http } from "@/services/http";
import Table from "./components/Table";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

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
  useDocumentTitle("Dashboard");
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
          <h4 className="text-xl font-semibold">Petugas Kebersihan</h4>
          <p className="text-xl font-medium">{data?.total_petugas ?? "-"}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold">Kendaraan Kebersihan</h4>
          <p className="text-xl font-medium">{data?.total_kendaraan ?? "-"}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold">
            Tempat Penampungan Sementara
          </h4>
          <p className="text-xl font-medium">{data?.total_tps ?? "-"}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold">UPTD Lingkungan Hidup</h4>
          <p className="text-xl font-medium">{data?.total_uptd ?? "-"}</p>
        </div>
      </div>

      <Table
        title="Jumlah Petugas Kebersihan"
        subtitle="Data petugas kebersihan berdasarkan wilayah UPTD"
        headers={data?.penugasan_headers ?? []}
        rows={penugasanRows}
      />

      <Table
        title="Jumlah Tempat Penampungan Sementara (TPS)"
        subtitle="Data tempat penampungan sementara berdasarkan wilayah UPTD"
        headers={data?.jenis_tps_headers ?? []}
        rows={jenisTpsRows}
      />

      <Table
        title="Jumlah Data Kendaraan Angkutan Kebersihan"
        subtitle="Data kendaraan angkutan kebersihan berdasarkan wilayah UPTD"
        headers={data?.jenis_kendaraan_headers ?? []}
        rows={jenisKendaraanRows}
      />
    </section>
  );
};

export default DashboardPages;
