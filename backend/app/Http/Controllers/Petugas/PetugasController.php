<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Petugas;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PetugasController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $perPage = (int) $request->input('per_page', 25);
        $unitKerja = (int) $request->input('unit_kerja');
        $penugasan = (int) $request->input('penugasan');
        $perPage = max(1, min($perPage, 200));

        $petugas = Petugas::with('penugasan', 'department')->whereHas('department', function ($data) {
            $data->whereNotIn('nama', ['Our Company', 'SEKRETARIAT', 'NON AKTIF']);
        })
            ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
            ->when($search, fn($q) => $q->where('nama', 'like', "%{$search}%"))
            ->when(!empty($unitKerja), fn($q) => $q->where('id_department', $unitKerja))
            ->when(!empty($penugasan), fn($q) => $q->where('id_penugasan', $penugasan))
            ->orderBy('nama', 'asc')
            ->paginate($perPage)
            ->withQueryString();
        // ->get();

        $petugas->setCollection(
            $petugas->getCollection()->map(function ($p) {
                $p->usia = $p->tanggal_lahir ? Carbon::parse($p->tanggal_lahir)->age : null;
                return $p;
            })
        );

        return response()->json(
            [
                'data' => $petugas->items(),
                'meta' => [
                    'current_page' => $petugas->currentPage(),
                    'per_page'     => $petugas->perPage(),
                    'last_page'    => $petugas->lastPage(),
                    'total'        => $petugas->total(),
                    'from'         => $petugas->firstItem(),
                    'to'           => $petugas->lastItem(),
                ]
            ]
        );
    }

    public function getPetugas(Request $request)
    {
        $petugas = Petugas::query()
            ->select('id', 'nama')
            ->where(function ($data) {
                $data->where('nama', '!=', '')
                    ->whereNotNull('nama')
                    ->where('nama', 'not like', "%admin%");
            })
            ->whereHas('department', function ($q) {
                $q->whereNotIn('nama', ['Our Company', 'NON AKTIF', 'SEKRETARIAT']);
            })
            ->whereHas('penugasan', function ($q) {
                $q->whereLike('nama', "%sopir%");
            })
            ->orderBy('nama')
            ->get()
            ->values();

        return response()->json([
            'petugas' => $petugas
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => ['nullable', 'string', 'max:255'],
            'rute_kerja' => 'nullable|max:255',
            'status' => ['nullable', 'in:aktif,tidak aktif'],
        ]);

        $petugas = Petugas::find($id);

        if (!$petugas) {
            return response()->json(['message' => 'Petugas tidak ditemukan'], 404);
        }

        $petugas->update($validated);

        return response()->json([
            'message' => 'success',
            'data' => $petugas
        ]);
    }
}
