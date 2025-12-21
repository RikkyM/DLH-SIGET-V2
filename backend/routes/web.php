<?php

use App\Http\Controllers\ImportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::controller(ImportController::class)->group(function () {
    Route::get('/import-petugas', 'importPetugas')->name('import-petugas');
    Route::post('/import-petugas', 'importPetugasProcess');
    Route::get('/import-kendaraan-petugas', 'kendaraanPetugas')->name('import-kendaraan-petugas');
    Route::post('/import-kendaraan-petugas', 'kendaraanPetugasProcess');
});
