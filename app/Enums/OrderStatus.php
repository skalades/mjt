<?php

namespace App\Enums;

enum OrderStatus: string
{
    case DRAFT = 'DRAFT';
    case PRODUCTION = 'PRODUCTION';
    case QC = 'QC';
    case SHIPPED = 'SHIPPED';
    case CANCELLED = 'CANCELLED';

    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Draft',
            self::PRODUCTION => 'Produksi',
            self::QC => 'QC / Finishing',
            self::SHIPPED => 'Selesai / Kirim',
            self::CANCELLED => 'Dibatalkan',
        };
    }
}
