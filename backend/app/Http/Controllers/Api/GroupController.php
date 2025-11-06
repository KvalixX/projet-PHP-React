<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentGroup;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index()
    {
        $groups = StudentGroup::query()->get()->map(function (StudentGroup $group) {
            return [
                'id' => (string) $group->id,
                'name' => $group->name,
                'level' => $group->level,
                'studentCount' => (int) $group->student_count,
            ];
        });

        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1'],
            'level' => ['required', 'string'],
            'studentCount' => ['required', 'integer', 'min:0'],
        ]);

        $created = StudentGroup::create([
            'name' => $data['name'],
            'level' => $data['level'],
            'student_count' => $data['studentCount'],
        ]);

        return response()->json([
            'id' => (string) $created->id,
            'name' => $created->name,
            'level' => $created->level,
            'studentCount' => (int) $created->student_count,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $group = StudentGroup::query()->findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1'],
            'level' => ['required', 'string'],
            'studentCount' => ['required', 'integer', 'min:0'],
        ]);

        $group->update([
            'name' => $data['name'],
            'level' => $data['level'],
            'student_count' => $data['studentCount'],
        ]);

        return response()->json([
            'id' => (string) $group->id,
            'name' => $group->name,
            'level' => $group->level,
            'studentCount' => (int) $group->student_count,
        ]);
    }

    public function destroy(string $id)
    {
        $group = StudentGroup::query()->findOrFail($id);
        $group->delete();
        return response()->json(['status' => 'ok']);
    }
}


