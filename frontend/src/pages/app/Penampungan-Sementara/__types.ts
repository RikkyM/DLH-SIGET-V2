export type PenampunganRes = {
  id: number;
  id_jts: number;
  id_jk: number;
  id_kecamatan: number;
  id_kelurahan: number;
  id_department: number;
  armada: string;
  kendaraan: {
    nama_sopir: string;
  };
  nama: string;
  nama_jalan: string;
  kelurahan: string;
  kecamatan: string;
  latitude: string;
  longitude: string;
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

export type PenampunganForm = {
  id_jts: number | null;
  id_jk: number | null;
  id_department: number | null;
  id_kecamatan: number | null;
  id_kelurahan: number | null;
  armada?: string;
  nama?: string;
  nama_jalan?: string;
  latitude?: string | number;
  longitude?: string | number;
  vol_sampah?: string;
  status_kontainer?: string;
  rute_kerja?: string;
  keterangan?: string;
};