<?php

namespace App\Http\Controllers;

use App\Models\JenisTitikSampah;
use App\Models\TitikSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class JTSController extends Controller
{
    public function filterPenampungan(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $departmentIds = Arr::wrap($request->query('department', []));
        $departmentIds = array_values(array_map('intval', array_filter($departmentIds, fn($v) => $v !== null && $v !== '')));

        $items = JenisTitikSampah::query()
            ->select('id', 'nama')
            ->withCount([
                'titikSampah as count' => function ($q) use ($departmentIds) {
                    $q->when(!empty($departmentIds), fn($qq) => $qq->whereIn('id_department', $departmentIds));
                }
            ])
            ->when(!Auth::user(), function ($data) {
                $data->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
            })
            ->when(Auth::user() && !in_array(Auth::user()->role, ['superadmin', 'admin']), function ($data) {
                $data->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
            })
            ->orderBy('nama')
            ->get()
            ->map(fn($jts) => [
                'value' => (string) $jts->id,
                'label' => $jts->nama,
                'count' => (int) $jts->count,
            ]);

        if (!empty($departmentIds)) {
            $items = $items->filter(fn($x) => $x['count'] > 0)->values();
        }

        return response()->json(['penampungan' => $items]);
    }

    public function getJts(Request $request)
    {
        $jts = JenisTitikSampah::query()
            ->select('id', 'nama')
            ->orderBy('nama')
            ->get()
            ->values();

        return response()->json([
            'jts' => $jts
        ]);
    }

    public function tnkb()
    {
        $tnkb = TitikSampah::query()
            ->whereNotNull('armada')
            ->where('armada', '!=', '')
            ->select('armada')
            ->distinct()
            ->pluck('armada');

        return response()->json([
            'tnkb' => $tnkb
        ]);
    }

    public function lambung()
    {
        $lambung = TitikSampah::query()
            ->whereNotNull('no_lambung')
            ->where('no_lambung', '!=', '')
            ->select('no_lambung')
            ->distinct()
            ->pluck('no_lambung');

        return response()->json([
            'lambung' => $lambung
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');

        $perPage = (int) $request->input('per_page', 25);
        $unitKerja = (int) $request->input('unit_kerja');
        $jts = (int) $request->input('jenis_titik_sampah');
        $jenisKendaraan = (int) $request->input('jenis_kendaraan');
        $tnkb = $request->input('tnkb');
        $lambung = $request->input('lambung');
        $perPage = max(1, min($perPage, 200));

        $tps = TitikSampah::query()
            ->with('kendaraan', 'jenisTitikSampah', 'jenisKendaraan')
            ->when(!empty($search), function ($data) use ($search) {
                $data->where(function ($d) use ($search) {
                    $d->where('nama', 'like', "%{$search}%")
                        ->orWhere('nama_jalan', 'like', "%{$search}%");
                })
                    ->orWhereHas('kendaraan', function ($d) use ($search) {
                        $d->where('nama_sopir', 'like', "%{$search}%");
                    });
            })
            ->when(!empty($unitKerja), fn($q) => $q->where('id_department', $unitKerja))
            ->when(!empty($jts), fn($q) => $q->where('id_jts', $jts))
            ->when(!empty($jenisKendaraan), fn($q) => $q->where('id_jk', $jenisKendaraan))
            ->when(!empty($tnkb), fn($data) => $data->where('armada', $tnkb))
            ->when(!empty($lambung), fn($data) => $data->where('no_lambung', $lambung))
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'data' => $tps->items(),
            'meta' => [
                'current_page' => $tps->currentPage(),
                'per_page'     => $tps->perPage(),
                'last_page'    => $tps->lastPage(),
                'total'        => $tps->total(),
                'from'         => $tps->firstItem(),
                'to'           => $tps->lastItem(),
            ]
        ]);
    }

    public function updateTps(Request $request, $id)
    {
        try {
            $titikSampah = TitikSampah::findOrFail($id);
            // dd($request->all());
            return response()->json([$request->all()]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan pada server.'
            ], 500);
        }
    }

    public function masterJts(Request $request)
    {
        $search = $request->input('search');

        $perPage = (int) $request->input('per_page', 25);
        $perPage = max(1, min($perPage, 200));

        $jts = JenisTitikSampah::query()
            ->when(!empty($search), fn($data) => $data->where('nama', 'like', "%{$search}%"))
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'data' => $jts->items(),
            'meta' => [
                'current_page' => $jts->currentPage(),
                'per_page'     => $jts->perPage(),
                'last_page'    => $jts->lastPage(),
                'total'        => $jts->total(),
                'from'         => $jts->firstItem(),
                'to'           => $jts->lastItem(),
            ]
        ]);
    }

    public function updateMasterJts(Request $request, $id)
    {
        $jts = JenisTitikSampah::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:50',
            'icon' => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:2048|'
        ]);

        if ($request->filled('nama')) {
            $jts->nama = $validated['nama'];
        }

        if ($request->hasFile('icon')) {
            $file = $request->file('icon');

            if ($jts->icon) {
                Storage::disk('local')->delete($jts->icon);
            }

            $maxSize = 96;

            $img = Image::read($file->getRealPath())
                ->cover($maxSize, $maxSize);

            $fileName = Str::uuid()->toString() . '.webp';
            $path = "jenis-titik-sampah/{$fileName}";

            Storage::disk('local')->put($path, (string) $img->toWebp(80));

            $jts->icon = $path;
        }

        $jts->save();

        return response()->json([
            'message' => "Jenis titik sampah berhasil diupdate.",
            'data' => $jts
        ]);
    }
}
