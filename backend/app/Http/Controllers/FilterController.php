<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\TitikSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class FilterController extends Controller
{
    public function homepage(Request $request)
    {
        // $departmentIds = $request->query('department', []); // ?department[]=1
        // $penugasanIds  = $request->query('penugasan', []);  // ?penugasan[]=2

        // // $data = Petugas::query()
        // //     ->select('id', 'nama', 'latitude', 'longitude', 'id_department', 'id_penugasan')
        // //     ->whereNotNull('latitude')
        // //     ->whereNotNull('longitude')
        // //     ->where('latitude', '!=', '')
        // //     ->where('longitude', '!=', '')
        // //     ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
        // //     ->when(!empty($penugasanIds), fn($q) => $q->whereIn('id_penugasan', $penugasanIds))
        // //     ->get();

        // // // dd($data);

        // // return response()->json([
        // //     'data' => $data,
        // // ]);

        // $titikSampah = TitikSampah::query()
        //     ->select('id', 'nama', 'latitude', 'longitude', 'id_department')
        //     ->whereNotNull('latitude')
        //     ->whereNotNull('longitude')
        //     ->where('latitude', '!=', '')
        //     ->where('longitude', '!=', '')
        //     ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
        //     ->get()
        //     ->map(fn($t) => [
        //         'id' => $t->id,
        //         'nama' => $t->nama,
        //         'latitude' => $t->latitude,
        //         'longitude' => $t->longitude,
        //         'type' => 'titik_sampah',
        //         'id_department' => $t->id_department,
        //         'id_penugasan' => null,
        //     ]);

        // // 2) Marker Petugas (filter by penugasan)
        // $petugas = Petugas::query()
        //     ->select('id', 'nama', 'latitude', 'longitude', 'id_department', 'id_penugasan')
        //     ->whereNotNull('latitude')
        //     ->whereNotNull('longitude')
        //     ->where('latitude', '!=', '')
        //     ->where('longitude', '!=', '')
        //     ->when(!empty($penugasanIds), fn($q) => $q->whereIn('id_penugasan', $penugasanIds))
        //     ->get()
        //     ->map(fn($p) => [
        //         'id' => $p->id,
        //         'nama' => $p->nama,
        //         'latitude' => $p->latitude,
        //         'longitude' => $p->longitude,
        //         'type' => 'petugas',
        //         'id_department' => $p->id_department,
        //         'id_penugasan' => $p->id_penugasan,
        //     ]);

        //     dd($titikSampah->concat($petugas)->values());

        // return response()->json([
        //     'data' => $titikSampah->concat($petugas)->values(),
        // ]);

        $departmentIds  = Arr::wrap($request->query('department', []));
        $penugasanIds   = Arr::wrap($request->query('penugasan', []));
        $penampunganIds = Arr::wrap($request->query('penampungan', []));
        $lambungIds     = Arr::wrap($request->query('lambung', []));

        // Bersihkan + cast ke int
        $departmentIds = array_values(array_map('intval', array_filter($departmentIds, fn($v) => $v !== null && $v !== '')));
        $penugasanIds  = array_values(array_map('intval', array_filter($penugasanIds, fn($v) => $v !== null && $v !== '')));
        $penampunganIds  = array_values(array_map('intval', array_filter($penampunganIds, fn($v) => $v !== null && $v !== '')));
        $lambungIds     = array_values(array_map(fn($v) => trim((string)$v), array_filter($lambungIds, fn($v) => $v !== null && $v !== '')));

        // Titik Sampah hanya kalau department dipilih
        $shouldLoadTitik = !empty($departmentIds) || !empty($penampunganIds) || !empty($lambungIds);

        $titikSampah = $shouldLoadTitik
            ? TitikSampah::query()
            ->select('id', 'nama', 'nama_jalan', 'latitude', 'longitude', 'id_department', 'id_jts', 'armada', 'rute_kerja', 'vol_sampah')
            ->whereNotNull('latitude')->whereNotNull('longitude')
            ->where('latitude', '!=', '')->where('longitude', '!=', '')
            ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
            ->when(!empty($penampunganIds), fn($q) => $q->whereIn('id_jts', $penampunganIds))
            ->when(!empty($lambungIds), fn($q) => $q->whereIn('armada', $lambungIds))
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'nama' => $t->nama,
                'latitude' => $t->latitude,
                'longitude' => $t->longitude,
                'type' => 'titik_sampah',
                'id_department' => $t->id_department,
                'id_penugasan' => null,
                'id_jts' => $t->id_jts,
                'armada' => $t->armada,
                'rute_kerja' => $t->rute_kerja,
                'nama_jalan' => $t->nama_jalan,
                'vol_sampah' => $t->vol_sampah,
                'panjang_jalur' => null,
            ])
            : collect();

        // Petugas hanya kalau penugasan dipilih
        $petugas = empty($penugasanIds)
            ? collect()
            : Petugas::query()
            ->select('id', 'nama', 'nama_jalan', 'latitude', 'longitude', 'id_department', 'id_penugasan', 'rute_kerja', 'panjang_jalur')
            ->whereNotNull('latitude')->whereNotNull('longitude')
            ->where(
                'latitude',
                '!=',
                ''
            )->where('longitude', '!=', '')
            ->whereIn('id_penugasan', $penugasanIds)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'nama' => $p->nama,
                'latitude' => $p->latitude,
                'longitude' => $p->longitude,
                'type' => 'petugas',
                'id_department' => $p->id_department,
                'id_penugasan' => $p->id_penugasan,
                'rute_kerja' => $p->rute_kerja,
                'nama_jalan' => $p->nama_jalan,
                'vol_sampah' => null,
                'panjang_jalur' => $p->panjang_jalur
            ]);

        return response()->json([
            'data' => $titikSampah->concat($petugas)->values(),
            // bantu debug kalau perlu:
            'debug' => compact('departmentIds', 'penugasanIds'),
        ]);
    }
}
