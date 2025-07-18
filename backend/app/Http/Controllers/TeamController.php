<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Team;

class TeamController extends Controller
{
    public function index() {
        return response()->json(Team::all());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('teams', 'public_uploads');
        }


        $team = Team::create($data);
        return response()->json($team, 201);
    }

    public function show($id) {
        return response()->json(Team::findOrFail($id));
    }

    public function update(Request $request, $id) {
        $team = Team::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($team->photo && Storage::disk('public_uploads')->exists($team->photo)) {
                Storage::disk('public_uploads')->delete($team->photo);
            }
            // Simpan file ke folder 'teams' di disk 'public_uploads'
            $data['photo'] = $request->file('photo')->store('teams', 'public_uploads');
        }


        $team->update($data);
        return response()->json($team);
    }

    public function destroy($id) {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
