<?php

namespace App\Imports\Petugas;

use App\Models\DataKendaraan;
use App\Models\Department;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Penugasan;
use App\Models\Petugas;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class WithNikImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $row
     */
    public function collection(Collection $rows)
    {
        $datas = [];
        foreach ($rows as $row) {
            $petugas = Petugas::where('nik', $row['nik'])->first();
            $department = Department::where('nama', $row['department'] ?? null)->first();
            $kecamatan = Kecamatan::where('nama_kecamatan', $row['kecamatan'] ?? null)->first();
            $kelurahan = Kelurahan::where('nama_kelurahan', $row['kelurahan'] ?? null)->first();
            $penugasan = Penugasan::where('nama', $row['jenis_petugas'] ?? null)->first();
            $kendaraan = DataKendaraan::with('jenisKendaraan')->where('no_plat', $row['armada'] ?? null)->first();

            $panjang_jalur = trim($row['panjang_jalur']);
            $panjang_jalur = str_ireplace('m', '', $panjang_jalur);
            $panjang_jalur = str_replace(',', '.', $panjang_jalur);

            Petugas::updateOrCreate(['nik' => $row['nik']], [
                'id_department' => $department?->id,
                'id_penugasan' => $penugasan?->id,
                'id_kendaraan' => null,
                'id_kecamatan' => $kecamatan?->id,
                'id_kelurahan' => $kelurahan?->id,
                'nik' => $row['nik'] ?? $petugas?->nik ?? null,
                'nama' => $petugas?->nama ?? $row['nama'],
                'nama_jalan' => $row['nama_jalan'],
                'nama_kelurahan' => $kelurahan->nama_kelurahan ?? null,
                'nama_kecamatan' => $kecamatan->nama_kecamatan ?? null,
                'latitude' => $row['latitude'] ?: null,
                'longitude' => $row['longitude'] ?: null,
                'panjang_jalur' => $panjang_jalur,
                'rute_kerja' => $row['rute_kerja'],
                'armada' => $kendaraan?->no_plat ?? null,
                'no_lambung' => $kendaraan?->lambung ?? null,
                'jenis_angkutan' => $kendaraan?->jenisKendaraan->nama ?? null,
                'foto_petugas' => null,
                'keterangan' => null,
                'updated_at' => now(),
            ]);

            // $datas[] = [
            //     'id_department' => $department?->id,
            //     'id_penugasan' => $penugasan?->id,
            //     'id_kendaraan' => null,
            //     'id_kecamatan' => $kecamatan?->id,
            //     'id_kelurahan' => $kelurahan?->id,
            //     'nik' => $row['nik'] ?? $petugas?->nik ?? null,
            //     'nama' => $petugas?->nama ?? $row['nama'],
            //     'nama_jalan' => $row['nama_jalan'],
            //     'nama_kelurahan' => $kelurahan->nama_kelurahan ?? null,
            //     'nama_kecamatan' => $kecamatan->nama_kecamatan ?? null,
            //     'latitude' => $row['latitude'],
            //     'longitude' => $row['longitude'],
            //     'panjang_jalur' => $panjang_jalur,
            //     'rute_kerja' => $row['rute_kerja'],
            //     'armada' => null,
            //     'no_lambung' => null,
            //     'foto_petugas' => null,
            //     'keterangan' => null,
            //     'updated_at' => now(),
            // ];
        }

        // dd($datas);
    }
}
