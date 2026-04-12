<?php

namespace App\Helpers;

use Carbon\Carbon;

class DateHelper
{
    /**
     * Format date to Indonesian human readable format.
     * Result: 11 April 2026
     */
    public static function formatIndonesian($date)
    {
        if (!$date) return '-';
        
        $carbon = is_string($date) ? Carbon::parse($date) : $date;
        
        $months = [
            1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        return $carbon->day . ' ' . $months[$carbon->month] . ' ' . $carbon->year;
    }
}
