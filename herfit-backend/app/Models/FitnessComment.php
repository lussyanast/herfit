<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FitnessComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fitness_post_id',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(FitnessPost::class, 'fitness_post_id');
    }
}


