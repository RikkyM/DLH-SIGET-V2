<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\JTSController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\PenugasanController;
use App\Http\Controllers\Petugas\PetugasController;
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

Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
        Route::get('/user', function (Request $request) {
            return response()->json(Auth::user());
        });
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/petugas', [PetugasController::class, 'index']);
        Route::put('/petugas/{id}', [PetugasController::class, 'update']);

        Route::get('/department', [DepartmentController::class, 'getDepartment']);
        Route::get('/penugasan', [PenugasanController::class, 'getPenugasan']);
    });
});
