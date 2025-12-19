<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DataKendaraan;
use App\Models\Department;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\TitikSampah;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $excludedDept = ['Our Company', 'SEKRETARIAT', 'NON AKTIF'];

        $total_petugas = Petugas::whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept))
            ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
            ->count();

        $total_kendaraan = DataKendaraan::count();
        $total_tps       = TitikSampah::count();
        $total_uptd      = Department::count();

        // master penugasan (header)
        $penugasanList = Penugasan::select('id', 'nama')->orderBy('nama')->get();

        // UPTD list
        $uptdList = Department::select('id', 'nama')
            ->whereNotIn('nama', $excludedDept)
            ->orderBy('nama')
            ->get();

        /**
         * Ambil agregasi: total petugas per (department, penugasan)
         * hasil contoh:
         * [
         *   dept_id => [ penugasan_id => total ],
         *   ...
         * ]
         */
        $matrix = Petugas::query()
            ->select('id_department', 'id_penugasan', DB::raw('COUNT(*) as total'))
            ->whereHas('department', fn($q) => $q->whereNotIn('nama', $excludedDept))
            ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
            ->whereNotNull('id_department')
            ->whereNotNull('id_penugasan')
            ->groupBy('id_department', 'id_penugasan')
            ->get()
            ->groupBy('id_department')
            ->map(fn($items) => $items->pluck('total', 'id_penugasan')); // [penugasan_id => total]

        // Susun rows per UPTD
        $rows = $uptdList->map(function ($uptd) use ($penugasanList, $matrix) {
            $counts = [];
            $deptMap = $matrix->get($uptd->id, collect()); // [penugasan_id => total]

            foreach ($penugasanList as $p) {
                // "total penugasan X pada department ini"
                $counts[$p->nama] = (int) ($deptMap[$p->id] ?? 0);
            }

            return [
                'uptd_id'   => $uptd->id,
                'uptd_nama' => $uptd->nama,
                'total'     => (int) $deptMap->sum(), // total semua penugasan dalam dept tsb
                'counts'    => $counts,
            ];
        });

        return response()->json([
            'total_petugas'   => $total_petugas,
            'total_kendaraan' => $total_kendaraan,
            'total_tps'       => $total_tps,
            'total_uptd'      => $total_uptd,
            'penugasan_headers' => $penugasanList->pluck('nama'),
            'rows'              => $rows,
        ]);
    }
}
