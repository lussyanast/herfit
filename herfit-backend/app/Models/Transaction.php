<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Listing;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'listing_id',
        'start_date',
        'end_date',
        'total_days',
        'price',
        'status',
        'qr_code_path',
        'bukti_bayar',
    ];

    // Automatically calculate total_days before saving
    protected static function booted()
    {
        static::saving(function ($transaction) {
            if ($transaction->start_date && $transaction->end_date) {
                $transaction->total_days = Carbon::parse($transaction->start_date)
                    ->diffInDays(Carbon::parse($transaction->end_date)) + 1;
            }
        });
    }

    // Mutator to set 'price' attribute
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = (float) $value;
    }

    // Mutator to set 'status' attribute
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = strtolower($value);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}