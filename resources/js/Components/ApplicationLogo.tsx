export default function ApplicationLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded bg-mjt-orange text-2xl font-bold tracking-tighter text-white shadow-lg shadow-mjt-orange/20">
                MJT
            </div>
            <span className="text-xl font-bold tracking-wider text-white">
                MANDIRI JAYA TEKNIK
            </span>
        </div>
    );
}
