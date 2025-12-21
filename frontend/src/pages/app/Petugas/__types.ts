export type PetugasRes = {
  id: number;
  old_id: number;
  id_department: number;
  id_penugasan: number;
  nik: string;
  nama: string;
  department: {
    nama: string;
  };
  penugasan: {
    nama: string;
  };
  nama_kecamatan: string;
  nama_kelurahan: string;
  rute_kerja: string;
  panjang_jalur: string;
  status: string;
};

export type PetugasForm = {
  id_penugasan: number | null;
  nama: string;
  rute_kerja: string;
  status: string;
};