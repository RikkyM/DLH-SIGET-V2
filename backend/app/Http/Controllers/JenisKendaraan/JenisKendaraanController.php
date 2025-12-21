<?php

namespace App\Http\Controllers\JenisKendaraan;

use App\Http\Controllers\Controller;
use App\Models\JenisKendaraan;
use Illuminate\Http\Request;

class JenisKendaraanController extends Controller
{
    public function getJenisKendaraan(Request $request)
    {
        $jenisKendaraan = JenisKendaraan::query()
            ->select('id', 'nama')
            ->orderBy('nama')
            ->get()
            ->values();

        return response()->json([
            'jenis_kendaraan' => $jenisKendaraan
        ]);
    }
}
