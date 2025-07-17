<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'name');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->all();

        // Handle file uploads
        foreach (['site_logo', 'site_favicon', 'site_thumbnail'] as $fileKey) {
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                // Simpan file ke folder 'settings' di disk 'public_uploads'
                $path = $file->store('settings', 'public_uploads');
                // Simpan path ke database
                Setting::updateOrCreate(
                    ['name' => $fileKey],
                    ['value' => $path]
                );
                unset($data[$fileKey]);
            }
        }

        // Text settings
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['name' => $key], ['value' => $value]);
        }

        return response()->json(['message' => 'Settings updated']);
    }
}
