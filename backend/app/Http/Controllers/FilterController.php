<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\TitikSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class FilterController extends Controller
{
    // public function homepage(Request $request)
    // {
    //     // $departmentIds = $request->query('department', []); // ?department[]=1
    //     // $penugasanIds  = $request->query('penugasan', []);  // ?penugasan[]=2

    //     // // $data = Petugas::query()
    //     // //     ->select('id', 'nama', 'latitude', 'longitude', 'id_department', 'id_penugasan')
    //     // //     ->whereNotNull('latitude')
    //     // //     ->whereNotNull('longitude')
    //     // //     ->where('latitude', '!=', '')
    //     // //     ->where('longitude', '!=', '')
    //     // //     ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
    //     // //     ->when(!empty($penugasanIds), fn($q) => $q->whereIn('id_penugasan', $penugasanIds))
    //     // //     ->get();

    //     // // // dd($data);

    //     // // return response()->json([
    //     // //     'data' => $data,
    //     // // ]);

    //     // $titikSampah = TitikSampah::query()
    //     //     ->select('id', 'nama', 'latitude', 'longitude', 'id_department')
    //     //     ->whereNotNull('latitude')
    //     //     ->whereNotNull('longitude')
    //     //     ->where('latitude', '!=', '')
    //     //     ->where('longitude', '!=', '')
    //     //     ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
    //     //     ->get()
    //     //     ->map(fn($t) => [
    //     //         'id' => $t->id,
    //     //         'nama' => $t->nama,
    //     //         'latitude' => $t->latitude,
    //     //         'longitude' => $t->longitude,
    //     //         'type' => 'titik_sampah',
    //     //         'id_department' => $t->id_department,
    //     //         'id_penugasan' => null,
    //     //     ]);

    //     // // 2) Marker Petugas (filter by penugasan)
    //     // $petugas = Petugas::query()
    //     //     ->select('id', 'nama', 'latitude', 'longitude', 'id_department', 'id_penugasan')
    //     //     ->whereNotNull('latitude')
    //     //     ->whereNotNull('longitude')
    //     //     ->where('latitude', '!=', '')
    //     //     ->where('longitude', '!=', '')
    //     //     ->when(!empty($penugasanIds), fn($q) => $q->whereIn('id_penugasan', $penugasanIds))
    //     //     ->get()
    //     //     ->map(fn($p) => [
    //     //         'id' => $p->id,
    //     //         'nama' => $p->nama,
    //     //         'latitude' => $p->latitude,
    //     //         'longitude' => $p->longitude,
    //     //         'type' => 'petugas',
    //     //         'id_department' => $p->id_department,
    //     //         'id_penugasan' => $p->id_penugasan,
    //     //     ]);

    //     //     dd($titikSampah->concat($petugas)->values());

    //     // return response()->json([
    //     //     'data' => $titikSampah->concat($petugas)->values(),
    //     // ]);


    // }

    public function homepage(Request $request)
    {
        $departmentIds  = Arr::wrap($request->query('department', []));
        $penugasanIds   = Arr::wrap($request->query('penugasan', []));
        $penampunganIds = Arr::wrap($request->query('penampungan', []));
        $lambungIds     = Arr::wrap($request->query('lambung', []));

        // Bersihkan + cast ke int
        $departmentIds = array_values(array_map('intval', array_filter($departmentIds, fn($v) => $v !== null && $v !== '')));
        $penugasanIds  = array_values(array_map('intval', array_filter($penugasanIds, fn($v) => $v !== null && $v !== '')));
        $penampunganIds  = array_values(array_map('intval', array_filter($penampunganIds, fn($v) => $v !== null && $v !== '')));
        $lambungIds     = array_values(array_map(fn($v) => trim((string)$v), array_filter($lambungIds, fn($v) => $v !== null && $v !== '')));

        // $shouldLoadTitik = !empty($departmentIds) || !empty($penampunganIds) || !empty($lambungIds);
        // $shouldLoadPetugas = !empty($departmentIds) || !empty($penugasanIds);

        $hasDepartment  = !empty($departmentIds);
        $hasPenugasan   = !empty($penugasanIds);
        $hasPenampungan = !empty($penampunganIds);
        $hasLambung     = !empty($lambungIds);

        $showBoth = $hasDepartment && !$hasPenugasan && !$hasPenampungan && !$hasLambung;

        $shouldLoadPetugas = $hasPenugasan || $showBoth;
        $shouldLoadTitik   = $hasPenampungan || $hasLambung || $showBoth;


        $titikSampah = $shouldLoadTitik
            ? TitikSampah::query()
            ->with('jenisTitikSampah', 'jenisKendaraan', 'kendaraan')
            ->select('id', 'nama', 'nama_jalan', 'latitude', 'longitude', 'id_department', 'id_jts', 'id_jk', 'armada', 'rute_kerja', 'vol_sampah', 'kecamatan', 'kelurahan', 'no_lambung')
            ->whereNotNull('latitude')->whereNotNull('longitude')
            ->where('latitude', '!=', '')->where('longitude', '!=', '')
            // ->whereHas('jenisTitikSampah', function ($data) {
            //     $data->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
            // })
            ->when(!Auth::user(), function ($data) {
                $data->whereHas('jenisTitikSampah', fn($d) => $d->whereNotIn('nama', ['WR', 'SAMPAH LIAR']));
            })
            ->when(Auth::user() && !in_array(Auth::user()->role, ['superadmin', 'admin']), function ($data) {
                $data->whereHas('jenisTitikSampah', fn($d) => $d->whereNotIn('nama', ['WR', 'SAMPAH LIAR']));
            })
            ->when($hasDepartment, fn($q) => $q->whereIn('id_department', $departmentIds))
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
                'lambung' => $t->kendaraan?->lambung,
                'no_plat' => $t->kendaraan?->no_plat,
                'rute_kerja' => $t->rute_kerja,
                'nama_jalan' => $t->nama_jalan,
                'vol_sampah' => $t->vol_sampah,
                'panjang_jalur' => null,
                'kecamatan' => strtolower($t->kecamatan),
                'kelurahan' => strtolower($t->kelurahan),
                'jenis' => $t->jenisTitikSampah?->nama,
                'jenis_kendaraan' => $t->jenisKendaraan?->nama,
                'lambung' => $t->no_lambung ?? "-",
                'icon' => $t->jenisTitikSampah?->icon
                    ? url("/api/jenis-titik-sampah/{$t->id_jts}/icon")
                    : null,
            ])
            : collect();


        // Petugas hanya kalau penugasan dipilih
        $petugas = $shouldLoadPetugas
            ? Petugas::query()
            ->with('kendaraan.jenisKendaraan')
            ->select('id', 'nama', 'nama_jalan', 'latitude', 'longitude', 'id_department', 'id_penugasan', 'rute_kerja', 'panjang_jalur', 'nama_kecamatan', 'nama_kelurahan')
            ->whereNotNull('latitude')->whereNotNull('longitude')
            ->where('latitude', '!=', '')->where('longitude', '!=', '')
            ->when($hasDepartment, fn($q) => $q->whereIn('id_department', $departmentIds))
            ->when($hasPenugasan, fn($q) => $q->whereIn('id_penugasan', $penugasanIds))
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
                'panjang_jalur' => $p->panjang_jalur,
                'kecamatan' => strtolower($p->nama_kecamatan),
                'kelurahan' => $p->nama_kelurahan ? strtolower($p->nama_kelurahan) : "-",
                'jenis' => null,
                'jenis_kendaraan' => $p->jenisKendaraan?->nama,
                'icon' => $p->penugasan->icon
                    ? url("/api/penugasan/{$p->id_penugasan}/icon") . '?v=' . urlencode($p->penugasan->updated_at ?? "")
                    : null
            ])
            : collect();

        // dd($petugas);

        return response()->json([
            'data' => $titikSampah->concat($petugas)->values(),
            'debug' => compact('departmentIds', 'penugasanIds', 'penampunganIds', 'lambungIds'),
        ]);
    }
}
