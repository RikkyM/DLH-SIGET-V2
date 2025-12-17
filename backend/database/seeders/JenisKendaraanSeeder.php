<?php

namespace Database\Seeders;

use App\Models\JenisKendaraan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenisKendaraanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenis = [
            'ARM ROLL',
            'BULLDOZER',
            'COMPACTOR',
            'CRANE',
            'DUMP',
            'EXCAVATOR',
            'FORKLFIT',
            'LAVATORY',
            'MOTOR RODA TIGA',
            'PICK UP',
            'STREET SWEEPER',
            'TANGKI',
            'TRONTON',
            'BACKHOE LOADER',
            'TOW (DEREK)'
        ];

        foreach ($jenis as $kendaraan) {
            JenisKendaraan::create(['nama' => $kendaraan]);
        }
    }
}
