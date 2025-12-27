<?php

namespace App\Http\Controllers;

use App\Http\Requests\KendaraanRequest;
use App\Models\DataKendaraan;
use App\Models\Department;
use App\Models\Petugas;
use App\Models\TitikSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use RuntimeException;

class KendaraanController extends Controller
{
    private function fotoField(): array
    {
        return ['foto_depan', 'foto_belakang', 'foto_kanan', 'foto_kiri'];
    }

    public function filterLambung(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $departmentIds = Arr::wrap($request->query('department', []));
        $departmentIds = array_values(array_map('intval', array_filter($departmentIds, fn($v) => $v !== null && $v !== '')));

        // $lambung =  DataKendaraan::query()
        //     ->with(['titikSampah' => fn($q) => $q->whereNotNull('latitude')
        //         ->whereNotNull('longitude')->where('latitude', '!=', '')->where('longitude', '!=', '')])
        //     ->select('id', 'no_plat', 'lambung_baru')
        //     ->when($q, function ($qq) use ($q) {
        //         $qq->where('no_plat', 'like', "%{$q}%")
        //             ->orWhere('lambung_baru', 'like', "%{$q}%");
        //     })
        //     ->orderBy('no_plat')
        //     ->get()
        //     ->map(fn($d) => ['value' => (string) $d->no_plat, 'label' => $d->no_plat, 'count' => $d->titikSampah->count(), 'lambung' => $d->lambung_baru ?? null])
        //     ->values();

        $titikSampah = DataKendaraan::query()
            ->with(['titikSampah' => fn($q) =>
            $q->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->where('latitude', '!=', '')
                ->where('longitude', '!=', '')])
            ->select('id', 'no_plat', 'lambung_baru')
            ->when(!Auth::user(), function ($data) {
                $data->whereHas('titikSampah.jenisTitikSampah', function ($d) {
                    $d->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
                });
            })
            ->when(Auth::user() && !in_array(Auth::user()->role, ['superadmin', 'admin']), function ($data) {
                $data->whereHas('titikSampah.jenisTitikSampah', function ($d) {
                    $d->whereNotIn('nama', ['WR', 'SAMPAH LIAR']);
                });
            })
            ->when(!empty($departmentIds), function ($q) use ($departmentIds) {
                $q->whereHas('titikSampah', fn($ts) => $ts->whereIn('id_department', $departmentIds));
            })
            // ->when(!empty($departmentIds), fn($q) => $q->whereIn('id_department', $departmentIds))
            ->orderBy('id')
            ->get()
            ->map(fn($d) => ['value' => (string) $d->no_plat, 'label' => $d->no_plat, 'count' => $d->titikSampah->count(), 'lambung' => $d->lambung_baru ?? null])
            ->values();

        return response()->json([
            'lambung' => $titikSampah
        ]);
    }

    public function tahunPembuatan()
    {
        $years = DataKendaraan::query()
            ->whereNotNull('tahun_pembuatan')
            ->where('tahun_pembuatan', '!=', '')
            ->select('tahun_pembuatan')
            ->distinct()
            ->orderBy('tahun_pembuatan', 'desc')
            ->pluck('tahun_pembuatan');

        return response()->json([
            'years' => $years
        ]);
    }

