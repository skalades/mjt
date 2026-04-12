<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class FinanceTransaction extends Model
{
    protected $fillable = [
        'type',
        'category',
        'payment_method',
        'status',
        'amount',
        'transaction_date',
        'maturity_date',
        'reference_number',
        'source',
        'notes',
        'referenceable_type',
        'referenceable_id',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'integer',
        'transaction_date' => 'date',
        'maturity_date' => 'date',
    ];

    /**
     * Get the parent referenceable model (Order, etc).
     */
    public function referenceable(): MorphTo
    {
        return $this->morphTo();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
