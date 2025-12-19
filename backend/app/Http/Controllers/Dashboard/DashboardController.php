<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DataKendaraan;
use App\Models\Department;
use App\Models\JenisKendaraan;
use App\Models\JenisTitikSampah;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\TitikSampah;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // public function index()
    // {
    //     $excludedDept = ['Our Company', 'SEKRETARIAT', 'NON AKTIF'];

    //     $total_petugas = Petugas::whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept))
    //         ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
    //         ->count();

    //     $total_kendaraan = DataKendaraan::count();
    //     $total_tps       = TitikSampah::count();
    //     $total_uptd      = Department::count();

    //     // master penugasan (header)
    //     $penugasanList = Penugasan::select('id', 'nama')->orderBy('nama')->get();

    //     // UPTD list
    //     $uptdList = Department::select('id', 'nama')
    //         ->whereNotIn('nama', $excludedDept)
    //         ->orderBy('nama')
    //         ->get();

    //     /**
    //      * Ambil agregasi: total petugas per (department, penugasan)
    //      * hasil contoh:
    //      * [
    //      *   dept_id => [ penugasan_id => total ],
    //      *   ...
    //      * ]
    //      */
    //     $matrix = Petugas::query()
    //         ->select('id_department', 'id_penugasan', DB::raw('COUNT(*) as total'))
    //         ->whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept))
    //         ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
    //         ->whereNotNull('id_department')
    //         ->whereNotNull('id_penugasan')
    //         ->groupBy('id_department', 'id_penugasan')
    //         ->get()
    //         ->groupBy('id_department')
    //         ->map(fn($items) => $items->pluck('total', 'id_penugasan')); // [penugasan_id => total]

    //     // Susun rows per UPTD
    //     $rows = $uptdList->map(function ($uptd) use ($penugasanList, $matrix) {
    //         $counts = [];
    //         $deptMap = $matrix->get($uptd->id, collect()); // [penugasan_id => total]

    //         foreach ($penugasanList as $p) {
    //             // "total penugasan X pada department ini"
    //             $counts[$p->nama] = (int) ($deptMap[$p->id] ?? 0);
    //         }

    //         return [
    //             'uptd_id'   => $uptd->id,
    //             'uptd_nama' => $uptd->nama,
    //             'total'     => (int) $deptMap->sum(), // total semua penugasan dalam dept tsb
    //             'counts'    => $counts,
    //         ];
    //     });

    //     return response()->json([
    //         'total_petugas'   => $total_petugas,
    //         'total_kendaraan' => $total_kendaraan,
    //         'total_tps'       => $total_tps,
    //         'total_uptd'      => $total_uptd,
    //         'penugasan_headers' => $penugasanList->pluck('nama'),
    //         'rows'              => $rows,
    //     ]);
    // }

    public function index()
    {
        $excludedDept = ['Our Company', 'SEKRETARIAT', 'NON AKTIF'];

        $total_petugas = Petugas::whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept))
            ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
            ->count();

        $total_kendaraan = DataKendaraan::count();
        $total_tps       = TitikSampah::count();
        $total_uptd      = Department::count();

        // Header penugasan
        $penugasanList = Penugasan::select('id', 'nama')->orderBy('nama')->get();

        // Header jenis titik sampah
        $jenisTpsList = JenisTitikSampah::select('id', 'nama')->orderBy('nama')->get(); // sesuaikan field "nama"

        // UPTD list
        $uptdList = Department::select('id', 'nama')
            ->whereNotIn('nama', $excludedDept)
            ->orderBy('nama')
            ->get();

        $jenisKendaraanList = JenisKendaraan::select('id', 'nama')->orderBy('nama')->get();

        // MATRIX: petugas per (department, penugasan)
        $matrixPetugas = Petugas::query()
            ->select('id_department', 'id_penugasan', DB::raw('COUNT(*) as total'))
            ->whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept))
            ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
            ->whereNotNull('id_department')
            ->whereNotNull('id_penugasan')
            ->groupBy('id_department', 'id_penugasan')
            ->get()
            ->groupBy('id_department')
            ->map(fn($items) => $items->pluck('total', 'id_penugasan')); // [penugasan_id => total]

        // MATRIX: titik sampah per (department, jenis_tps)
        $matrixTps = TitikSampah::query()
            ->select('id_department', 'id_jts', DB::raw('COUNT(*) as total')) // <-- pastikan FK jenis = id_jts
            ->whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept)) // kalau TitikSampah punya relasi department
            ->whereNotNull('id_department')
            ->whereNotNull('id_jts')
            ->groupBy('id_department', 'id_jts')
            ->get()
            ->groupBy('id_department')
            ->map(fn($items) => $items->pluck('total', 'id_jts')); // [jenis_id => total]

        $matrixKendaraan = DataKendaraan::query()
            ->select('id_department', 'id_jenis', DB::raw('COUNT(*) as total')) // <-- pastikan FK jenis = id_jts
            ->whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept)) // kalau TitikSampah punya relasi department
            ->whereNotNull('id_department')
            ->groupBy('id_department', 'id_jenis')
            ->get()
            ->groupBy('id_department')
            ->map(fn($items) => $items->pluck('total', 'id_jenis')); // [jenis_id => total]

        // Susun rows per UPTD (gabung 2 counts)
        $rows = $uptdList->map(function ($uptd) use ($penugasanList, $jenisTpsList, $jenisKendaraanList, $matrixPetugas, $matrixTps, $matrixKendaraan) {
            $deptPenugasanMap = $matrixPetugas->get($uptd->id, collect()); // [penugasan_id => total]
            $deptJenisTpsMap  = $matrixTps->get($uptd->id, collect());     // [jenis_id => total]
            $deptKendaraanMap = $matrixKendaraan->get($uptd->id, collect());

            $countsPenugasan = [];
            foreach ($penugasanList as $p) {
                $countsPenugasan[$p->nama] = (int) ($deptPenugasanMap[$p->id] ?? 0);
            }

            $countsJenisTps = [];
            foreach ($jenisTpsList as $j) {
                $countsJenisTps[$j->nama] = (int) ($deptJenisTpsMap[$j->id] ?? 0);
            }

            $countsJenisKendaraan = [];
            foreach ($jenisKendaraanList as $jk) {
                $countsJenisKendaraan[$jk->nama] = (int) ($deptKendaraanMap[$jk->id] ?? 0);
            }

            return [
                'uptd_id'   => $uptd->id,
                'uptd_nama' => $uptd->nama,

                'petugas_total' => (int) $deptPenugasanMap->sum(),
                'petugas_counts' => $countsPenugasan,

                'tps_total' => (int) $deptJenisTpsMap->sum(),
                'tps_counts' => $countsJenisTps,

                'kendaraan_total'   => (int) $deptKendaraanMap->sum(),
                'kendaraan_counts'  => $countsJenisKendaraan,
            ];
        });

        return response()->json([
            'total_petugas'   => $total_petugas,
            'total_kendaraan' => $total_kendaraan,
            'total_tps'       => $total_tps,
            'total_uptd'      => $total_uptd,

            'penugasan_headers' => $penugasanList->pluck('nama'),
            'jenis_tps_headers' => $jenisTpsList->pluck('nama'),
            'jenis_kendaraan_headers' => $jenisKendaraanList->pluck('nama'),

            'rows' => $rows,
        ]);
    }
}
