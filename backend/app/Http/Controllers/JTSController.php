<?php

namespace App\Http\Controllers;

use App\Models\JenisTitikSampah;
use App\Models\TitikSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class JTSController extends Controller
{
    public function filterPenampungan(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $departmentIds = Arr::wrap($request->query('department', []));
        $departmentIds = array_values(array_map('intval', array_filter($departmentIds, fn($v) => $v !== null && $v !== '')));

        $items = JenisTitikSampah::query()
            ->select('id', 'nama')
            ->withCount([
                'titikSampah as count' => function ($q) use ($departmentIds) {
                    $q->when(!empty($departmentIds), fn($qq) => $qq->whereIn('id_department', $departmentIds));
                }
            ])
            ->when(!Auth::user(), function ($data) {
                $data->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
            })
            ->when(Auth::user() && !in_array(Auth::user()->role, ['superadmin', 'admin']), function ($data) {
                $data->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
            })
            ->orderBy('nama')
            ->get()
            ->map(fn($jts) => [
                'value' => (string) $jts->id,
                'label' => $jts->nama,
                'count' => (int) $jts->count,
            ]);

        if (!empty($departmentIds)) {
            $items = $items->filter(fn($x) => $x['count'] > 0)->values();
        }

        return response()->json(['penampungan' => $items]);
    }

    public function getJts(Request $request)
    {
        $jts = JenisTitikSampah::query()
            ->select('id', 'nama')
            ->orderBy('nama')
            ->get()
            ->values();

        return response()->json([
            'jts' => $jts
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');

        $perPage = (int) $request->input('per_page', 25);
        $unitKerja = (int) $request->input('unit_kerja');
        $jts = (int) $request->input('jenis_titik_sampah');
        $jenisKendaraan = (int) $request->input('jenis_kendaraan');
        $tnkb = (int) $request->input('tnkb');
        $lambung = (int) $request->input('lambung');
        $perPage = max(1, min($perPage, 200));

        $tps = TitikSampah::query()
            ->with('kendaraan', 'jenisTitikSampah', 'jenisKendaraan')
            ->when(!empty($search), function ($data) use ($search) {
                $data->where(function ($d) use ($search) {
                    $d->where('nama', 'like', "%{$search}%")
                        ->orWhere('nama_jalan', 'like', "%{$search}%");
                })
                    ->orWhereHas('kendaraan', function ($d) use ($search) {
                        $d->where('nama_sopir', 'like', "%{$search}%");
                    });
            })
            ->when(!empty($unitKerja), fn($q) => $q->where('id_department', $unitKerja))
            ->when(!empty($jts), fn($q) => $q->where('id_jts', $jts))
            ->when(!empty($jenisKendaraan), fn($q) => $q->where('id_jk', $jenisKendaraan))
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'data' => $tps->items(),
            'meta' => [
                'current_page' => $tps->currentPage(),
                'per_page'     => $tps->perPage(),
                'last_page'    => $tps->lastPage(),
                'total'        => $tps->total(),
                'from'         => $tps->firstItem(),
                'to'           => $tps->lastItem(),
            ]
        ]);
    }
}
