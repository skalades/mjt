import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Box, Wallet, TrendingUp, DollarSign } from 'lucide-react';

import { formatIDR } from '@/Utils/format';
import { DashboardStats } from '@/types';

interface Props {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-extrabold leading-tight text-mjt-slateDark font-outfit uppercase tracking-tight">
                    Dashboard <span className="text-mjt-orange italic">Utama</span>
                </h2>
            }
        >
            <Head title="Dashboard MJT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="mb-10 overflow-hidden rounded-[2.5rem] bg-mjt-slate p-10 text-white shadow-2xl relative border-b-8 border-mjt-orange">
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-block bg-orange-500/20 text-mjt-orange text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-orange-500/30">
                                MJT Management System v2.0
                            </span>
                            <h3 className="text-3xl font-bold font-outfit mb-3">Selamat Datang, Admin MJT!</h3>
                            <p className="text-indigo-200/60 text-base leading-relaxed font-medium">
                                Operasional bengkel berjalan normal. Pantau stok barang, manajemen pesanan klien, dan arus kas keuangan secara real-time di bawah ini.
                            </p>
                        </div>
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none transform rotate-12">
                            <TrendingUp size={240} />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-3xl bg-white p-8 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="rounded-2xl bg-orange-50 p-4 text-mjt-orange group-hover:scale-110 transition-transform">
                                    <ShoppingBag size={28} />
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border border-green-100 ${stats.orders_today > 0 ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                                    +{stats.orders_today} HARI INI
                                </span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pesanan Produksi</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-mjt-slate font-outfit">{stats.total_orders}</p>
                                <span className="text-sm font-bold text-gray-400">Order</span>
                            </div>
                        </div>

                        <div className="group rounded-3xl bg-white p-8 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-500 group-hover:scale-110 transition-transform">
                                    <Box size={28} />
                                </div>
                                {stats.low_stock_count > 0 && (
                                    <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 uppercase tracking-tight animate-pulse">
                                        STOK RENDAH ({stats.low_stock_count})
                                    </span>
                                )}
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Item Gudang</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-mjt-slate font-outfit">{stats.total_items}</p>
                                <span className="text-sm font-bold text-gray-400">Barang</span>
                            </div>
                        </div>

                        <div className="group rounded-3xl bg-white p-8 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="rounded-2xl bg-green-50 p-4 text-green-600 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={28} />
                                </div>
                                <span className="text-[10px] font-black text-green-500 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 uppercase tracking-tight">
                                    NET PROFIT
                                </span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimasi Laba Bersih</p>
                            <div className="flex flex-col gap-1 items-start">
                                <p className={`text-3xl font-black font-outfit tracking-tight ${stats.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatIDR(stats.net_profit)}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Saldo Kas: <span className="text-mjt-slate">{formatIDR(stats.balance)}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Tagihan (Revenue)</p>
                            <p className="text-xl font-black text-mjt-slate font-outfit">{formatIDR(stats.revenue)}</p>
                            <p className="text-[9px] font-bold text-indigo-500 mt-1 uppercase tracking-tighter">Bulan ini: {formatIDR(stats.monthly_revenue)}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={14} className="text-orange-500" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Biaya Bahan (COGS)</p>
                            </div>
                            <p className="text-xl font-black text-orange-600 font-outfit">{formatIDR(stats.material_cost)}</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Dari pemakaian bahan baku</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Laba Kotor (Gross Profit)</p>
                            <p className="text-xl font-black text-mjt-orange font-outfit">{formatIDR(stats.gross_profit)}</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Revenue − COGS</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Beban Operasional</p>
                            <p className="text-xl font-black text-red-500 font-outfit">{formatIDR(stats.expenses)}</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Diluar biaya bahan baku</p>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="mt-12 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 p-8">
                        <h4 className="font-outfit font-bold text-mjt-slate mb-6 flex items-center gap-2 uppercase tracking-wide">
                            <div className="w-1.5 h-6 bg-mjt-orange rounded-full"></div>
                            Akses Cepat
                        </h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: 'Buat Pesanan', link: route('orders.create'), color: 'bg-white text-indigo-600 border-white' },
                                { name: 'Input Bahan', link: route('inventory.index'), color: 'bg-white text-orange-600 border-white' },
                                { name: 'Cek Keuangan', link: route('finance.index'), color: 'bg-white text-green-600 border-white' },
                                { name: 'Kelola Cetakan', link: route('molds.index'), color: 'bg-white text-gray-600 border-white' },
                            ].map((btn) => (
                                <Link
                                    key={btn.name}
                                    href={btn.link}
                                    className={`${btn.color} p-4 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-100/50 hover:shadow-md hover:scale-105 transition-all text-center`}
                                >
                                    {btn.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
