<?php

namespace App\Http\Controllers;

use App\Models\DataKendaraan;
use App\Models\JenisTitikSampah;
use App\Models\Penugasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;

class PrivateController extends Controller
{
    public function penugasanIcon($id)
    {
        $penugasan = Penugasan::findOrFail($id);

        abort_unless($penugasan->icon, 404);

        abort_unless(Storage::disk('local')->exists($penugasan->icon), 404);

        $absolutePath = Storage::disk('local')->path($penugasan->icon);

        return response()->file($absolutePath, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    public function fotoKendaraan($id, $direction)
    {
        $kendaraan = DataKendaraan::findOrFail($id);

        // $getFoto = Arr::last($kendaraan->foto_kendaraan ?? []);

        $getFoto = $kendaraan->foto_kendaraan[$direction];

        abort_unless($getFoto, 404);

        abort_unless(Storage::disk('local')->exists($getFoto), 404);

        $absolutePath = Storage::disk('local')->path($getFoto);

        return response()->file($absolutePath, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    public function JTSIcon($id)
    {
        $jts = JenisTitikSampah::findOrFail($id);

        abort_unless($jts->icon, 404);

        abort_unless(Storage::disk('local')->exists($jts->icon), 404);

        $absolutePath = Storage::disk('local')->path($jts->icon);

        return response()->file($absolutePath, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
