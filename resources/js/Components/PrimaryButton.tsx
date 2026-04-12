import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-mjt-orange px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-mjt-orangeAccent focus:outline-none focus:ring-2 focus:ring-mjt-orange focus:ring-offset-2 focus:ring-offset-mjt-slateDark active:bg-mjt-orangeAccent shadow-lg shadow-mjt-orange/20 ${
                    disabled && 'opacity-50 grayscale'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
