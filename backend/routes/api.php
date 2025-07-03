<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DonasiController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserAuthController;

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // 🔐 Donasi Management (Admin only)
        Route::apiResource('/donasi', DonasiController::class);
    });
});

// 👤 USER ROUTES
Route::prefix('user')->group(function () {
    Route::post('/login', [UserAuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [UserAuthController::class, 'me']);
        Route::post('/logout', [UserAuthController::class, 'logout']);

        // 🔓 Contoh route user: donasi aktif yang bisa dilihat user
        Route::get('/donasi-aktif', function () {
            return \App\Models\Donasi::where('is_active', true)->get();
        });
    });
});
