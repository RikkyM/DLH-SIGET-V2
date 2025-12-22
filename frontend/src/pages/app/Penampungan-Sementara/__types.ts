export type PenampunganRes = {
  id: number;
  id_jts: number;
  id_jk: number;
  id_kecamatan: number;
  id_kelurahan: number;
  armada: string;
  kendaraan: {
    nama_sopir: string;
  };
  nama: string;
  nama_jalan: string;
  kelurahan: string;
  kecamatan: string;
  vol_sampah: string;
  status_kontainer: string;
  foto_lokasi: string;
  rute_kerja: string;
  no_lambung: string;
  keterangan: string;
  jenis_titik_sampah: {
    nama?: string;
  };
  jenis_kendaraan: {
    nama?: string;
  }
};