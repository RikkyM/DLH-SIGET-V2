export type PetugasRes = {
  id: number;
  old_id: number;
  id_department: number;
  nik: string;
  nama: string;
  nama_kecamatan: string;
  nama_kelurahan: string;
  status: string;
};

export type PetugasForm = {
  nama: string;
  status: string;
};