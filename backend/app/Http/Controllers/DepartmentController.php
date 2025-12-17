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
            ->select('id', 'nama')
            ->when($q, fn($qq) => $qq->where('nama', 'like', "%{$q}%"))
            ->orderBy('nama')
            ->get()
            ->map(fn($d) => ['value' => (string) $d->id, 'label' => $d->nama]);

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
}
