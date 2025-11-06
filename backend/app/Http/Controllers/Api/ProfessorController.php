<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProfessorController extends Controller
{
    public function index()
    {
        $professors = Professor::query()->get()->map(function (Professor $prof) {
            return [
                'id' => (string) $prof->id,
                'name' => $prof->name,
                'email' => $prof->email,
                'department' => $prof->department,
            ];
        });

        return response()->json($professors);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2'],
            'email' => ['required', 'email'],
            'department' => ['required', 'string'],
        ]);

        $prof = Professor::create($data);

        // Generate default password from name + "@@" (remove spaces and non-letters)
        $baseName = preg_replace('/[^A-Za-zÀ-ÖØ-öø-ÿ]/u', '', $prof->name);
        $defaultPassword = ($baseName ?: 'Password') . '@@';

        // Create linked user account for professor
        $user = User::create([
            'name' => $prof->name,
            'email' => $prof->email,
            'password' => $defaultPassword, // hashed via cast
            'role' => 'professor',
            'professor_id' => $prof->id,
        ]);

        return response()->json([
            'id' => (string) $prof->id,
            'name' => $prof->name,
            'email' => $prof->email,
            'department' => $prof->department,
            // Return the generated password so the admin can share it
            'temporaryPassword' => $defaultPassword,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $prof = Professor::query()->findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2'],
            'email' => ['required', 'email'],
            'department' => ['required', 'string'],
        ]);
        $prof->update($data);

        // Keep linked user in sync (if exists)
        $user = User::where('professor_id', $prof->id)->first();
        if ($user) {
            $user->update([
                'name' => $prof->name,
                'email' => $prof->email,
            ]);
        }

        return response()->json([
            'id' => (string) $prof->id,
            'name' => $prof->name,
            'email' => $prof->email,
            'department' => $prof->department,
        ]);
    }

    public function destroy(string $id)
    {
        $prof = Professor::query()->findOrFail($id);

        // Remove linked user if any
        User::where('professor_id', $prof->id)->delete();

        $prof->delete();
        return response()->json(['status' => 'ok']);
    }
}


