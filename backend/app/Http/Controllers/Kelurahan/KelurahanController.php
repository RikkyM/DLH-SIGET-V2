<?php

namespace App\Http\Controllers\Kelurahan;

use App\Http\Controllers\Controller;
use App\Models\Kelurahan;
use Illuminate\Http\Request;

class KelurahanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25);
        $perPage = max(1, min($perPage, 200));

        $kelurahan = Kelurahan::query()
            ->select('kelurahan.*')
            ->join('kecamatan', 'kecamatan.id', '=', 'kelurahan.id_kecamatan')
            ->with('kecamatan')
            ->when(!empty($search), fn($q) => $q->where('kelurahan.nama_kelurahan', 'like', "%{$search}%"))
            ->orderBy('kecamatan.nama_kecamatan')
            ->orderBy('kelurahan.nama_kelurahan')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(
            [
                'data' => $kelurahan->items(),
                'meta' => [
                    'current_page' => $kelurahan->currentPage(),
                    'per_page'     => $kelurahan->perPage(),
                    'last_page'    => $kelurahan->lastPage(),
                    'total'        => $kelurahan->total(),
                    'from'         => $kelurahan->firstItem(),
                    'to'           => $kelurahan->lastItem(),
                ]
            ]
        );
    }
}
