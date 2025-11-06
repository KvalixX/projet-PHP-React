<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseModule;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = CourseModule::query()->get()->map(function (CourseModule $module) {
            return [
                'id' => (string) $module->id,
                'name' => $module->name,
                'code' => $module->code,
                'hours' => (int) $module->hours,
                'color' => $module->color ?? $this->colorForCode($module->code),
            ];
        });

        return response()->json($modules);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1'],
            'code' => ['required', 'string', 'min:1'],
            'hours' => ['required', 'integer', 'min:0'],
            'color' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}){1,2}$/'],
        ]);
        if (empty($data['color'])) {
            $data['color'] = $this->colorForCode($data['code']);
        }
        $created = CourseModule::create($data);
        return response()->json([
            'id' => (string) $created->id,
            'name' => $created->name,
            'code' => $created->code,
            'hours' => (int) $created->hours,
            'color' => $created->color,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $module = CourseModule::query()->findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1'],
            'code' => ['required', 'string', 'min:1'],
            'hours' => ['required', 'integer', 'min:0'],
            'color' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}){1,2}$/'],
        ]);
        if (empty($data['color'])) {
            $data['color'] = $this->colorForCode($data['code']);
        }
        $module->update($data);
        return response()->json([
            'id' => (string) $module->id,
            'name' => $module->name,
            'code' => $module->code,
            'hours' => (int) $module->hours,
            'color' => $module->color,
        ]);
    }

    public function destroy(string $id)
    {
        $module = CourseModule::query()->findOrFail($id);
        $module->delete();
        return response()->json(['status' => 'ok']);
    }

    private function colorForCode(string $code): string
    {
        $palette = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
        $index = crc32($code) % count($palette);
        return $palette[$index];
    }
}