    public function filterKendaraan()
    {
        $kendaraan = DataKendaraan::query()
            ->select('id', 'no_plat', 'merk')
            ->orderBy('merk')
            ->get();

        return response()->json([
            'kendaraan' => $kendaraan
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25);
        $department = (int) $request->input('unit_kerja');
        $jenisKendaraan = (int) $request->input('jenis_kendaraan');
        $tahunPembuatan = (int) $request->input('tahun');
        $perPage = max(1, min($perPage, 200));

        $kendaraan = DataKendaraan::query()
            ->with('jenisKendaraan')
            ->when($search, function ($q) use ($search) {
                $q->whereAny(['no_plat', 'nama_sopir', 'lambung_baru', 'no_rangka', 'no_mesin', 'no_stnk'],  'like', "%{$search}%");
            })
            ->when(!empty($department), fn($data) => $data->where('id_department', $department))
            ->when(!empty($jenisKendaraan), fn($data) => $data->where('id_jenis', $jenisKendaraan))
            ->when(!empty($tahunPembuatan), fn($data) => $data->where('tahun_pembuatan', $tahunPembuatan))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(
            [
                'data' => $kendaraan->items(),
                'meta' => [
                    'current_page' => $kendaraan->currentPage(),
                    'per_page'     => $kendaraan->perPage(),
                    'last_page'    => $kendaraan->lastPage(),
                    'total'        => $kendaraan->total(),
                    'from'         => $kendaraan->firstItem(),
                    'to'           => $kendaraan->lastItem(),
                ]
            ]
        );
    }

    public function storeKendaraan(KendaraanRequest $request)
    {
        $payload = $request->validated();

        $getNoPlat = $payload['no_plat'];
        $noPlat  = str_replace(' ', '', $getNoPlat);
        $getLambung = $payload['lambung_baru'];
        $lambung = str_replace(' ', '', $getLambung);
        $department = str_replace(' ', '', Department::whereKey($payload['id_department'])->value('nama'));

        $paths = [];
        $storedPaths = [];

        DB::beginTransaction();

        try {
            foreach ($this->fotoField() as $field) {
                if (!$request->hasFile($field)) continue;

                $file = $request->file($field);

                if (!$file || !$file->isValid()) {
                    throw new RuntimeException("Upload file '$field' tidak valid.");
                }

                $side = str_replace('foto_', '', $field);

                $fileName = "{$noPlat}_{$lambung}_{$department}_{$side}." . $file->getClientOriginalExtension();

                $dir = $file->storeAs('kendaraan', $fileName, 'local');
                $paths[$field] = $dir;
                $storedPaths[] = $dir;
            }

            $payload['foto_kendaraan'] = $paths;

            if (!empty($payload['id_petugas'])) {
                $payload['nama_sopir'] = Petugas::whereKey($payload['id_petugas'])->value('nama');
            }

            if (!empty($payload['id_department'])) {
                $payload['uptd'] = Department::whereKey($payload['id_department'])->value('nama');
            }

            DataKendaraan::create($payload);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Berhasil menambahkan data kendaraan.'
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();

            if (!empty($storedPaths)) {
                foreach ($storedPaths as $p) {
                    try {
                        Storage::disk('local')->delete($p);
                    } catch (\Throwable $ignore) {
                    }
                }

                report($e);

                return response()->json([
                    'status' => false,
                    'message' => 'Gagal menambahkan data kendaraan.',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
    }

    public function updateKendaraan(KendaraanRequest $request, $id)
    {
        $data = DataKendaraan::with('department')->findOrFail($id);

        $payload = $request->validated();

        $paths = $data->foto_kendaraan ?? [];

        $getNoPlat = $payload['no_plat'] ?? $data->no_plat;
        $noPlat  = str_replace(' ', '', $getNoPlat);
        $getLambung = $payload['lambung_baru'] ?? $data->lambung_baru;
        $lambung = str_replace(' ', '', $getLambung);
        $department = str_replace(' ', '', $data->department->nama);

        // $fotoFields = ['foto_depan', 'foto_belakang', 'foto_kanan', 'foto_kiri'];

        foreach ($this->fotoField() as $field) {
            if ($request->hasFile($field)) {
                if (!empty($paths[$field])) {
                    Storage::disk('local')->delete($paths[$field]);
                }

                $file = $request->file($field);

                $side = str_replace('foto_', '', $field);

                $fileName = "{$noPlat}_{$lambung}_{$department}_{$side}." . $file->getClientOriginalExtension();

                $dir = $file->storeAs('kendaraan', $fileName, 'local');
                $paths[$field] = $dir;
            }
        }

        $payload['foto_kendaraan'] = $paths;

        if (!empty($payload['id_petugas'])) {
            $payload['nama_sopir'] = Petugas::whereKey($payload['id_petugas'])->value('nama');
        }

        if (!empty($payload['id_department'])) {
            $payload['uptd'] = Department::whereKey($payload['id_department'])->value('nama');
        }

        $data->update($payload);

        return response()->json([
            'status' => true,
            'message' => 'Data kendaraan berhasil diupdate.'
        ], 200);
    }
}
