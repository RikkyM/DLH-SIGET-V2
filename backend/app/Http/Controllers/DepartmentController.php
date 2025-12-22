<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function filterDepartment(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $departments =  Department::query()
            ->with(['titikSampah' => fn($q) => $q->whereNotNull('latitude')
                ->whereNotNull('longitude')->where('latitude', '!=', '')->where('longitude', '!=', '')])
            ->select('id', 'nama')
            ->where(function ($q) {
                $q->where('nama', '!=', 'Our Company')
                    ->where('nama', '!=', 'NON AKTIF')
                    ->where('nama', '!=', 'SEKRETARIAT');
            })
            ->when($q, fn($qq) => $qq->where('nama', 'like', "%{$q}%"))
            ->orderBy('nama')
            ->get()
            ->map(fn($d) => ['value' => (string) $d->id, 'label' => $d->nama, 'count' => $d->titikSampah->count()])
            ->values();

        // dd($departments);

        // $penugasan = Penugasan::query()
        //     ->select('id', 'nama')
        //     ->when($q, fn($qq) => $qq->where('nama', 'like', "%{$q}%"))
        //     ->orderBy('nama')
        //     ->get()
        //     ->map(fn($d) => ['value' => (string) $d->id, 'label' => $d->nama]);

        return response()->json([
            'departments' => $departments,
            // 'penugasan' => $penugasan,
            // 'jenis_titik_sampah' => $jenisTitikSampah,
        ]);
    }

    public function getDepartment()
    {
        $departments =  Department::query()
            ->select('id', 'nama')
            ->whereNotIn('nama', ['Our Company', 'NON AKTIF', 'SEKRETARIAT'])
            ->orderBy('nama')
            ->get()
            ->values();

        return response()->json([
            'departments' => $departments
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25);
        $perPage = max(1, min($perPage, 200));

        $unitKerja = Department::query()
            ->whereNotIn('nama', ['NON AKTIF', 'Our Company'])
            ->when($search, fn($q) => $q->where('nama', 'like', "%{$search}%"))
            ->orderBy('nama', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(
            [
                'data' => $unitKerja->items(),
                'meta' => [
                    'current_page' => $unitKerja->currentPage(),
                    'per_page'     => $unitKerja->perPage(),
                    'last_page'    => $unitKerja->lastPage(),
                    'total'        => $unitKerja->total(),
                    'from'         => $unitKerja->firstItem(),
                    'to'           => $unitKerja->lastItem(),
                ]
            ]
        );
    }
}
