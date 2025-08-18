<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SponsorController extends Controller
{
    public function index()
    {
        try {
            $sponsors = Sponsor::orderBy('created_at', 'desc')->get();
            return response()->json($sponsors);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sponsors'], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        try {
            $imageName = null;
            
            if ($request->hasFile('image')) {
                // Store file using public_uploads disk for shared hosting
                $imageName = $request->file('image')->store('sponsors', 'public_uploads');
            }

            $sponsor = Sponsor::create([
                'title' => $request->title,
                'image' => $imageName,
            ]);

            return response()->json($sponsor, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create sponsor: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $sponsor = Sponsor::findOrFail($id);
            return response()->json($sponsor);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Sponsor not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        // Support for POST method with _method override or direct POST
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            $sponsor = Sponsor::findOrFail($id);
            $sponsor->title = $request->title;

            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($sponsor->image && Storage::disk('public_uploads')->exists($sponsor->image)) {
                    Storage::disk('public_uploads')->delete($sponsor->image);
                }

                // Store new image using public_uploads disk
                $sponsor->image = $request->file('image')->store('sponsors', 'public_uploads');
            }

            $sponsor->save();

            return response()->json($sponsor);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update sponsor: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $sponsor = Sponsor::findOrFail($id);

            // Delete image file if exists
            if ($sponsor->image && Storage::disk('public_uploads')->exists($sponsor->image)) {
                Storage::disk('public_uploads')->delete($sponsor->image);
            }

            $sponsor->delete();

            return response()->json(['message' => 'Sponsor deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete sponsor'], 500);
        }
    }
}
