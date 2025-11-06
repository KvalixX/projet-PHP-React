<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('level', 100);
            $table->integer('student_count');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};


