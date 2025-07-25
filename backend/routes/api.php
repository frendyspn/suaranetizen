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

use App\Http\Controllers\SettingController;

use App\Http\Controllers\TeamController;

use App\Http\Controllers\UserController;


use App\Http\Controllers\Admin\GalleryController as GalleryController;

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
        Route::get('/banners/{banner}', [BannerController::class,'show']);
        Route::post('/banners/{banner}', [BannerController::class,'update']);
        Route::post('/banners', [BannerController::class, 'store']);

        Route::put('/about', [AboutController::class,'update']);

        
        Route::post('/settings', [SettingController::class, 'update']);


        Route::get('/teams', [TeamController::class, 'index']);
        Route::post('/teams', [TeamController::class, 'store']);
        Route::get('/teams/{id}', [TeamController::class, 'show']);
        Route::put('/teams/{id}', [TeamController::class, 'update']);
        Route::delete('/teams/{id}', [TeamController::class, 'destroy']);


        Route::apiResource('galleries', GalleryController::class);

        Route::get('billboard', [App\Http\Controllers\Admin\BillboardController::class, 'show']);
        Route::put('billboard', [App\Http\Controllers\Admin\BillboardController::class, 'update']);

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

    Route::get('/settings', [SettingController::class, 'index']);

    Route::get('/teams', [TeamController::class, 'index']);

    Route::get('/galleries', [GalleryController::class, 'index']);

    Route::get('billboard', [App\Http\Controllers\User\BillboardController::class, 'show']);

    Route::get('/donation-progress', [App\Http\Controllers\Api\DonasiController::class, 'donationProgress']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [UserAuthController::class, 'me']);
        Route::post('/logout', [UserAuthController::class, 'logout']);

        Route::post('/polling', [PollingController::class, 'store']);
        Route::post('/polling-free', [PollingController::class, 'storeFree']);
        Route::post('/polling/{id}/generate-qris', [PollingController::class, 'generateQris']);
        Route::post('/polling/{id}/update-status-payment', [PollingController::class, 'updateStatusPayment']);
        Route::get('/polling/{id}', [PollingController::class, 'show']);
        Route::get('/donasi-aktif', [PollingController::class, 'donasiAktif']);
        

        Route::post('/polling-vote', [PollingController::class, 'vote']);

        Route::get('/profile', [UserController::class, 'profile']);
        

    });
});

Route::prefix('auth')->group(function () {
    Route::get('/google/redirect',  [SocialAuthController::class,'googleRedirect']);
    Route::get('/google/callback',  [SocialAuthController::class,'googleCallback']);

    Route::get('/facebook/redirect',[SocialAuthController::class,'facebookRedirect']);
    Route::get('/facebook/callback',[SocialAuthController::class,'facebookCallback']);
});