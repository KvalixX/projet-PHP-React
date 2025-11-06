<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'Amphi A', 'capacity' => 200, 'type' => 'Amphitheatre'],
            ['name' => 'Amphi B', 'capacity' => 150, 'type' => 'Amphitheatre'],
            ['name' => 'Lab 101', 'capacity' => 30, 'type' => 'Lab'],
            ['name' => 'Lab 102', 'capacity' => 30, 'type' => 'Lab'],
            ['name' => 'Room 201', 'capacity' => 40, 'type' => 'Classroom'],
            ['name' => 'Room 202', 'capacity' => 40, 'type' => 'Classroom'],
            ['name' => 'Room 301', 'capacity' => 35, 'type' => 'Classroom'],
        ];

        foreach ($data as $row) {
            Room::query()->updateOrCreate(['name' => $row['name']], $row);
        }
    }
}


