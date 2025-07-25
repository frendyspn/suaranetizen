<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    private function deactivateOthers()
    {
        Banner::where('is_active', true)->update(['is_active' => false]);
    }

    public function index()
    {
        return Banner::get()?->append('image_url');
    }

    public function store(Request $r)
    {
        $r->merge([
            'is_active' => filter_var($r->input('is_active'), FILTER_VALIDATE_BOOLEAN)
        ]);
        $data = $r->validate([
            // …validasi lain
            'title' => 'required|string|max:255',
            'is_active' => 'required|boolean'
        ]);
        if ($data['is_active']) $this->deactivateOthers();

        $data['image_path'] = $r->file('image')->store('banners', 'public_uploads');
        return Banner::create($data);
    }

    public function show($id)
    {
        $banner = Banner::findOrFail($id);
        return $banner->append('image_url');
    }

    public function update(Request $r, Banner $banner)
    {
        $r->merge([
            'is_active' => filter_var($r->input('is_active'), FILTER_VALIDATE_BOOLEAN)
        ]);
        $data = $r->validate([
            // …validasi lain
            'title' => 'required|string|max:255',
            'is_active' => 'required|boolean'
        ]);
        if ($data['is_active']) $this->deactivateOthers();

        if ($r->file('image')) {
            Storage::disk('public_uploads')->delete($banner->image_path);
            $data['image_path'] = $r->file('image')->store('banners','public_uploads');
        }
        $banner->update($data);

        return $banner->fresh()->append('image_url');
    }

    public function showActive()
    {
        return Banner::where('is_active', true)->first()?->append('image_url');
    }



}
