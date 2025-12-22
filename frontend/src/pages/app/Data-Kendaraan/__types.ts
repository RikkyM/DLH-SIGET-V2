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
    foto_kendaraan: string;
    uptd: string;
    nama_sopir: string;
    keterangan: string;
    jenis_kendaraan: {
        id: number;
        nama: string;
    }
}