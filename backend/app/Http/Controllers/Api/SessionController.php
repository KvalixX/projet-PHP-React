<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassSession;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function index()
    {
        $sessions = ClassSession::query()->get()->map(function (ClassSession $session) {
            return [
                'id' => (string) $session->id,
                'moduleId' => (string) $session->module_id,
                'professorId' => (string) $session->professor_id,
                'groupId' => (string) $session->group_id,
                'roomId' => (string) $session->room_id,
                'day' => $this->mapDayToEnglish($session->day),
                'date' => $session->date ? $session->date->format('Y-m-d') : null,
                'startTime' => substr($session->start_time, 0, 5),
                'endTime' => $this->computeEndTime($session->start_time, $session->duration),
                'type' => $this->mapTypeToFrontend($session->type),
            ];
        });

        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'moduleId' => ['required', 'integer', 'exists:modules,id'],
            'professorId' => ['required', 'integer', 'exists:professors,id'],
            'groupId' => ['required', 'integer', 'exists:groups,id'],
            'roomId' => ['required', 'integer', 'exists:rooms,id'],
            'day' => ['required', 'string'],
            'date' => ['nullable', 'date'],
            'startTime' => ['required', 'date_format:H:i'],
            'endTime' => ['required', 'date_format:H:i'],
            'type' => ['required', 'string'],
        ]);

        $duration = $this->computeDuration($data['startTime'], $data['endTime']);
        $created = ClassSession::create([
            'module_id' => $data['moduleId'],
            'professor_id' => $data['professorId'],
            'group_id' => $data['groupId'],
            'room_id' => $data['roomId'],
            'day' => $this->mapDayToDb($data['day']),
            'date' => $data['date'] ?? null,
            'start_time' => $data['startTime'] . ':00',
            'duration' => $duration,
            'type' => $this->mapTypeToDb($data['type']),
        ]);

        return response()->json([
            'id' => (string) $created->id,
            'moduleId' => (string) $created->module_id,
            'professorId' => (string) $created->professor_id,
            'groupId' => (string) $created->group_id,
            'roomId' => (string) $created->room_id,
            'day' => $this->mapDayToEnglish($created->day),
            'date' => $created->date ? $created->date->format('Y-m-d') : null,
            'startTime' => substr($created->start_time, 0, 5),
            'endTime' => $this->computeEndTime($created->start_time, $created->duration),
            'type' => $this->mapTypeToFrontend($created->type),
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $session = ClassSession::query()->findOrFail($id);
        $data = $request->validate([
            'moduleId' => ['required', 'integer', 'exists:modules,id'],
            'professorId' => ['required', 'integer', 'exists:professors,id'],
            'groupId' => ['required', 'integer', 'exists:groups,id'],
            'roomId' => ['required', 'integer', 'exists:rooms,id'],
            'day' => ['required', 'string'],
            'date' => ['nullable', 'date'],
            'startTime' => ['required', 'date_format:H:i'],
            'endTime' => ['required', 'date_format:H:i'],
            'type' => ['required', 'string'],
        ]);

        $duration = $this->computeDuration($data['startTime'], $data['endTime']);
        $session->update([
            'module_id' => $data['moduleId'],
            'professor_id' => $data['professorId'],
            'group_id' => $data['groupId'],
            'room_id' => $data['roomId'],
            'day' => $this->mapDayToDb($data['day']),
            'date' => $data['date'] ?? null,
            'start_time' => $data['startTime'] . ':00',
            'duration' => $duration,
            'type' => $this->mapTypeToDb($data['type']),
        ]);

        return response()->json([
            'id' => (string) $session->id,
            'moduleId' => (string) $session->module_id,
            'professorId' => (string) $session->professor_id,
            'groupId' => (string) $session->group_id,
            'roomId' => (string) $session->room_id,
            'day' => $this->mapDayToEnglish($session->day),
            'date' => $session->date ? $session->date->format('Y-m-d') : null,
            'startTime' => substr($session->start_time, 0, 5),
            'endTime' => $this->computeEndTime($session->start_time, $session->duration),
            'type' => $this->mapTypeToFrontend($session->type),
        ]);
    }

    public function destroy(string $id)
    {
        $session = ClassSession::query()->findOrFail($id);
        $session->delete();
        return response()->json(['status' => 'ok']);
    }

    private function computeEndTime(string $start, int $durationMinutes): string
    {
        [$h, $m] = array_map('intval', explode(':', $start));
        $total = $h * 60 + $m + $durationMinutes;
        $eh = floor($total / 60) % 24;
        $em = $total % 60;
        return sprintf('%02d:%02d', $eh, $em);
    }

    private function mapDayToEnglish(string $day): string
    {
        return match ($day) {
            'Lundi' => 'Monday',
            'Mardi' => 'Tuesday',
            'Mercredi' => 'Wednesday',
            'Jeudi' => 'Thursday',
            'Vendredi' => 'Friday',
            'Samedi' => 'Saturday',
            default => $day,
        };
    }

    private function mapDayToDb(string $day): string
    {
        return match ($day) {
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            default => $day,
        };
    }

    private function mapTypeToFrontend(string $type): string
    {
        return match ($type) {
            'Cours' => 'Course',
            default => $type,
        };
    }

    private function mapTypeToDb(string $type): string
    {
        return match ($type) {
            'Course' => 'Cours',
            default => $type,
        };
    }

    private function computeDuration(string $start, string $end): int
    {
        [$sh, $sm] = array_map('intval', explode(':', $start));
        [$eh, $em] = array_map('intval', explode(':', $end));
        $startTotal = $sh * 60 + $sm;
        $endTotal = $eh * 60 + $em;
        return max(0, $endTotal - $startTotal);
    }
}


