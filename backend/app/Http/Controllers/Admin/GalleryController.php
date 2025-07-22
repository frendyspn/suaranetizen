<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        return Gallery::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:2048'
        ]);

        $data['image'] = $request->file('image')->store('galleries', 'public_uploads');

        return Gallery::create($data);
    }

    public function show($id)
    {
        return Gallery::findOrFail($id);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($gallery->image && Storage::disk('public')->exists($gallery->image)) {
                Storage::disk('public')->delete($gallery->image);
            }
            $data['image'] = $request->file('image')->store('galleries', 'public_uploads');
        }

        $gallery->update($data);
        return $gallery;
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->image && Storage::disk('public')->exists($gallery->image)) {
            Storage::disk('public')->delete($gallery->image);
        }
        $gallery->delete();
        return response()->noContent();
    }
}
