<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Document extends Model
{
    use HasUuids;

    protected $fillable = [
        'documentable_type',
        'documentable_id',
        'type',
        'file_path',
        'qr_hash',
    ];

    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }
}
