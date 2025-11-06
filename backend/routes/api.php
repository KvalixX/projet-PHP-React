<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\ProfessorController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\AuthController;

Route::prefix('v1')->group(function () {
    // Groups
    Route::get('/groups', [GroupController::class, 'index']);
    Route::post('/groups', [GroupController::class, 'store']);
    Route::put('/groups/{id}', [GroupController::class, 'update']);
    Route::delete('/groups/{id}', [GroupController::class, 'destroy']);

    // Modules
    Route::get('/modules', [ModuleController::class, 'index']);
    Route::post('/modules', [ModuleController::class, 'store']);
    Route::put('/modules/{id}', [ModuleController::class, 'update']);
    Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);

    // Professors
    Route::get('/professors', [ProfessorController::class, 'index']);
    Route::post('/professors', [ProfessorController::class, 'store']);
    Route::put('/professors/{id}', [ProfessorController::class, 'update']);
    Route::delete('/professors/{id}', [ProfessorController::class, 'destroy']);

    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

    // Sessions
    Route::get('/sessions', [SessionController::class, 'index']);
    Route::post('/sessions', [SessionController::class, 'store']);
    Route::put('/sessions/{id}', [SessionController::class, 'update']);
    Route::delete('/sessions/{id}', [SessionController::class, 'destroy']);

    Route::post('/login', [AuthController::class, 'login']);
});


