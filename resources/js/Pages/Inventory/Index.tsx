import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Search, Box, History, Pencil, Trash2, X, Save, Printer, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import Modal from '@/Components/Modal';
import { formatIDR } from '@/Utils/format';
import CurrencyInput from '@/Components/CurrencyInput';
import { InventoryItem, PaginatedResponse } from '@/types';

interface Props {
    items: PaginatedResponse<InventoryItem>;
    filters?: { search?: string };
}

export default function Index({ items, filters = {} }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        sku: '',
        name: '',
        unit: 'Kg',
        purchase_price: 0,
        initial_stock: 0,
        min_stock_threshold: 10,
    });

    const adjustForm = useForm({
        type: 'IN',
        quantity: '',
        notes: '',
    });

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(route('inventory.index'),
                { search: value },
                { preserveState: true, replace: true }
            );
        }, 500),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item: InventoryItem) => {
        setEditingItem(item);
        setData({
            sku: item.sku,
            name: item.name,
            unit: item.unit,
            purchase_price: item.purchase_price,
            initial_stock: 0,
            min_stock_threshold: item.min_stock_threshold,
        });
        setIsModalOpen(true);
    };

    const openAdjustModal = (item: InventoryItem) => {
        setSelectedItem(item);
        adjustForm.reset();
        setIsAdjustModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('inventory.update', editingItem.id), { onSuccess: () => closeModal() });
        } else {
            post(route('inventory.store'), { onSuccess: () => closeModal() });
        }
    };

    const submitAdjustment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        adjustForm.post(route('inventory.adjust', selectedItem.id), {
            onSuccess: () => {
                setIsAdjustModalOpen(false);
                adjustForm.reset();
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        reset();
    };

    const deleteItem = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang ini? Riwayat transaksi akan tetap ada.')) {
            destroy(route('inventory.destroy', id));
        }
    };

    const isLowStock = (item: InventoryItem) => {
        return (item.current_stock ?? 0) <= item.min_stock_threshold;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Gudang</h2>
                    <div className="flex gap-3">
                        <a href={route('documents.inventory-report')} target="_blank"
                            className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-white border-2 border-gray-100 px-6 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-95">
                            <Printer size={18} /> Laporan Stok
                        </a>
                        <button onClick={openCreateModal}
                            className="inline-flex items-center gap-2 rounded-2xl bg-mjt-slate px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-mjt-slateDark active:scale-95">
                            <Plus size={18} /> Tambah Barang
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Gudang" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600"><Box size={24} /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Jenis Barang</p>
                                    <p className="text-2xl font-bold text-gray-900">{items.data.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-lg font-bold text-mjt-slate">Daftar Stok Barang</h3>
                            <div className="relative w-full sm:w-64 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mjt-orange transition-colors" size={18} />
                                <input type="text" value={search} onChange={handleSearchChange}
                                    placeholder="Cari SKU atau Nama..."
                                    className="w-full rounded-xl border-gray-200 pl-10 text-sm focus:border-mjt-orange focus:ring-mjt-orange" />
                            </div>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Barang</th>
                                        <th className="px-6 py-4">SKU</th>
                                        <th className="px-6 py-4">Harga Beli</th>
                                        <th className="px-6 py-4 text-center">Stok Saat Ini</th>
                                        <th className="px-6 py-4">Satuan</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {items.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 group-hover:text-mjt-orange transition-colors">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.sku}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 font-mono italic">{formatIDR(item.purchase_price)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 font-bold font-mono text-sm px-3 py-1 rounded-lg ${
                                                    isLowStock(item)
                                                        ? 'text-red-600 bg-red-50 border border-red-100'
                                                        : 'text-green-700 bg-green-50 border border-green-100'
                                                }`}>
                                                    {isLowStock(item) && <AlertTriangle size={14} />}
                                                    {Number(item.current_stock ?? 0).toFixed(1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">{item.unit}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openAdjustModal(item)}
                                                        title="Update Stok"
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                        <History size={18} />
                                                    </button>
                                                    <button onClick={() => openEditModal(item)}
                                                        title="Edit Data"
                                                        className="p-2 text-gray-400 hover:text-mjt-orange hover:bg-orange-50 rounded-lg transition-all">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => deleteItem(item.id)}
                                                        title="Hapus"
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden divide-y divide-gray-100">
                            {items.data.map((item) => (
                                <div key={item.id} className="p-4 active:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <p className="text-[10px] font-mono text-gray-400 uppercase">{item.sku}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                            isLowStock(item)
                                                ? 'text-red-600 bg-red-50 border-red-100'
                                                : 'text-green-700 bg-green-50 border-green-100'
                                        }`}>
                                            {isLowStock(item) && <AlertTriangle size={10} />}
                                            {Number(item.current_stock ?? 0).toFixed(1)} {item.unit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs mt-4">
                                        <div className="text-gray-500">Harga: <span className="font-bold text-gray-900">{formatIDR(item.purchase_price)}</span></div>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => openAdjustModal(item)} className="font-bold text-indigo-600">Stok</button>
                                            <button onClick={() => openEditModal(item)} className="font-bold text-mjt-orange">Edit</button>
                                            <button onClick={() => deleteItem(item.id)} className="font-bold text-red-400">Hapus</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CRUD Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Box size={20} className="text-indigo-600" />
                            {editingItem ? 'Edit Barang' : 'Tambah Barang Baru'}
                        </h3>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">SKU / Kode Barang</label>
                            <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)}
                                className="w-full rounded-lg border-gray-200 text-sm font-mono" placeholder="MISAL: RBR-SIL-01" required />
                            {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border-gray-200 text-sm" placeholder="Nama lengkap bahan/barang" required />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Harga Beli per Unit</label>
                            <CurrencyInput value={data.purchase_price} onChange={(val) => setData('purchase_price', val)}
                                className="w-full rounded-lg border-gray-200 text-sm font-mono" placeholder="0" required />
                            {errors.purchase_price && <p className="mt-1 text-xs text-red-500">{errors.purchase_price}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Satuan</label>
                                <select value={data.unit} onChange={(e) => setData('unit', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 text-sm">
                                    <option value="Kg">Kg</option>
                                    <option value="Gram">Gram</option>
                                    <option value="Pcs">Pcs</option>
                                    <option value="Liter">Liter</option>
                                    <option value="Roll">Roll</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Batas Minimum</label>
                                <input type="number" value={data.min_stock_threshold} onChange={(e) => setData('min_stock_threshold', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border-gray-200 text-sm" />
                            </div>
                        </div>
                        {!editingItem && (
                            <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                                <label className="block text-sm font-bold text-indigo-700 mb-1">Stok Awal (Opsional)</label>
                                <input type="number" value={data.initial_stock} onChange={(e) => setData('initial_stock', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border-indigo-200 text-sm" placeholder="0" />
                                <p className="mt-1 text-[10px] text-indigo-500 italic">Input stok awal akan otomatis mencatat mutasi stok "Masuk".</p>
                            </div>
                        )}
                        <div className="mt-8 flex justify-end gap-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Batal</button>
                            <button type="submit" disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50">
                                <Save size={18} /> {editingItem ? 'Simpan Perubahan' : 'Tambah Barang'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Adjustment Modal */}
            <Modal show={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <History size={20} className="text-indigo-600" />
                            Update Stok: {selectedItem?.name}
                        </h3>
                        <button onClick={() => setIsAdjustModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={submitAdjustment} className="space-y-6">
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button
                                type="button"
                                onClick={() => adjustForm.setData('type', 'IN')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${adjustForm.data.type === 'IN' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-green-600'}`}
                            >
                                <ArrowDownCircle size={18} /> Barang Masuk
                            </button>
                            <button
                                type="button"
                                onClick={() => adjustForm.setData('type', 'OUT')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${adjustForm.data.type === 'OUT' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-red-500'}`}
                            >
                                <ArrowUpCircle size={18} /> Barang Keluar
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah ({selectedItem?.unit})</label>
                            <input
                                type="number"
                                step="0.01"
                                value={adjustForm.data.quantity}
                                onChange={(e) => adjustForm.setData('quantity', e.target.value)}
                                className="w-full rounded-xl border-gray-200 text-lg font-bold"
                                placeholder="0.00"
                                required
                            />
                            {adjustForm.errors.quantity && <p className="mt-1 text-xs text-red-500">{adjustForm.errors.quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Keterangan / Alasan</label>
                            <textarea
                                value={adjustForm.data.notes}
                                onChange={(e) => adjustForm.setData('notes', e.target.value)}
                                className="w-full rounded-xl border-gray-200 text-sm"
                                placeholder="Misal: Stok datang dari supplier / Rusak / Buang"
                                rows={3}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={adjustForm.processing}
                                className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 ${adjustForm.data.type === 'IN' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}
                            >
                                {adjustForm.processing ? 'Memproses...' : 'Simpan Perubahan Stok'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
