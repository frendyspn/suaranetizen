<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DonasiController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserAuthController;

use App\Http\Controllers\Api\PollingController;
use App\Http\Controllers\Api\KategoriController;

use App\Http\Controllers\Api\IntroductionController;
use App\Http\Controllers\Api\BannerController;

use App\Http\Controllers\Api\AboutController;

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // 🔐 Donasi Management (Admin only)
        Route::apiResource('/donasi', DonasiController::class);

        Route::apiResource('kategori', KategoriController::class);

        Route::put('/introduction', [IntroductionController::class, 'update']);

        Route::get('/banners', [BannerController::class, 'index']);
        Route::post('/banners', [BannerController::class, 'store']);

        Route::put('/about', [AboutController::class,'update']);
    });
});

// 👤 USER ROUTES
Route::prefix('user')->group(function () {
    Route::post('/login', [UserAuthController::class, 'login']);

    Route::post('/register', [UserAuthController::class, 'register']);

    Route::get('/kategori', [KategoriController::class, 'publicList']);

    Route::get('/pollings', [PollingController::class, 'showPollings']);

    Route::get('/result-pollings', [PollingController::class, 'resultPollings']);

    Route::get('/quote/{id}', [DonasiController::class, 'publicShow']);

    Route::get('/introduction',  [IntroductionController::class, 'show']);

    Route::get('/banner-active', [BannerController::class,'showActive']); 

    Route::get('/about', [AboutController::class,'show']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [UserAuthController::class, 'me']);
        Route::post('/logout', [UserAuthController::class, 'logout']);

        Route::post('/polling', [PollingController::class, 'store']);
        Route::post('/polling/{id}/generate-qris', [PollingController::class, 'generateQris']);
        Route::post('/polling/{id}/update-status-payment', [PollingController::class, 'updateStatusPayment']);
        Route::get('/polling/{id}', [PollingController::class, 'show']);
        Route::get('/donasi-aktif', [PollingController::class, 'donasiAktif']);
        
        

        Route::post('/polling-vote', [PollingController::class, 'vote']);

        

    });
});

Route::prefix('auth')->group(function () {
    Route::get('/google/redirect',  [SocialAuthController::class,'googleRedirect']);
    Route::get('/google/callback',  [SocialAuthController::class,'googleCallback']);

    Route::get('/facebook/redirect',[SocialAuthController::class,'facebookRedirect']);
    Route::get('/facebook/callback',[SocialAuthController::class,'facebookCallback']);
});