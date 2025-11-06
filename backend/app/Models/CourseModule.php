<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseModule extends Model
{
    use HasFactory;

    protected $table = 'modules';

    public $timestamps = false;

    protected $fillable = [
        'name', 'code', 'hours', 'color'
    ];
}


