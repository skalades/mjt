import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-lg border border-mjt-slate bg-mjt-slateDark px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-300 shadow-sm transition duration-150 ease-in-out hover:bg-mjt-slate hover:text-white focus:outline-none focus:ring-2 focus:ring-mjt-orange focus:ring-offset-2 focus:ring-offset-mjt-slateDark disabled:opacity-50 ${
                    disabled && 'opacity-50 grayscale'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
