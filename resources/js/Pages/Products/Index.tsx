import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit2, Save, X, Package } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { formatIDR } from '@/Utils/format';
import CurrencyInput from '@/Components/CurrencyInput';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    is_active: boolean;
}

interface Props {
    products: Product[];
}

export default function Index({ products }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        description: '',
        price: 0,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            is_active: product.is_active,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            put(route('products.update', editingProduct.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const deleteProduct = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
            destroy(route('products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 uppercase tracking-tight">
                        Katalog <span className="text-mjt-orange italic">Produk</span>
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Tambah Produk
                    </button>
                </div>
            }
        >
            <Head title="Katalog Produk" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Nama Produk</th>
                                        <th className="px-6 py-4">Deskripsi</th>
                                        <th className="px-6 py-4">Harga Standar</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                                                        <Package size={18} />
                                                    </div>
                                                    <span className="font-bold text-gray-900">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {product.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-mjt-slate">
                                                {formatIDR(product.price)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tight ${product.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400'}`}>
                                                    {product.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                                Belum ada produk di katalog. Klik "Tambah Produk" untuk memulai.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <Package size={24} className="text-indigo-600" />
                        {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h3>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-widest pl-1">Nama Produk</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-xl border-gray-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-bold"
                                placeholder="Contoh: Mold Silikon 4 Cavity"
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-widest pl-1">Harga Standar (Rp)</label>
                            <CurrencyInput
                                value={data.price}
                                onChange={(val) => setData('price', val)}
                                className="w-full rounded-xl border-gray-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-mono font-bold"
                                required
                            />
                            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-widest pl-1">Deskripsi / Spesifikasi</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-xl border-gray-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm"
                                rows={3}
                                placeholder="Detail bahan, ukuran, atau catatan teknis..."
                            />
                        </div>

                        <div className="pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-2 px-8 py-3 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                <Save size={18} className="inline mr-2" />
                                {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
