<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DonasiController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserAuthController;

use App\Http\Controllers\Api\PollingController;
use App\Http\Controllers\Api\KategoriController;

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // 🔐 Donasi Management (Admin only)
        Route::apiResource('/donasi', DonasiController::class);

        Route::apiResource('kategori', KategoriController::class);
    });
});

// 👤 USER ROUTES
Route::prefix('user')->group(function () {
    Route::post('/login', [UserAuthController::class, 'login']);

    Route::post('/register', [UserAuthController::class, 'register']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [UserAuthController::class, 'me']);
        Route::post('/logout', [UserAuthController::class, 'logout']);

        Route::post('/polling', [PollingController::class, 'store']);
        Route::post('/polling/{id}/generate-qris', [PollingController::class, 'generateQris']);
        Route::get('/polling/{id}', [PollingController::class, 'show']);
        Route::get('/donasi-aktif', [PollingController::class, 'donasiAktif']);

        Route::get('/kategori', [KategoriController::class, 'publicList']);

    });
});
