<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Billboard;
use Illuminate\Http\Request;

class BillboardController extends Controller
{
    public function show()
    {
        $billboard = Billboard::first();
        return response()->json($billboard);
    }

    public function update(Request $request)
    {
        $request->validate([
            'content' => 'required|string'
        ]);

        $billboard = Billboard::firstOrCreate(
            [],
            ['content' => $request->content]
        );

        $billboard->update(['content' => $request->content]);

        return response()->json([
            'message' => 'Billboard updated successfully',
            'data' => $billboard
        ]);
    }
}
