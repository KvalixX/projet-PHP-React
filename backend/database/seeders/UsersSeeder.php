<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'khalil@univ.ma'],
            [
                'name' => 'Khalil Laknifli',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );
    }
}


