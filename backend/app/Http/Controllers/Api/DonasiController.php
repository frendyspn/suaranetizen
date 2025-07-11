<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Donasi;
use App\Models\Polling;

class DonasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Donasi::orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_donasi' => 'required|string',
            'target' => 'required|numeric',
            'is_active' => 'required|boolean',
            'status' => 'required|in:new,onprogress,finish,reject',
            'expired_date' => 'required|date'
        ]);

        $donasi = Donasi::create($data);
        return response()->json($donasi, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Donasi::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $donasi = Donasi::findOrFail($id);

        $data = $request->validate([
            'nama_donasi' => 'required|string',
            'target' => 'required|numeric',
            'is_active' => 'required|boolean',
            'status' => 'required|in:new,onprogress,finish,reject',
            'expired_date' => 'required|date'
        ]);

        $donasi->update($data);
        return response()->json($donasi);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $donasi = Donasi::findOrFail($id);

        $data = [
            'is_active' => false,
        ];

        $donasi->update($data);
        return response()->json($donasi);
    }

    public function publicShow(string $id)
    {
        if ($id !== 'undefined') {
            $donasi = Donasi::findOrFail($id);
        } else {
            $donasi = Donasi::where('status', 'onprogress')->first();
        }
        
        
        
        if (!$donasi->is_active) {
            return response()->json(['message' => 'Donasi tidak aktif'], 404);
        }

        $polling = Polling::where('donasi_id', $donasi->id)
            ->where('status', 'paid')
            ->with('kategori')
            ->orderBy('created_at', 'desc')
            ->get();

        

        $donasi->polling = $polling;

        return response()->json($donasi);
    }
}
