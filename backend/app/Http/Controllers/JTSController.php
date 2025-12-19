<?php

namespace App\Http\Controllers;

use App\Models\JenisTitikSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

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
}
