import React, { useEffect, useState } from 'react';

interface Props {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    placeholder?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
}

export default function CurrencyInput({
    value,
    onChange,
    className = '',
    placeholder = '0',
    id,
    required = false,
    disabled = false,
    autoFocus = false,
}: Props) {
    const [displayValue, setDisplayValue] = useState('');

    // Format number to Indonesian format (thousand separator)
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // Update display value when prop value changes
    useEffect(() => {
        if (value === 0 && displayValue === '') return;
        const formatted = formatNumber(value);
        if (formatted !== displayValue) {
            setDisplayValue(formatted);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const numericValue = parseInt(rawValue) || 0;
        
        setDisplayValue(formatNumber(numericValue));
        onChange(numericValue);
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">Rp</span>
            <input
                type="text"
                id={id}
                value={displayValue}
                onChange={handleChange}
                className={`pl-8 ${className}`}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                autoFocus={autoFocus}
            />
        </div>
    );
}
