<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Petugas;
use Illuminate\Http\Request;

class PetugasController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $petugas = Petugas::with('penugasan', 'department')->whereHas('department', function ($data) {
            $data->whereNotIn('nama', ['Our Company', 'SEKRETARIAT', 'NON AKTIF']);
        })
            
            ->where(fn($q) => $q->whereNotNull('nama')->where('nama', '!=', '')->where('nama', 'not like', '%admin%'))
            ->when($search, fn($q) => $q->where('nama', 'like', "%{$search}%"))
            ->orderBy('nama', 'asc')
            ->get();

        return response()->json(
            [
                'data' => $petugas
            ]
        );
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
