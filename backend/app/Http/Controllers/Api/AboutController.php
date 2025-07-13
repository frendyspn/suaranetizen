<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\About;

class AboutController extends Controller
{
    public function show()
    {
        return About::first();
    }

    /** PUT /api/admin/about – admin */
    public function update(Request $r)
    {
        $data = $r->validate(['content'=>'required|string']);
        $about = About::first();
        $about->update($data);
        return response()->json($about);
    }
}
