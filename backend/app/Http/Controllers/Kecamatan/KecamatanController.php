<?php

namespace App\Http\Controllers\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use Illuminate\Http\Request;

class KecamatanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25);
        $perPage = max(1, min($perPage, 200));

        $kecamatan = Kecamatan::query()
            ->when(!empty($search), fn($q) => $q->where('nama_kecamatan', 'like', "%{$search}%"))
            ->orderBy('nama_kecamatan')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(
                [
                    'data' => $kecamatan->items(),
                    'meta' => [
                        'current_page' => $kecamatan->currentPage(),
                        'per_page'     => $kecamatan->perPage(),
                        'last_page'    => $kecamatan->lastPage(),
                        'total'        => $kecamatan->total(),
                        'from'         => $kecamatan->firstItem(),
                        'to'           => $kecamatan->lastItem(),
                    ]
                ]
            );
    }

    public function filterKecamatan()
    {
        $kecamatan = Kecamatan::query()
            ->select('id', 'nama_kecamatan')
            ->orderBy('nama_kecamatan')
            ->get();

        return response()->json([
            'kecamatan' => $kecamatan
        ]);
    }
}
