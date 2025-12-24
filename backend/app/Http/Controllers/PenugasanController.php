<?php

namespace App\Http\Controllers;

use App\Models\Penugasan;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class PenugasanController extends Controller
{
    public function filterPenugasan(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $departmentIds = Arr::wrap($request->query('department', []));
        $departmentIds = array_values(array_map('intval', array_filter($departmentIds, fn($v) => $v !== null && $v !== '')));

        $items = Penugasan::query()
            ->select('id', 'nama')
            ->with(['petugas' => function ($q) use ($departmentIds) {
                $q->whereNotNull('latitude')->whereNotNull('longitude')
                    ->where('latitude', '!=', '')->where('longitude', '!=', '')
                    ->when(!empty($departmentIds), fn($qq) => $qq->whereIn('id_department', $departmentIds));
            }])
            // ->withCount([
            //     'petugas as count' => function ($q) use ($departmentIds) {
            //         $q->when(!empty($departmentIds), fn($qq) => $qq->whereIn('id_department', $departmentIds));
            //     }
            // ])
            ->orderBy('nama')
            ->get()
            ->map(fn($p) => [
                'value' => (string) $p->id,
                'label' => $p->nama,
                'count' => (int) $p->petugas->count(),
            ]);

        if (!empty($departmentIds)) {
            $items = $items->filter(fn($x) => $x['count'] > 0)->values();
        }

        return response()->json(['penugasan' => $items]);
    }

    public function getPenugasan()
    {
        $penugasan = Penugasan::query()
            ->select('id', 'nama')
            ->orderBy('nama')
            ->get();

        return response()->json([
            'penugasan' => $penugasan
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25);
        $perPage = max(1, min($perPage, 200));

        $penugasan = Penugasan::query()
            ->when($search, fn($q) => $q->where('nama', 'like', "%{$search}%"))
            ->orderBy('nama', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(
            [
                'data' => $penugasan->items(),
                'meta' => [
                    'current_page' => $penugasan->currentPage(),
                    'per_page'     => $penugasan->perPage(),
                    'last_page'    => $penugasan->lastPage(),
                    'total'        => $penugasan->total(),
                    'from'         => $penugasan->firstItem(),
                    'to'           => $penugasan->lastItem(),
                ]
            ]
        );
    }

    public function updatePenugasan(Request $request, $id)
    {
        $penugasan = Penugasan::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:50',
            'icon' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048|'
        ]);

        if ($request->filled('nama')) {
            $penugasan->nama = $validated['nama'];
        }

        if ($request->hasFile('icon')) {
            $file = $request->file('icon');

            if ($penugasan->icon) {
                Storage::disk('local')->delete($penugasan->icon);
            }

            $maxSize = 96;

            $img = Image::read($file->getRealPath())
                ->cover($maxSize, $maxSize);

            $fileName = Str::uuid()->toString() . '.webp';
            $path = "penugasan/{$fileName}";

            Storage::disk('local')->put($path, (string) $img->toWebp(80));

            $penugasan->icon = $path;
        }

        $penugasan->save();

        return response()->json([
            'message' => 'Penugasan berhasil diupdate.',
            'data' => $penugasan,
        ]);
    }
}
