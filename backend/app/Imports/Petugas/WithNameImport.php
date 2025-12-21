<?php

namespace App\Imports\Petugas;

use App\Models\Department;
use App\Models\Kecamatan;
use App\Models\Penugasan;
use App\Models\Petugas;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class WithNameImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $datas = [];
        foreach ($rows as $row) {
            $row = $row->forget(['no']);

            $petugas = Petugas::where('nama', $row['nama'])->first();
            $department = Department::where('nama', $row['department'] ?? null)->first();
            $kecamatan = Kecamatan::where('nama_kecamatan', $row['kecamatan'] ?? null)->first();
            $penugasan = Penugasan::where('nama', $row['jenis_petugas'] ?? null)->first();

            // $datas[] = $row;

            Petugas::updateOrCreate(
                ['nama' => $row['nama'], 'id_department' => $department->id],
                [
                    'id_department' => $department?->id,
                    'id_penugasan' => $penugasan?->id,
                    'id_kendaraan' => null,
                    'id_kecamatan' => $kecamatan?->id,
                    'id_kelurahan' => null,
                    'nik' => $row['nik'] ?? $petugas?->nik ?? null,
                    'nama' => $petugas?->nama ?? $row['nama'],
                    'nama_jalan' => null,
                    'nama_kelurahan' => null,
                    'nama_kecamatan' => $kecamatan->nama_kecamatan ?? null,
                    // 'latitude' => null,
                    // 'longitude' => null,
                    'latitude' => $row['latitude'] ?? null,
                    'longitude' => $row['longitude'] ?? null,
                    'panjang_jalur' => null,
                    'rute_kerja' => $row['rute_kerja'],
                    'armada' => null,
                    'no_lambung' => null,
                    'foto_petugas' => null,
                    'keterangan' => null,
                    'updated_at' => now(),
                ]
            );
        }

        // dd($datas);
    }
}
