<?php

namespace App\Http\Controllers;

use App\Models\JenisTitikSampah;
use Illuminate\Http\Request;

class JTSController extends Controller
{
    public function filterPenampungan(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $jts =  JenisTitikSampah::query()
            ->with(['titikSampah' => fn($q) => $q->whereNotNull('latitude')
                ->whereNotNull('longitude')->where('latitude', '!=', '')->where('longitude', '!=', '')])
            ->select('id', 'nama')
            ->when($q, fn($qq) => $qq->where('nama', 'like', "%{$q}%"))
            ->orderBy('nama')
            ->get()
            ->map(fn($d) => ['value' => (string) $d->id, 'label' => $d->nama, 'count' => $d->titikSampah->count()])
            ->values();

        return response()->json([
            'penampungan' => $jts
        ]);
    }
}
