<?php

namespace App\Http\Controllers;

use App\Models\DataKendaraan;
use Illuminate\Http\Request;

class KendaraanController extends Controller
{
    public function filterLambung(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $lambung =  DataKendaraan::query()
            ->with(['titikSampah' => fn($q) => $q->whereNotNull('latitude')
                ->whereNotNull('longitude')->where('latitude', '!=', '')->where('longitude', '!=', '')])
            ->select('id', 'no_plat', 'lambung')
            ->when($q, fn($qq) => $qq->where('no_plat', 'like', "%{$q}%"))
            ->orderBy('no_plat')
            ->get()
            ->map(fn($d) => ['value' => (string) $d->no_plat, 'label' => $d->no_plat, 'count' => $d->titikSampah->count()])
            ->values();

        return response()->json([
            'lambung' => $lambung
        ]);
    }
}
