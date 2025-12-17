<?php

namespace App\Http\Controllers;

use App\Models\Penugasan;
use Illuminate\Http\Request;

class PenugasanController extends Controller
{
    public function filterPenugasan(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        // $departments =  Department::query()
        //     ->select('id', 'nama')
        //     ->when($q, fn($qq) => $qq->where('nama', 'like', "%{$q}%"))
        //     ->orderBy('nama')
        //     ->get()
        //     ->map(fn($d) => ['value' => (string) $d->id, 'label' => $d->nama]);

        $penugasan = Penugasan::query()
            ->with(['petugas' => fn($q) => $q->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->where('latitude', '!=', '')
                ->where('longitude', '!=', '')])
            ->select('id', 'nama')
            ->when($q, fn($qq) => $qq->where('nama', 'like', "%{$q}%"))
            ->orderBy('nama')
            ->get()
            ->map(fn($d) => ['value' => (string) $d->id, 'label' => $d->nama, 'count' => $d->petugas->count()]);

        // dd($penugasan);

        return response()->json([
            // 'departments' => $departments,
            'penugasan' => $penugasan,
            // 'jenis_titik_sampah' => $jenisTitikSampah,
        ]);
    }
}
