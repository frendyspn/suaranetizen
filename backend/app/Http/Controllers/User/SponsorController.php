<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;

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
}
