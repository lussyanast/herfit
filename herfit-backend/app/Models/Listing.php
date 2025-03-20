<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'items_name',
        'slug',
        'description',
        'price',
        'attachments'
    ];

    protected $casts = [
        'attachments' => 'array'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function setItemsNameAttribute($value)
    {
        $this->attributes['items_name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'items_id');
    }
}
