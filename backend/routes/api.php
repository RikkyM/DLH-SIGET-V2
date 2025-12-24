<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\JenisKendaraan\JenisKendaraanController;
use App\Http\Controllers\JTSController;
use App\Http\Controllers\Kecamatan\KecamatanController;
use App\Http\Controllers\Kelurahan\KelurahanController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\PenugasanController;
use App\Http\Controllers\Petugas\PetugasController;
use App\Http\Controllers\PrivateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// Route::get('/homepage/map', [FilterController::class, 'homepage']);
// Route::prefix('filters')->group(function () {
//     Route::get('/departments', [DepartmentController::class, 'filterDepartment']);
//     Route::get('/penugasan', [PenugasanController::class, 'filterPenugasan']);
//     Route::get('/penampungan', [JTSController::class, 'filterPenampungan']);
//     Route::get('/lambung', [KendaraanController::class, 'filterLambung']);
// });


Route::middleware('web')->group(function () {
    Route::get(
        '/homepage/map',
        [FilterController::class, 'homepage']
    );

    Route::prefix('filters')->group(function () {
        Route::get('/departments', [DepartmentController::class, 'filterDepartment']);
        Route::get('/penugasan', [PenugasanController::class, 'filterPenugasan']);
        Route::get('/penampungan', [JTSController::class, 'filterPenampungan']);
        Route::get('/lambung', [KendaraanController::class, 'filterLambung']);
    });

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
        Route::get('/user', function (Request $request) {
            return response()->json(Auth::user());
        });
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/petugas', [PetugasController::class, 'index']);
        Route::get('/penampungan-sementara', [JTSController::class, 'index']);
        Route::put('/penampungan-sementara/{id}', [JTSController::class, 'updateTps']);
        Route::get('/data-kendaraan', [KendaraanController::class, 'index']);
        Route::get('/penugasans', [PenugasanController::class, 'index']);
        Route::put('/penugasan/{id}', [PenugasanController::class, 'updatePenugasan']);
        Route::get('/unit-kerja', [DepartmentController::class, 'index']);
        Route::get('/kelurahan', [KelurahanController::class, 'index']);
        Route::get('/kecamatan', [KecamatanController::class, 'index']);
        Route::get('/master-data/jenis-kendaraan', [JenisKendaraanController::class, 'index']);
        Route::get('/master-data/jenis-titik-sampah', [JTSController::class, 'masterJts']);
        Route::put('/master-data/jenis-titik-sampah/{id}', [JTSController::class, 'updateMasterJts']);

        // Route::put('/petugas/{id}', [PetugasController::class, 'update']);

        Route::get('/department', [DepartmentController::class, 'getDepartment']);
        Route::get('/penugasan', [PenugasanController::class, 'getPenugasan']);
        Route::get('/jts', [JTSController::class, 'getJts']);
        Route::get('/jenis-kendaraan', [JenisKendaraanController::class, 'getJenisKendaraan']);
        Route::get('/data-kendaraan/tahun-pembuatan', [KendaraanController::class, 'tahunPembuatan']);
        Route::get('/kendaraan-filter', [KendaraanController::class, 'filterKendaraan']);
        Route::get('/kecamatan-filter', [KecamatanController::class, 'filterKecamatan']);
        Route::get('/kelurahan-filter', [KelurahanController::class, 'filterKelurahan']);
        Route::get('/tps/tnkb', [JTSController::class, 'tnkb']);
        Route::get('/tps/lambung', [JTSController::class, 'lambung']);

        //icon
        Route::get('/penugasan/{id}/icon', [PrivateController::class, 'penugasanIcon']);
        Route::get('/jenis-titik-sampah/{id}/icon', [PrivateController::class, 'JTSIcon']);
    });
});
