<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\PenugasanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/homepage/map', [FilterController::class, 'homepage']);
Route::prefix('filters')->group(function () {
    Route::get('/departments', [DepartmentController::class, 'filterDepartment']);
    Route::get('/penugasan', [PenugasanController::class, 'filterPenugasan']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json(auth()->user());
    });
});
