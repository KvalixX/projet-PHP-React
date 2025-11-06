<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentGroup extends Model
{
    use HasFactory;

    protected $table = 'groups';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'level',
        'student_count',
    ];
}


