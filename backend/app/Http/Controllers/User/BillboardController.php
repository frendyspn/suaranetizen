<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Billboard;

class BillboardController extends Controller
{
    public function show()
    {
        $billboard = Billboard::first();
        return response()->json($billboard);
    }
}
