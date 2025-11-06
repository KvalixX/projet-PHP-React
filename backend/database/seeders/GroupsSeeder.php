<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudentGroup;

class GroupsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'CS-L3-A', 'level' => 'License 3', 'student_count' => 45],
            ['name' => 'CS-L3-B', 'level' => 'License 3', 'student_count' => 42],
            ['name' => 'CS-M1-A', 'level' => 'Master 1', 'student_count' => 35],
            ['name' => 'MATH-L2-A', 'level' => 'License 2', 'student_count' => 50],
            ['name' => 'PHYS-L3-A', 'level' => 'License 3', 'student_count' => 38],
        ];

        foreach ($data as $row) {
            StudentGroup::query()->updateOrCreate(['name' => $row['name']], $row);
        }
    }
}


