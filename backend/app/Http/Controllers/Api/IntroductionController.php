<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Introduction;

class IntroductionController extends Controller
{
    public function show()
    {
        return Introduction::first();         // id = 1
    }

    public function update(Request $r)
    {
        $data = $r->validate(['content'=>'required|string']);
        $intro = Introduction::first();
        $intro->update($data);
        return response()->json($intro);
    }
}
