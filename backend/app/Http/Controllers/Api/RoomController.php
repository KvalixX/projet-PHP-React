<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::query()->get()->map(function (Room $room) {
            return [
                'id' => (string) $room->id,
                'name' => $room->name,
                'capacity' => (int) $room->capacity,
                'type' => $room->type,
            ];
        });

        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1'],
            'capacity' => ['required', 'integer', 'min:0'],
            'type' => ['required', 'in:Amphitheatre,Lab,Classroom'],
        ]);
        $created = Room::create($data);
        return response()->json([
            'id' => (string) $created->id,
            'name' => $created->name,
            'capacity' => (int) $created->capacity,
            'type' => $created->type,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $room = Room::query()->findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1'],
            'capacity' => ['required', 'integer', 'min:0'],
            'type' => ['required', 'in:Amphitheatre,Lab,Classroom'],
        ]);
        $room->update($data);
        return response()->json([
            'id' => (string) $room->id,
            'name' => $room->name,
            'capacity' => (int) $room->capacity,
            'type' => $room->type,
        ]);
    }

    public function destroy(string $id)
    {
        $room = Room::query()->findOrFail($id);
        $room->delete();
        return response()->json(['status' => 'ok']);
    }
}


