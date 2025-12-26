type FotoKey = "foto_depan" | "foto_belakang" | "foto_kanan" | "foto_kiri";

type FotoKendaraan = Partial<Record<FotoKey, string>>;

export type KendaraanRes = {
  id: number;
  id_jenis: number;
  id_department: number;
  id_petugas: number;
  no_plat: string;
  merk: string;
  lambung_baru: string;
  no_rangka: string;
  no_mesin: string;
  no_stnk: string;
  tahun_pembuatan: string;
  kapasitas_mesin: string;
  warna: string;
  berat: string;
  jumlah_kontainer: string;
  kondisi: string;
  foto_kendaraan?: FotoKendaraan | null;
  uptd: string;
  nama_sopir: string;
  keterangan: string;
  jenis_kendaraan: {
    id: number;
    nama: string;
  };
  updated_at: string;
};

export type FormState = {
  id_jenis: number | null;
  id_department: number | null;
  id_petugas: number | null;
  no_plat: string;
  merk: string;
  lambung_baru: string;
  no_rangka: string;
  no_mesin: string;
  no_stnk: string;
  tahun_pembuatan: string;
  kapasitas_mesin: string;
  warna: string;
  berat: string;
  jumlah_kontainer: string;
  kondisi: string;
  foto_kendaraan: string;
  keterangan: string;
};

export type FotoState = {
  foto_depan: File | null;
  foto_belakang: File | null;
  foto_kanan: File | null;
  foto_kiri: File | null;
};

export const initialState: FormState = {
  id_jenis: null,
  id_department: null,
  id_petugas: null,
  no_plat: "",
  merk: "",
  lambung_baru: "",
  no_rangka: "",
  no_mesin: "",
  no_stnk: "",
  tahun_pembuatan: "",
  kapasitas_mesin: "",
  warna: "",
  berat: "",
  jumlah_kontainer: "",
  kondisi: "",
  foto_kendaraan: "",
  keterangan: "",
};
