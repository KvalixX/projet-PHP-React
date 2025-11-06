<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin','professor','student'])->default('admin');
            }
            if (!Schema::hasColumn('users', 'group_id')) {
                $table->unsignedBigInteger('group_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'professor_id')) {
                $table->unsignedBigInteger('professor_id')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
            if (Schema::hasColumn('users', 'group_id')) {
                $table->dropColumn('group_id');
            }
            if (Schema::hasColumn('users', 'professor_id')) {
                $table->dropColumn('professor_id');
            }
        });
    }
};


