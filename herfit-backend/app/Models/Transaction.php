<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Listing;
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
        'status'
    ];

    public function setListingIdAttribute($value)
    {
        $listing = Listing::find($value);
        $totalDays = Carbon::createFromDate($this->attributes['start_date'])->diffInDays($this->attributes['end_date']) + 1;

        $this->attributes['listing_id'] = $value;
        $this->attributes['total_days'] = $totalDays;
    }

    // Mutator to set 'price' attribute
    public function setPriceAttribute($value)
    {
        // memastikan harga selalu disimpan sebagai angka yang valid (integer atau float)
        $this->attributes['price'] = (float) $value;
    }

    // Mutator to set 'status' attribute
    public function setStatusAttribute($value)
    {
        // memastikan status disimpan dalam format huruf kapital (uppercase)
        $this->attributes['status'] = strtoupper($value);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function listing(): BelongsTo {
        return $this->belongsTo(Listing::class);
    }
}
