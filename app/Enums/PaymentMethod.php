<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CASH = 'CASH';
    case TRANSFER_MANDIRI = 'TRANSFER_MANDIRI';
    case TRANSFER_BCA = 'TRANSFER_BCA';
    case CHEQUE = 'CHEQUE';
    case GIRO = 'GIRO';

    public function label(): string
    {
        return match($this) {
            self::CASH => 'Tunai',
            self::TRANSFER_MANDIRI => 'Transfer Mandiri',
            self::TRANSFER_BCA => 'Transfer BCA',
            self::CHEQUE => 'Cek',
            self::GIRO => 'Giro',
        };
    }

    public function isPending(): bool
    {
        return in_array($this, [self::CHEQUE, self::GIRO]);
    }
}
