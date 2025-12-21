<?php

namespace App\Imports\Petugas;

use App\Models\DataKendaraan;
use App\Models\Department;
use App\Models\JenisKendaraan;
use App\Models\Petugas;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStyles;

class KendaraanPetugasImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $datas = [];

        foreach ($rows as $row) {
            $row = $row->forget(['no', 'no_tnkb']);

            $dept = Department::where('nama', $row['unit_kerja'])->first();
            $jenis = JenisKendaraan::where('nama', trim($row['jenis_kendaraan']))->first();
            $petugas = Petugas::where('nama', trim($row['sopir_angkutan']))->first();

            // $datas[] = $jenis?->id ?? "-";

            // $datas[] = [
            //     'id_jenis' => $jenis->id,
            //     'id_department' => $dept->id,
            //     'id_petugas' => null,
            //     'no_plat' => strtoupper(trim($row['no_plat'])),
            //     'merk' => strtoupper(trim($row['merk'])),
            //     'lambung_lama' => strtoupper(trim($row['lambung_lama'])) ?? null,
            //     'lambung_baru' => strtoupper(trim($row['lambung_baru'])) ?? null,
            //     'no_rangka' => strtoupper(trim($row['nomor_rangka'])),
            //     'no_mesin' => strtoupper(trim($row['nomor_mesin'])),
            //     'no_stnk' => strtoupper(trim($row['nomor_stnk'])) ?? null,
            //     'tahun_pembuatan' => strtoupper(trim($row['tahun'])),
            //     'kapasitas_mesin' => strtoupper(trim($row['kapasitas_mesin'])),
            //     'warna' => strtoupper(trim($row['warna'])),
            //     'kondisi' => strtoupper(trim($row['kondisi'])),
            //     'uptd' => trim(strtoupper($dept->nama)),
            //     'nama_sopir' => trim(strtoupper($row['sopir_angkutan'])),
            //     'keterangan' => null
            // ];

            DataKendaraan::create([
                'id_jenis' => $jenis->id, //     'id_jenis' => $jenis->id,
                'id_department' => $dept->id,
                'id_petugas' => null,
                'no_plat' => strtoupper(trim($row['no_plat'])),
                'merk' => strtoupper(trim($row['merk'])),
                'lambung_lama' => $row['lambung_lama'] ? strtoupper(trim($row['lambung_lama'])) : null,
                'lambung_baru' => $row['lambung_baru'] ? strtoupper(trim($row['lambung_baru'])) : null,
                'no_rangka' => $row['nomor_rangka'] ? strtoupper(trim($row['nomor_rangka'])) : null,
                'no_mesin' => $row['nomor_mesin'] ? strtoupper(trim($row['nomor_mesin'])) : null,
                'no_stnk' => $row['nomor_stnk'] ? strtoupper(trim($row['nomor_stnk'])) : null,
                'tahun_pembuatan' => strtoupper(trim($row['tahun'])),
                'kapasitas_mesin' => $row['kapasitas_mesin'],
                'warna' => strtoupper(trim($row['warna'])),
                'kondisi' => strtoupper(trim($row['kondisi'])),
                'uptd' => trim(strtoupper($dept->nama)),
                'nama_sopir' => trim(strtoupper($row['sopir_angkutan'])),
                'keterangan' => null
            ]);
        }

        // dd($datas);
    }
}
