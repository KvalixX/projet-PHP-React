<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->cascadeOnUpdate();
            $table->foreignId('professor_id')->constrained('professors')->cascadeOnUpdate();
            $table->foreignId('group_id')->constrained('groups')->cascadeOnUpdate();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnUpdate();
            $table->enum('day', ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']);
            $table->time('start_time');
            $table->integer('duration');
            $table->enum('type', ['Cours','TD','TP']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_sessions');
    }
};


