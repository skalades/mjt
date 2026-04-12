import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Box, ShoppingBag, Wallet, Cog } from 'lucide-react';

export default function AdminBottomNavigation() {
    const { url } = usePage();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: route('dashboard') },
        { name: 'Pesanan', icon: ShoppingBag, href: route('orders.index') },
        { name: 'Keuangan', icon: Wallet, href: route('finance.index') },
        { name: 'Pengaturan', icon: Cog, href: route('settings.index') },
    ];

    return (
        <div className="fixed bottom-0 z-50 w-full border-t border-gray-100 bg-white/90 pb-safe pt-2 sm:hidden backdrop-blur-xl">
            <div className="flex h-20 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = route().current(item.href.split('/').pop() + '.*') || url === new URL(item.href).pathname;
                    
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex w-full flex-col items-center justify-center gap-1.5 transition-all active:scale-90 ${
                                isActive ? 'text-mjt-orange' : 'text-gray-400 hover:text-mjt-slate'
                            }`}
                        >
                            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-orange-50' : 'bg-transparent'}`}>
                                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
