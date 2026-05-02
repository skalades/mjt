<?php

namespace App\Enums;

enum TransactionType: string
{
    case IN = 'IN';
    case OUT = 'OUT';

    public function label(): string
    {
        return match($this) {
            self::IN => 'Pemasukan',
            self::OUT => 'Pengeluaran',
        };
    }
}
