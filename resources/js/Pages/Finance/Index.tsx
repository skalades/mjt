import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Wallet, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, X, Save, ArrowDownLeft, ArrowUpRight, Printer } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    transactions: {
        data: Array<{
            id: number;
            type: string;
            category: string;
            amount: number;
            payment_method: string;
            status: string;
            maturity_date?: string;
            reference_number?: string;
            notes?: string;
            transaction_date: string;
        }>;
    };
    stats: {
        total_balance: number;
        pending_giro: number;
    };
}

const statusIcons: any = {
    SUCCESS: <CheckCircle2 className="text-green-500" size={16} />,
    PENDING: <Clock className="text-orange-500" size={16} />,
    REJECTED: <XCircle className="text-red-500" size={16} />,
};

import { formatIDR, formatDate } from '@/Utils/format';

export default function Index({ transactions, stats }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'IN',
        category: 'CAPITAL',
        amount: 0,
        payment_method: 'CASH',
        transaction_date: new Date().toISOString().split('T')[0],
        maturity_date: '',
        source: '',
        reference_number: '',
        notes: '',
    });

    const openModal = (type: 'IN' | 'OUT') => {
        reset();
        setData({
            ...data,
            type: type,
            category: type === 'IN' ? 'CAPITAL' : 'OPERATIONAL'
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('finance.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold leading-tight text-mjt-slateDark font-outfit uppercase tracking-tight">
                        Ringkasan <span className="text-mjt-orange">Keuangan</span>
                    </h2>
                    <div className="flex gap-3">
                        <a
                            href={route('documents.finance-report')}
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-white border-2 border-gray-100 px-6 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
                        >
                            <Printer size={18} />
                            Export Buku Besar
                        </a>
                        <button
                            onClick={() => openModal('OUT')}
                            className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-white border-2 border-red-50 px-6 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-50 active:scale-95"
                        >
                            <ArrowUpRight size={18} />
                            Catat Pengeluaran
                        </button>
                        <button
                            onClick={() => openModal('IN')}
                            className="inline-flex items-center gap-2 rounded-2xl bg-mjt-slate px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-mjt-slateDark active:scale-95"
                        >
                            <ArrowDownLeft size={18} />
                            Uang Masuk
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Keuangan MJT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Financial Summary */}
                    <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-[2rem] bg-mjt-slate p-8 text-white shadow-2xl relative overflow-hidden group border-b-8 border-mjt-orange transition-transform hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <Wallet size={28} className="text-mjt-orange" />
                                </div>
                                <span className="text-[10px] font-black bg-orange-500/20 text-mjt-orange px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-500/30">Total Saldo Terverifikasi</span>
                            </div>
                            <p className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest mb-1">CASH ON HAND & BANK</p>
                            <p className="text-4xl font-extrabold font-outfit tracking-tight">{formatIDR(stats.total_balance)}</p>
                            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:rotate-12 transition-transform">
                                <TrendingUp size={160} />
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100 relative group transition-transform hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-indigo-50 rounded-2xl">
                                    <Clock size={28} className="text-indigo-500" />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-100">Dalam Proses Kliring</span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">CEK & GIRO (PENDING)</p>
                            <p className="text-4xl font-extrabold text-mjt-slateDark font-outfit tracking-tight">{formatIDR(stats.pending_giro)}</p>
                            <div className="absolute right-[-20px] top-[-20px] opacity-5">
                                <TrendingDown size={140} />
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-gray-100">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-mjt-slateDark font-outfit uppercase tracking-tight">Riwayat Buku Besar</h3>
                            <div className="flex gap-2 sm:hidden">
                                <button onClick={() => openModal('OUT')} className="p-2 bg-red-50 text-red-600 rounded-lg">
                                    <TrendingDown size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 font-outfit">
                                    <tr>
                                        <th className="px-8 py-5">Tgl Transaksi</th>
                                        <th className="px-8 py-5">Deskripsi / Kategori</th>
                                        <th className="px-8 py-5">Pembayaran & Ref</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right font-bold">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.data.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 text-gray-400 text-xs font-bold uppercase">
                                                {formatDate(tx.transaction_date)}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-mjt-slateDark uppercase text-[11px] mb-1 font-outfit tracking-tight">{tx.category.replace(/_/g, ' ')}</div>
                                                <div className="text-xs text-gray-500 font-medium">{tx.notes || '-'}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-mjt-slate text-xs font-black uppercase tracking-tight">{tx.payment_method}</div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-1 font-bold">{tx.reference_number || '-'}</div>
                                                {tx.maturity_date && (
                                                    <div className="mt-1 text-[9px] font-bold text-orange-500 uppercase tracking-widest">Tempo: {tx.maturity_date}</div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    {statusIcons[tx.status]}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{tx.status}</span>
                                                </div>
                                            </td>
                                            <td className={`px-8 py-6 text-right font-black font-outfit text-base ${tx.type === 'IN' ? 'text-green-600' : 'text-red-500'}`}>
                                                {tx.type === 'IN' ? '+' : '-'} {formatIDR(tx.amount).replace('Rp', '')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden divide-y divide-gray-50">
                            {transactions.data.map((tx) => (
                                <div key={tx.id} className="p-6 active:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{formatDate(tx.transaction_date)}</div>
                                            <h4 className="font-black text-mjt-slateDark text-sm uppercase tracking-tight font-outfit">{tx.category.replace(/_/g, ' ')}</h4>
                                        </div>
                                        <div className={`text-sm font-black font-outfit ${tx.type === 'IN' ? 'text-green-600' : 'text-red-500'}`}>
                                            {tx.type === 'IN' ? '+' : '-'} {formatIDR(tx.amount).replace('Rp', '')}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-tighter">
                                                {tx.payment_method}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {statusIcons[tx.status]}
                                                <span className="text-[9px] font-black uppercase tracking-widest">{tx.status}</span>
                                            </div>
                                        </div>
                                        {tx.reference_number && <div className="text-[10px] font-mono text-gray-400">#{tx.reference_number}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Transaction Modal - Enhanced */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-mjt-slateDark font-outfit uppercase tracking-tight flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${data.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {data.type === 'IN' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                            </div>
                            {data.type === 'IN' ? 'Uang Masuk' : 'Catat Pengeluaran'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Kategori Transaksi</label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold uppercase focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
                                >
                                    {data.type === 'IN' ? (
                                        <>
                                            <option value="CAPITAL">Modal Awal / Investasi</option>
                                            <option value="ORDER_PAYMENT">Pelunasan Pesanan</option>
                                            <option value="OTHER">Pemasukan Lainnya</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="OPERATIONAL">Beban Operasional</option>
                                            <option value="SALARY">Gaji / Upah Karyawan</option>
                                            <option value="MATERIAL_PURCHASE">Pembelian Bahan Baku</option>
                                            <option value="OTHER">Pengeluaran Lainnya</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Nominal Transaksi (Rp)</label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">Rp</span>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', parseInt(e.target.value) || 0)}
                                        className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-5 text-xl font-black font-outfit text-mjt-slateDark focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                {errors.amount && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.amount}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Metode Pembayaran</label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all uppercase"
                                >
                                    <option value="CASH">Tunai (Cash)</option>
                                    <option value="TRANSFER_MANDIRI">Transfer Bank Mandiri</option>
                                    <option value="TRANSFER_BCA">Transfer Bank BCA</option>
                                    <option value="CHEQUE">Cek Fisik</option>
                                    <option value="GIRO">Bilyet Giro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Tanggal & Waktu</label>
                                <input
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
                                />
                            </div>
                        </div>

                        {(data.payment_method === 'GIRO' || data.payment_method === 'CHEQUE') && (
                            <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-4">
                                <p className="text-[10px] font-black text-mjt-orange uppercase tracking-widest mb-2">Informasi Kliring (B2B)</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold uppercase text-orange-400 tracking-wider">Tgl Jatuh Tempo</label>
                                        <input
                                            type="date"
                                            value={data.maturity_date}
                                            onChange={(e) => setData('maturity_date', e.target.value)}
                                            className="w-full rounded-xl border-orange-100 bg-white py-3 text-sm font-bold focus:ring-mjt-orange focus:border-mjt-orange"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold uppercase text-orange-400 tracking-wider">No. Referensi / Seri</label>
                                        <input
                                            type="text"
                                            value={data.reference_number}
                                            onChange={(e) => setData('reference_number', e.target.value)}
                                            className="w-full rounded-xl border-orange-100 bg-white py-3 text-sm font-bold uppercase placeholder:text-gray-300"
                                            placeholder="GIR-XXXXX"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Catatan Tambahan</label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 p-5 text-sm placeholder:text-gray-300 focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
                                placeholder="Tuliskan keterangan lebih lanjut jika perlu..."
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full flex items-center justify-center gap-3 rounded-2xl py-5 text-lg font-black font-outfit uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 ${
                                    data.type === 'IN' ? 'bg-mjt-slate shadow-indigo-200 hover:bg-mjt-slateDark' : 'bg-red-600 shadow-red-100 hover:bg-red-700'
                                }`}
                            >
                                <Save size={20} />
                                Konfirmasi Transaksi
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

