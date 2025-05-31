<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorkoutTemplate extends Model
{
    use HasFactory;

    protected $fillable = ['template_name', 'type', 'days', 'user_id'];

    protected $casts = [
        'days' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}