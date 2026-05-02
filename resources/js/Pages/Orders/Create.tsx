import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft, Search, Package, Check, X, AlertCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import CurrencyInput from '@/Components/CurrencyInput';
import Modal from '@/Components/Modal';
import { formatIDR } from '@/Utils/format';

interface OrderItemInput {
    item_name: string;
    quantity: number;
    unit_price: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Props {
    products: Product[];
}

export default function Create({ products }: Props) {
    const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
    const [catalogSearch, setCatalogSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        client_name: '',
        order_number: `ORD-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`,
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

    const openCatalog = (index: number) => {
        setActiveRowIndex(index);
        setCatalogSearch('');
        setIsCatalogModalOpen(true);
    };

    const selectProduct = (product: Product) => {
        if (activeRowIndex !== null) {
            const newItems = [...data.items];
            newItems[activeRowIndex] = {
                ...newItems[activeRowIndex],
                item_name: product.name,
                unit_price: product.price,
            };
            setData('items', newItems);
            setIsCatalogModalOpen(false);
            setActiveRowIndex(null);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(catalogSearch.toLowerCase())
        );
    }, [products, catalogSearch]);

    const totalAmount = data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'), {
            onError: (err) => {
                console.error('Validation Errors:', err);
                // Highlight the first error for the user
                const firstError = Object.values(err)[0];
                alert('Gagal menyimpan: ' + firstError);
            },
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('orders.index')} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-xl font-bold leading-tight text-mjt-slateDark font-outfit uppercase tracking-tight">
                        Buat Pesanan <span className="text-mjt-orange italic">Baru</span>
                    </h2>
                </div>
            }
        >
            <Head title="Buat Pesanan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-bold text-red-800">Terdapat kesalahan input:</p>
                                <ul className="mt-1 list-disc list-inside text-xs text-red-600 font-medium">
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Header Info */}
                        <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Nama Klien / Instansi</label>
                                <input
                                    type="text"
                                    value={data.client_name}
                                    onChange={(e) => setData('client_name', e.target.value)}
                                    className={`w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all ${errors.client_name ? 'border-red-300 bg-red-50/30' : ''}`}
                                    placeholder="Contoh: CV. ALBASI"
                                />
                                {errors.client_name && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase flex items-center gap-1"><AlertCircle size={10} /> {errors.client_name}</p>}
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Nomor Pesanan</label>
                                    <input
                                        type="text"
                                        value={data.order_number}
                                        readOnly
                                        className="w-full rounded-2xl border-gray-100 bg-gray-50 text-gray-400 font-mono py-4 px-6 text-sm"
                                    />
                                    {errors.order_number && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase">{errors.order_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Deadline (Due Date)</label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-[2.5rem] bg-white shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-lg font-black text-mjt-slate font-outfit uppercase tracking-tight">Item Produk</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-all active:scale-95"
                                >
                                    <Plus size={16} />
                                    Tambah Baris
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 font-outfit">
                                        <tr>
                                            <th className="px-8 py-5 w-1/4">Nama Produk / Jasa</th>
                                            <th className="px-8 py-5 w-44 text-center">Jumlah</th>
                                            <th className="px-8 py-5 w-48 text-right">Harga Satuan</th>
                                            <th className="px-8 py-5 w-48 text-right">Subtotal</th>
                                            <th className="px-8 py-5 w-20 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.items.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-6 relative">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={item.item_name}
                                                            readOnly
                                                            onClick={() => openCatalog(index)}
                                                            className={`w-full rounded-xl border-gray-100 bg-white py-3 px-4 text-sm font-bold text-mjt-slate cursor-pointer focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-gray-300 pr-10 ${errors[`items.${index}.item_name` as keyof typeof errors] ? 'border-red-300 bg-red-50/30' : ''}`}
                                                            placeholder="Klik untuk pilih produk..."
                                                        />
                                                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                                    </div>
                                                    {errors[`items.${index}.item_name` as keyof typeof errors] && (
                                                        <p className="mt-1 text-[9px] font-bold text-red-500 uppercase">Wajib diisi</p>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        min="1"
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                        className={`w-full rounded-xl border-gray-100 bg-gray-50 text-center text-sm font-black focus:ring-4 focus:ring-indigo-500/10 px-2 py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors[`items.${index}.quantity` as keyof typeof errors] ? 'border-red-300' : ''}`}
                                                    />
                                                </td>
                                                <td className="px-8 py-6">
                                                    <CurrencyInput
                                                        value={item.unit_price}
                                                        onChange={(val) => handleItemChange(index, 'unit_price', val)}
                                                        className={`w-full rounded-xl border-gray-100 bg-gray-50 text-right text-sm font-mono font-bold focus:ring-4 focus:ring-indigo-500/10 ${errors[`items.${index}.unit_price` as keyof typeof errors] ? 'border-red-300' : ''}`}
                                                    />
                                                </td>
                                                <td className="px-8 py-6 text-right font-mono text-mjt-slate font-black text-base italic">
                                                    {formatIDR(item.quantity * item.unit_price).replace('Rp', '')}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-mjt-slate text-white">
                                        <tr>
                                            <td colSpan={3} className="px-8 py-6 text-right font-black uppercase text-[10px] tracking-[0.2em]">Total Keseluruhan</td>
                                            <td className="px-8 py-6 text-right font-black text-2xl font-outfit italic text-mjt-orange">
                                                {formatIDR(totalAmount)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-6 pt-4">
                            <Link
                                href={route('orders.index')}
                                className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-mjt-slate transition-colors"
                            >
                                Batalkan
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-3 rounded-2xl bg-mjt-orange px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-orange-100 hover:bg-mjt-orangeAccent disabled:opacity-50 transition-all active:scale-95"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Memproses...
                                    </div>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Simpan Pesanan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Catalog Modal */}
            <Modal show={isCatalogModalOpen} onClose={() => setIsCatalogModalOpen(false)} maxWidth="2xl">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-mjt-slateDark font-outfit uppercase tracking-tight flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <Package size={24} />
                            </div>
                            Katalog <span className="text-mjt-orange italic">Produk</span>
                        </h3>
                        <button 
                            onClick={() => setIsCatalogModalOpen(false)} 
                            className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="relative mb-8 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-mjt-orange transition-colors" size={20} />
                        <input
                            type="text"
                            value={catalogSearch}
                            onChange={(e) => setCatalogSearch(e.target.value)}
                            placeholder="Cari nama produk di katalog..."
                            className="w-full rounded-2xl border-gray-100 bg-gray-50 py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 gap-3">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => selectProduct(product)}
                                    className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:border-mjt-orange hover:shadow-lg hover:shadow-orange-50 transition-all group text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-10 bg-gray-100 group-hover:bg-mjt-orange rounded-full transition-colors"></div>
                                        <div>
                                            <div className="font-black text-mjt-slate uppercase tracking-tight font-outfit group-hover:text-mjt-orange transition-colors">
                                                {product.name}
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-gray-500">
                                                ID: PROD-{product.id.toString().padStart(3, '0')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-sm font-black font-mono text-indigo-600 group-hover:scale-110 transition-transform origin-right">
                                                {formatIDR(product.price)}
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Harga Standar</div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-mjt-orange text-white p-2 rounded-xl">
                                            <Check size={16} />
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="text-gray-300 italic text-sm">Produk tidak ditemukan...</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Menampilkan {filteredProducts.length} dari {products.length} produk katalog
                        </p>
                    </div>
                </div>
            </Modal>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
