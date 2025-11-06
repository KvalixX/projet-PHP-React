<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CourseModule;

class ModulesSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'Algorithms & Data Structures', 'code' => 'CS301', 'hours' => 48, 'color' => '#3B82F6'],
            ['name' => 'Database Systems', 'code' => 'CS302', 'hours' => 42, 'color' => '#10B981'],
            ['name' => 'Web Development', 'code' => 'CS303', 'hours' => 45, 'color' => '#F59E0B'],
            ['name' => 'Linear Algebra', 'code' => 'MATH201', 'hours' => 36, 'color' => '#8B5CF6'],
            ['name' => 'Quantum Physics', 'code' => 'PHYS301', 'hours' => 40, 'color' => '#EF4444'],
            ['name' => 'Software Engineering', 'code' => 'CS304', 'hours' => 38, 'color' => '#06B6D4'],
        ];

        foreach ($data as $row) {
            CourseModule::query()->updateOrCreate(['code' => $row['code']], $row);
        }
    }
}


