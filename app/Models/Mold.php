<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Mold extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'client_name',
        'name',
        'mold_code',
        'total_shots',
        'status',
        'location',
    ];

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
