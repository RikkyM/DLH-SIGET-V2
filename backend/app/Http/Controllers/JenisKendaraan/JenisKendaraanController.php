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

    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25);
        $perPage = max(1, min($perPage, 200));

        $jenisKendaraan = JenisKendaraan::query()
            ->when(!empty($search), fn($q) => $q->where('nama', 'like', "%{$search}%"))
            ->orderBy('nama')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(
            [
                'data' => $jenisKendaraan->items(),
                'meta' => [
                    'current_page' => $jenisKendaraan->currentPage(),
                    'per_page'     => $jenisKendaraan->perPage(),
                    'last_page'    => $jenisKendaraan->lastPage(),
                    'total'        => $jenisKendaraan->total(),
                    'from'         => $jenisKendaraan->firstItem(),
                    'to'           => $jenisKendaraan->lastItem(),
                ]
            ]
        );
    }
}
