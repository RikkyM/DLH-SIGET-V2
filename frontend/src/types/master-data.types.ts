export type JTS = {
  id: number;
  nama: string;
  icon: string;
  updated_at: string;
};

export type Departments = {
  id: number;
  nama: string;
};

export type Penugasan = {
  id: number;
  icon: string;
  nama: string;
  updated_at: string;
};

export type UnitKerja = {
  id: number;
  nama: string;
};

export type Kelurahan = {
  id: number;
  id_kecamatan: number;
  nama_kelurahan: string;
  kecamatan: Kecamatan;
};

export type Kecamatan = {
  id: number;
  nama_kecamatan: string;
};

export type JenisKendaraan = {
  id: number;
  nama: string;
};

export type JenisTitikSampah = {
  id: number;
  icon: string;
  nama: string;
  updated_at: string;
}