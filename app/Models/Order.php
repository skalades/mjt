<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number',
        'client_name',
        'status',
        'total_amount',
        'paid_amount',
        'payment_status',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
        'total_amount' => 'integer',
        'paid_amount' => 'integer',
    ];

    public function financeTransactions(): MorphMany
    {
        return $this->morphMany(FinanceTransaction::class, 'referenceable');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function productionLogs(): HasMany
    {
        return $this->hasMany(ProductionLog::class);
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
