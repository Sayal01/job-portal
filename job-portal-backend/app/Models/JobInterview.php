<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobInterview extends Model
{
    protected $fillable = [
        'application_id',
        'round_number',
        'status',
        'scheduled_at',
        'interviewer_name',
        'remarks',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
