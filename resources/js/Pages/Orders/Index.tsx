import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Search, ShoppingBag, Clock, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
    orders: {
        data: Array<{
            id: number;
            order_number: string;
            client_name: string;
            status: string;
            payment_status: string;
            total_amount: number;
            paid_amount: number;
            due_date: string;
        }>;
    };
}

const statusColors: any = {
    DRAFT: 'text-gray-600 bg-gray-50 border-gray-200',
    PRODUCTION: 'text-orange-700 bg-orange-50 border-orange-200',
    QC: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    SHIPPED: 'text-green-700 bg-green-50 border-green-200',
    CANCELLED: 'text-red-700 bg-red-50 border-red-200',
};

const paymentStatusColors: any = {
    UNPAID: 'text-red-600 bg-red-50 border-red-100',
    PARTIAL: 'text-orange-600 bg-orange-50 border-orange-100',
    PAID: 'text-green-600 bg-green-50 border-green-100',
};

import { formatIDR, formatDate } from '@/Utils/format';

export default function Index({ orders }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold leading-tight text-mjt-slateDark font-outfit uppercase tracking-tight">
                        Manajemen <span className="text-mjt-orange">Pesanan</span>
                    </h2>
                    <Link
                        href={route('orders.create')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-mjt-orange px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-100 transition-all hover:bg-mjt-orangeAccent active:scale-95"
                    >
                        <Plus size={18} />
                        Buat Pesanan
                    </Link>
                </div>
            }
        >
            <Head title="Pesanan MJT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 self-start">
                            <button className="px-6 py-2.5 text-xs font-bold bg-mjt-slate text-white rounded-xl shadow-md">Semua</button>
                            <button className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-mjt-slate transition-colors">Produksi</button>
                            <button className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-mjt-slate transition-colors">Selesai</button>
                        </div>
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mjt-orange transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Cari No. Order / Nama Klien..."
                                className="w-full rounded-2xl border-gray-100 bg-white py-3.5 pl-12 text-sm shadow-sm focus:border-mjt-orange focus:ring-4 focus:ring-orange-50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm border border-gray-100">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-gray-400 font-outfit">
                                    <tr>
                                        <th className="px-8 py-5">Informasi Pesanan</th>
                                        <th className="px-8 py-5">Klien</th>
                                        <th className="px-8 py-5">Produksi</th>
                                        <th className="px-8 py-5">Pembayaran</th>
                                        <th className="px-8 py-5 text-right font-bold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-mjt-slate group-hover:text-mjt-orange transition-colors uppercase tracking-tight text-base font-outfit">{order.order_number}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-1 font-bold uppercase tracking-widest">
                                                    <Clock size={12} className="text-gray-300" /> Deadline: {formatDate(order.due_date)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-gray-600">{order.client_name}</td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black border uppercase tracking-wider ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black border uppercase tracking-tight w-fit ${paymentStatusColors[order.payment_status]}`}>
                                                        {order.payment_status}
                                                    </span>
                                                    <div className="text-[10px] font-bold text-mjt-orange font-mono">
                                                        {formatIDR(order.total_amount)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link
                                                    href={route('orders.show', order.id)}
                                                    className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-mjt-slate hover:text-white transition-all shadow-sm"
                                                >
                                                    <Eye size={16} />
                                                    Kelola
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden divide-y divide-gray-50">
                            {orders.data.map((order) => (
                                <Link
                                    key={order.id}
                                    href={route('orders.show', order.id)}
                                    className="block p-5 active:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-black text-mjt-slate uppercase tracking-tight font-outfit text-base">{order.order_number}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{order.client_name}</p>
                                        </div>
                                        <span className={`text-[9px] font-black border px-2 py-0.5 rounded-full uppercase ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <div className="flex items-center gap-3">
                                            <span className={`border px-2 py-1 rounded-lg uppercase tracking-tight ${paymentStatusColors[order.payment_status]}`}>
                                                {order.payment_status}
                                            </span>
                                            <span className="text-mjt-orange font-mono text-sm">{formatIDR(order.total_amount)}</span>
                                        </div>
                                        <div className="text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                                            <Clock size={12} /> {formatDate(order.due_date)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {orders.data.length === 0 && (
                        <div className="mt-8 text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                            <AlertCircle className="mx-auto text-gray-200 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-gray-400 font-outfit">Belum ada pesanan aktif</h3>
                            <p className="text-sm text-gray-300 mt-1">Gunakan tombol "Buat Pesanan" di pojok kanan atas untuk mulai.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

