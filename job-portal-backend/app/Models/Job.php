<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
        'title',
        'description',
        'department_id',
        'location',
        'type',
        'experience_level',    // fixed typo here
        'salary_min',
        'salary_max',
        'company_id',
        'responsibilities',
        'requirements',
        'qualifications',
        'skills',
        'application_deadline',
        'start_date',
    ];

    protected $casts = [
        'responsibilities' => 'array',
        'requirements' => 'array',
        'qualifications' => 'array',
        'skills' => 'array',
        'application_deadline' => 'date',
        'start_date' => 'date',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
