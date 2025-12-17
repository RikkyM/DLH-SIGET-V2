<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Penugasan;
use App\Models\Petugas;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    public function homepage(Request $request)
    {
        $departmentIds = $request->query('department', []); // ?department[]=1
        $penugasanIds  = $request->query('penugasan', []);  // ?penugasan[]=2

        $data = Petugas::query()
            ->select('id', 'nama', 'latitude', 'longitude', 'id_department', 'id_penugasan')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('latitude', '!=', '')
            ->where('longitude', '!=', '')
            ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
            ->when(!empty($penugasanIds), fn($q) => $q->whereIn('id_penugasan', $penugasanIds))
            ->get();

        return response()->json([
            'data' => $data,
        ]);
    }

    
}
