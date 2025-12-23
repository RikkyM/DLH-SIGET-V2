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

    public function tahunPembuatan()
    {
        $years = DataKendaraan::query()
            ->whereNotNull('tahun_pembuatan')
            ->where('tahun_pembuatan', '!=', '')
            ->select('tahun_pembuatan')
            ->distinct()
            ->orderBy('tahun_pembuatan', 'desc')
            ->pluck('tahun_pembuatan');

        return response()->json([
            'years' => $years
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25);
        $department = (int) $request->input('unit_kerja');
        $jenisKendaraan = (int) $request->input('jenis_kendaraan');
        $tahunPembuatan = (int) $request->input('tahun');
        $perPage = max(1, min($perPage, 200));

        $kendaraan = DataKendaraan::query()
            ->with('jenisKendaraan')
            ->when($search, function ($q) use ($search) {
                $q->whereAny(['no_plat', 'nama_sopir', 'lambung_baru', 'no_rangka', 'no_mesin', 'no_stnk'],  'like', "%{$search}%");
            })
            ->when(!empty($department), fn($data) => $data->where('id_department', $department))
            ->when(!empty($jenisKendaraan), fn($data) => $data->where('id_jenis', $jenisKendaraan))
            ->when(!empty($tahunPembuatan), fn($data) => $data->where('tahun_pembuatan', $tahunPembuatan))
            ->orderBy('merk', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(
            [
                'data' => $kendaraan->items(),
                'meta' => [
                    'current_page' => $kendaraan->currentPage(),
                    'per_page'     => $kendaraan->perPage(),
                    'last_page'    => $kendaraan->lastPage(),
                    'total'        => $kendaraan->total(),
                    'from'         => $kendaraan->firstItem(),
                    'to'           => $kendaraan->lastItem(),
                ]
            ]
        );
    }
}
