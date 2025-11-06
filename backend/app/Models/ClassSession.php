<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    use HasFactory;

    protected $table = 'class_sessions';

    public $timestamps = false;

    protected $fillable = [
        'module_id', 'professor_id', 'group_id', 'room_id', 'day', 'start_time', 'duration', 'type'
    ];
}


