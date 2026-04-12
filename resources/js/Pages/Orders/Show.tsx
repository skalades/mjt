import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, ShoppingBag, Wallet, CheckCircle2, History, Plus, X, Save, Printer, FileText, Truck } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    order: {
        id: number;
        order_number: string;
        client_name: string;
        status: string;
        payment_status: string;
        total_amount: number;
        paid_amount: number;
        due_date: string;
        items: Array<{
            id: number;
            item_name: string;
            quantity: number;
            unit_price: number;
            subtotal: number;
        }>;
        finance_transactions: Array<{
            id: number;
            amount: number;
            payment_method: string;
            status: string;
            transaction_date: string;
            reference_number: string;
        }>;
    };
}

import { formatIDR, formatDate } from '@/Utils/format';

export default function Show({ order }: Props) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: order.total_amount - order.paid_amount,
        payment_method: 'TRANSFER_MANDIRI',
        transaction_date: new Date().toISOString().split('T')[0],
        maturity_date: '',
        reference_number: '',
        notes: `Pembayaran untuk ${order.order_number}`,
    });

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.payment', order.id), {
            onSuccess: () => {
                setIsPaymentModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('orders.index')} className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Pesanan {order.order_number}
                    </h2>
                </div>
            }
        >
            <Head title={`Order ${order.order_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Order Info & Items */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Informasi Klien</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{order.client_name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 font-medium italic">
                                            <Clock size={16} /> Deadline: {formatDate(order.due_date)}
                                        </div>
                                    </div>
                                    <div className="text-right sm:text-right">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Status Produksi</p>
                                        <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700 border border-indigo-100">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShoppingBag size={18} className="text-indigo-600" />
                                    Daftar Item
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3">Deskripsi Barang</th>
                                                <th className="px-4 py-3 text-center">Qty</th>
                                                <th className="px-4 py-3 text-right">Harga</th>
                                                <th className="px-4 py-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {order.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-4 font-medium text-gray-900">{item.item_name}</td>
                                                    <td className="px-4 py-4 text-center text-gray-600">{item.quantity}</td>
                                                    <td className="px-4 py-4 text-right text-gray-600 font-mono">{formatIDR(item.unit_price)}</td>
                                                    <td className="px-4 py-4 text-right font-bold text-gray-900 font-mono">{formatIDR(item.subtotal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50/50">
                                            <tr>
                                                <td colSpan={3} className="px-4 py-4 text-right font-bold text-gray-500 uppercase text-xs">Total Tagihan</td>
                                                <td className="px-4 py-4 text-right font-bold text-xl text-indigo-600 font-mono italic">
                                                    {formatIDR(order.total_amount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <History size={18} className="text-indigo-600" />
                                    Riwayat Pembayaran
                                </h4>
                                <div className="space-y-4">
                                    {order.finance_transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{formatIDR(tx.amount)}</p>
                                                    <p className="text-xs text-gray-500 italic mt-0.5">{formatDate(tx.transaction_date)} • {tx.payment_method} {tx.reference_number ? `(${tx.reference_number})` : ''}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase border border-green-200 text-green-600 px-2 py-0.5 rounded-full">
                                                {tx.status}
                                            </span>
                                        </div>
                                    ))}
                                    {order.finance_transactions.length === 0 && (
                                        <p className="text-center py-8 text-sm text-gray-400 italic">Belum ada riwayat pembayaran untuk pesanan ini.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Widgets */}
                        <div className="space-y-6">
                            {/* Payment Widget */}
                            <div className="rounded-2xl bg-indigo-900 p-8 text-white shadow-xl shadow-indigo-200">
                                <div className="flex items-center justify-between mb-8">
                                    <Wallet size={24} className="text-indigo-300" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                                        Ringkasan Kas
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-indigo-300 text-xs font-bold uppercase mb-1">Status Pembayaran</p>
                                        <p className="text-xl font-bold tracking-tight">{order.payment_status}</p>
                                    </div>
                                    <div className="h-px bg-white/10"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-indigo-300 text-[10px] font-bold uppercase mb-1">Sudah Dibayar</p>
                                            <p className="text-lg font-bold font-mono">{formatIDR(order.paid_amount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/50 text-[10px] font-bold uppercase mb-1">Sisa Tagihan</p>
                                            <p className="text-lg font-bold font-mono text-orange-400">
                                                {formatIDR(order.total_amount - order.paid_amount)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {order.paid_amount < order.total_amount && (
                                        <button 
                                            onClick={() => setIsPaymentModalOpen(true)}
                                            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg border border-indigo-500 hover:bg-indigo-500 transition-all active:scale-95"
                                        >
                                            <Plus size={18} />
                                            Catat Pembayaran
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Documents Widget */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <Printer size={20} className="text-orange-500" />
                                    <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">Dokumen & Cetak</h4>
                                </div>
                                <div className="space-y-3">
                                    <a 
                                        href={route('documents.invoice', order.id)}
                                        target="_blank"
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-orange-50 hover:border-orange-100 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText size={18} className="text-gray-400 group-hover:text-orange-500" />
                                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">Proforma Invoice</span>
                                        </div>
                                        <Plus size={14} className="text-gray-300" />
                                    </a>
                                    <a 
                                        href={route('documents.delivery-order', order.id)}
                                        target="_blank"
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Truck size={18} className="text-gray-400 group-hover:text-indigo-600" />
                                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">Surat Jalan (DO)</span>
                                        </div>
                                        <Plus size={14} className="text-gray-300" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal show={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} maxWidth="md">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <Wallet size={24} className="text-indigo-600" />
                            Tambah Pembayaran
                        </h3>
                        <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={submitPayment} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-widest pl-1">Besar Pembayaran (Rp)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/3 text-lg font-bold text-indigo-600">Rp</span>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 py-4 pl-12 text-2xl font-bold font-mono focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
                                />
                            </div>
                            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-widest pl-1">Metode</label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="w-full rounded-xl border-gray-100 text-sm font-bold py-3 focus:ring-4 focus:ring-indigo-500/10"
                                >
                                    <option value="CASH">Tunai (Cash)</option>
                                    <option value="TRANSFER_MANDIRI">Bank Mandiri</option>
                                    <option value="TRANSFER_BCA">Bank BCA</option>
                                    <option value="CHEQUE">Cek Fisik</option>
                                    <option value="GIRO">Bilyet Giro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-widest pl-1">Tgl Transaksi</label>
                                <input
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    className="w-full rounded-xl border-gray-100 text-sm font-bold py-3 focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>
                        </div>

                        {(data.payment_method === 'CHEQUE' || data.payment_method === 'GIRO') && (
                            <div className="rounded-2xl border-2 border-dashed border-indigo-100 p-5 bg-indigo-50/30">
                                <label className="block text-xs font-bold uppercase text-indigo-600 mb-1.5 tracking-widest pl-1">Jatuh Tempo (Cek/Giro)</label>
                                <input
                                    type="date"
                                    value={data.maturity_date}
                                    onChange={(e) => setData('maturity_date', e.target.value)}
                                    className="w-full rounded-xl border-indigo-200 text-sm font-bold py-3"
                                    required
                                />
                                <p className="mt-2 text-[10px] text-indigo-500 italic">Transaksi akan berstatus "PENDING" hingga tanggal kliring.</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-widest pl-1">Keterangan / Ref #</label>
                            <input
                                type="text"
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                                placeholder="Contoh: Ref 8827 / No. Cek ABC"
                                className="w-full rounded-xl border-gray-100 text-sm py-3"
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Save size={20} />
                                Konfirmasi Pembayaran
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
