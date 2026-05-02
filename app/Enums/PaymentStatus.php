<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case UNPAID = 'UNPAID';
    case PARTIAL = 'PARTIAL';
    case PAID = 'PAID';

    public function label(): string
    {
        return match($this) {
            self::UNPAID => 'Belum Lunas',
            self::PARTIAL => 'Dibayar Sebagian',
            self::PAID => 'Lunas',
        };
    }
}
