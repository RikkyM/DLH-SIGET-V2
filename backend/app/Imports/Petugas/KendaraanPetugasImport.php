<?php

namespace App\Imports\Petugas;

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
            $datas[] = $row;
        }

        dd($datas);
    }
}
