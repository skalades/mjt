import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import BottomNavigation from '@/Components/BottomNavigation';

export default function LandingLayout({
    auth,
    children,
}: PropsWithChildren<{ auth: any }>) {
    return (
        <div className="min-h-screen bg-mjt-slateDark font-sans text-slate-100 selection:bg-mjt-orange selection:text-white">
            {/* Top Navigation Bar */}
            <nav className="fixed z-50 w-full border-b border-mjt-slate/50 bg-mjt-slateDark/80 backdrop-blur-md hidden sm:block">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-mjt-orange text-xl font-bold tracking-tighter text-white">
                                MJT
                            </div>
                            <span className="hidden text-lg font-semibold tracking-wide sm:block">
                                MANDIRI JAYA TEKNIK
                            </span>
                        </div>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
                            <a href="#materials" className="transition hover:text-mjt-orange">Material</a>
                            <a href="#portfolio" className="transition hover:text-mjt-orange">Produk</a>
                            <a href="#contact" className="transition hover:text-mjt-orange">Minta Penawaran</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-sm font-semibold text-slate-300 transition hover:text-white"
                            >
                                Masuk ke Dasbor Admin
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                            >
                                Login Admin
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-0 sm:pt-20 pb-20 sm:pb-0">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-mjt-slate bg-mjt-slateDark py-12 text-center mb-16 sm:mb-0">
                <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} Mandiri Jaya Teknik. Hak Cipta Dilindungi Undang-Undang.
                </p>
                <p className="mt-2 text-xs text-slate-600">Terpercaya dalam presisi sejak pendirian kami.</p>
            </footer>

            {/* Mobile Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}
