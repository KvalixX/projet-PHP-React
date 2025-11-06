<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClassSession;
use App\Models\CourseModule;
use App\Models\Professor;
use App\Models\StudentGroup;
use App\Models\Room;

class ClassSessionsSeeder extends Seeder
{
    public function run(): void
    {
        // Map codes/names to ids
        $moduleId = fn(string $code) => (string) optional(CourseModule::where('code', $code)->first())->id;
        $profId = fn(string $email) => (string) optional(Professor::where('email', $email)->first())->id;
        $groupId = fn(string $name) => (string) optional(StudentGroup::where('name', $name)->first())->id;
        $roomId = fn(string $name) => (string) optional(Room::where('name', $name)->first())->id;

        $rows = [
            ['CS301','sarah.j@university.edu','CS-L3-A','Amphi A','Lundi','08:00',120,'Cours'],
            ['CS302','emma.w@university.edu','CS-L3-A','Room 201','Lundi','10:30',120,'TD'],
            ['CS303','sarah.j@university.edu','CS-L3-B','Lab 101','Lundi','14:00',180,'TP'],
            ['MATH201','michael.c@university.edu','MATH-L2-A','Amphi B','Lundi','08:00',120,'Cours'],
            ['CS301','sarah.j@university.edu','CS-L3-A','Room 201','Mardi','08:00',120,'TD'],
            ['PHYS301','david.b@university.edu','PHYS-L3-A','Amphi A','Mardi','10:30',120,'Cours'],
            ['CS304','emma.w@university.edu','CS-M1-A','Room 202','Mardi','14:00',120,'Cours'],
            ['CS302','emma.w@university.edu','CS-L3-A','Lab 102','Mercredi','08:00',180,'TP'],
            ['CS303','sarah.j@university.edu','CS-L3-B','Room 301','Mercredi','14:00',120,'TD'],
            ['MATH201','lisa.a@university.edu','MATH-L2-A','Room 201','Jeudi','10:30',120,'TD'],
            ['CS301','sarah.j@university.edu','CS-L3-A','Lab 101','Jeudi','14:00',180,'TP'],
            ['PHYS301','david.b@university.edu','PHYS-L3-A','Room 202','Vendredi','08:00',120,'TD'],
            ['CS304','emma.w@university.edu','CS-M1-A','Lab 102','Vendredi','10:30',180,'TP'],
        ];

        foreach ($rows as [$m, $p, $g, $r, $d, $start, $dur, $type]) {
            $mid = $moduleId($m); $pid = $profId($p); $gid = $groupId($g); $rid = $roomId($r);
            if ($mid && $pid && $gid && $rid) {
                ClassSession::query()->create([
                    'module_id' => $mid,
                    'professor_id' => $pid,
                    'group_id' => $gid,
                    'room_id' => $rid,
                    'day' => $d,
                    'start_time' => $start,
                    'duration' => $dur,
                    'type' => $type,
                ]);
            }
        }
    }
}


