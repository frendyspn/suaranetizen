<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

// Route untuk serving files dari public_uploads disk (shared hosting)
Route::get('/api/uploads/{type}/{filename}', function ($type, $filename) {
    $disk = 'public_uploads';
    $path = $type . '/' . $filename;
    
    if (!Storage::disk($disk)->exists($path)) {
        abort(404);
    }
    
    $file = Storage::disk($disk)->get($path);
    $mimeType = Storage::disk($disk)->mimeType($path);
    
    return response($file, 200)->header('Content-Type', $mimeType);
})->where(['type' => '[a-z]+', 'filename' => '[A-Za-z0-9\-_.]+']);
