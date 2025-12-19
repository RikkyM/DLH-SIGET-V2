export type MatrixRow = {
  uptd_id: number;
  uptd_nama: string;
  total: number;
  counts: Record<string, number>;
};

export type DashboardRes = {
  total_petugas: number;
  total_kendaraan: number;
  total_tps: number;
  total_uptd: number;

  penugasan_headers: string[];
  penugasan_rows: MatrixRow[];

  jts_headers: string[];
  jts_rows: MatrixRow[];

  jk_headers: string[];
  jk_rows: MatrixRow[];
};
