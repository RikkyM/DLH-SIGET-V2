<?php

namespace App\Http\Controllers;

use App\Models\DataKendaraan;
use App\Models\TitikSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class KendaraanController extends Controller
{
    public function filterLambung(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $departmentIds = Arr::wrap($request->query('department', []));
        $departmentIds = array_values(array_map('intval', array_filter($departmentIds, fn($v) => $v !== null && $v !== '')));

        // $lambung =  DataKendaraan::query()
        //     ->with(['titikSampah' => fn($q) => $q->whereNotNull('latitude')
        //         ->whereNotNull('longitude')->where('latitude', '!=', '')->where('longitude', '!=', '')])
        //     ->select('id', 'no_plat', 'lambung_baru')
        //     ->when($q, function ($qq) use ($q) {
        //         $qq->where('no_plat', 'like', "%{$q}%")
        //             ->orWhere('lambung_baru', 'like', "%{$q}%");
        //     })
        //     ->orderBy('no_plat')
        //     ->get()
        //     ->map(fn($d) => ['value' => (string) $d->no_plat, 'label' => $d->no_plat, 'count' => $d->titikSampah->count(), 'lambung' => $d->lambung_baru ?? null])
        //     ->values();

        $titikSampah = DataKendaraan::query()
            ->with(['titikSampah' => fn($q) =>
            $q->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->where('latitude', '!=', '')
                ->where('longitude', '!=', '')])
            ->select('id', 'no_plat', 'lambung_baru')
            ->when(!Auth::user(), function ($data) {
                $data->whereHas('titikSampah.jenisTitikSampah', function ($d) {
                    $d->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
                });
            })
            ->when(Auth::user() && !in_array(Auth::user()->role, ['superadmin', 'admin']), function ($data) {
                $data->whereHas('titikSampah.jenisTitikSampah', function ($d) {
                    $d->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
                });
            })
            ->when(!empty($departmentIds), function ($q) use ($departmentIds) {
                $q->whereHas('titikSampah', fn($ts) => $ts->whereIn('id_department', $departmentIds));
            })
            // ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
            ->orderBy('id')
            ->get()
            ->map(fn($d) => ['value' => (string) $d->no_plat, 'label' => $d->no_plat, 'count' => $d->titikSampah->count(), 'lambung' => $d->lambung_baru ?? null])
            ->values();

        return response()->json([
            'lambung' => $titikSampah
        ]);
    }
}
