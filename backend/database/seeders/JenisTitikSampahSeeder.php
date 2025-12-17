<?php

namespace Database\Seeders;

use App\Models\JenisTitikSampah;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenisTitikSampahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenis = [
            'TPS3R',
            'TPS',
            'Sampah Liar',
            'Depo Sampah',
            'WR',
            'Bank Sampah'
        ];

        foreach ($jenis as $jts) {
            JenisTitikSampah::create(['nama' => $jts]);
        }
    }
}
