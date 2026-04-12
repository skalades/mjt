import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-mjt-slate bg-mjt-slateDark/50 text-mjt-orange shadow-sm focus:ring-mjt-orange ' +
                className
            }
        />
    );
}
