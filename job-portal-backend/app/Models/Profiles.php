<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profiles extends Model
{
    //
    protected $fillable = [
        'user_id',
        'bio',
        'skills',
        'education',
        'work_experience',
        'resume_file'
    ];

    protected $casts = [
        'skills' => 'array',
        'education' => 'array',
        'work_experience' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
