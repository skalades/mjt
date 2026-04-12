import { Link, usePage } from '@inertiajs/react';
import { Home, Package, ShoppingCart, UserRound } from 'lucide-react';

export default function BottomNavigation() {
    const { url } = usePage();

    const navItems = [
        { name: 'Beranda', icon: Home, href: '/' },
        { name: 'Produk', icon: Package, href: '/#portfolio' },
        { name: 'Penawaran', icon: ShoppingCart, href: '/#contact' },
        { name: 'Akun', icon: UserRound, href: route('login') },
    ];

    return (
        <div className="fixed bottom-0 z-50 w-full border-t border-mjt-slate bg-mjt-slateDark/90 pb-safe pt-2 backdrop-blur-md sm:hidden">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = url === item.href || (url === '/' && item.href === '/');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex w-full flex-col items-center justify-center gap-1 transition-colors ${
                                isActive ? 'text-mjt-orange' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-wide">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
