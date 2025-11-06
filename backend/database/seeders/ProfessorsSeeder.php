<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Professor;

class ProfessorsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'Dr. Sarah Johnson', 'email' => 'sarah.j@university.edu', 'department' => 'Computer Science'],
            ['name' => 'Prof. Michael Chen', 'email' => 'michael.c@university.edu', 'department' => 'Mathematics'],
            ['name' => 'Dr. Emma Wilson', 'email' => 'emma.w@university.edu', 'department' => 'Computer Science'],
            ['name' => 'Prof. David Brown', 'email' => 'david.b@university.edu', 'department' => 'Physics'],
            ['name' => 'Dr. Lisa Anderson', 'email' => 'lisa.a@university.edu', 'department' => 'Mathematics'],
        ];

        foreach ($data as $row) {
            Professor::query()->updateOrCreate(['email' => $row['email']], $row);
        }
    }
}


