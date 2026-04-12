import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface OrderItemInput {
    item_name: string;
    quantity: number;
    unit_price: number;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        order_number: `ORD-${Date.now().toString().slice(-6)}`,
        due_date: '',
        items: [{ item_name: '', quantity: 1, unit_price: 0 }] as OrderItemInput[],
    });

    const addItem = () => {
        setData('items', [...data.items, { item_name: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = [...data.items];
            newItems.splice(index, 1);
            setData('items', newItems);
        }
    };

    const handleItemChange = (index: number, field: keyof OrderItemInput, value: string | number) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const totalAmount = data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('orders.index')} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Buat Pesanan Baru
                    </h2>
                </div>
            }
        >
            <Head title="Buat Pesanan" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Header Info */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klien / Instansi</label>
                                <input
                                    type="text"
                                    value={data.client_name}
                                    onChange={(e) => setData('client_name', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Contoh: PT. Maju Jaya"
                                />
                                {errors.client_name && <p className="mt-1 text-xs text-red-500">{errors.client_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Pesanan</label>
                                <input
                                    type="text"
                                    value={data.order_number}
                                    onChange={(e) => setData('order_number', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tenggat Waktu (Due Date)</label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Item Produk</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <Plus size={18} />
                                    Tambah Baris
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Nama Produk / Jasa</th>
                                            <th className="px-6 py-3 w-24">Jumlah</th>
                                            <th className="px-6 py-3 w-40">Harga Satuan</th>
                                            <th className="px-6 py-3 w-40">Subtotal</th>
                                            <th className="px-6 py-3 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={item.item_name}
                                                        onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                                                        className="w-full rounded-md border-gray-100 text-sm focus:border-indigo-300 focus:ring-indigo-200"
                                                        placeholder="Contoh: Mold Silikon 4 Cavity"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        min="1"
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-md border-gray-100 text-sm text-center"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs text-indigo-600 font-bold">Rp</span>
                                                        <input
                                                            type="number"
                                                            value={item.unit_price}
                                                            onChange={(e) => handleItemChange(index, 'unit_price', parseInt(e.target.value) || 0)}
                                                            className="w-full rounded-md border-gray-100 pl-8 text-sm text-right"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-gray-700 font-bold">
                                                    {(item.quantity * item.unit_price).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50/50">
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-500">Total Keseluruhan</td>
                                            <td className="px-6 py-4 text-right font-bold text-lg text-indigo-600 font-mono">
                                                Rp {totalAmount.toLocaleString('id-ID')}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href={route('orders.index')}
                                className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all active:scale-95"
                            >
                                <Save size={18} />
                                Simpan Pesanan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
