import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Settings, ShieldCheck, AlertCircle, Trash2, Pencil, X, Save, Database, MapPin } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    molds: {
        data: Array<{
            id: number;
            name: string;
            mold_code: string;
            client_name: string;
            total_shots: number;
            status: string;
            location: string;
        }>;
    };
}

const statusConfig: any = {
    ACTIVE: { color: 'text-green-700 bg-green-50 border-green-200', icon: ShieldCheck },
    MAINTENANCE: { color: 'text-orange-700 bg-orange-50 border-orange-200', icon: Settings },
    RETIRED: { color: 'text-red-700 bg-red-50 border-red-200', icon: Trash2 },
};

export default function Index({ molds }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMold, setEditingMold] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        mold_code: '',
        client_name: '',
        location: '',
        status: 'ACTIVE',
    });

    const openCreateModal = () => {
        setEditingMold(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (mold: any) => {
        setEditingMold(mold);
        setData({
            name: mold.name,
            mold_code: mold.mold_code,
            client_name: mold.client_name || '',
            location: mold.location || '',
            status: mold.status,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMold) {
            put(route('molds.update', editingMold.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('molds.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMold(null);
        reset();
    };

    const deleteMold = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus cetakan ini?')) {
            destroy(route('molds.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold leading-tight text-mjt-slateDark font-outfit uppercase tracking-tight">
                        Aset <span className="text-mjt-orange">Cetakan</span>
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-2xl bg-mjt-orange px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-100 transition-all hover:bg-mjt-orangeAccent active:scale-95"
                    >
                        <Plus size={18} />
                        Daftarkan Aset
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Cetakan MJT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Grid of Molds */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {molds.data.map((mold) => {
                            const config = statusConfig[mold.status] || { color: 'text-gray-700 bg-gray-50', icon: AlertCircle };
                            const Icon = config.icon;
                            
                            return (
                                <div key={mold.id} className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-tight">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`rounded-2xl p-4 border-2 ${config.color.split(' ')[0]} ${config.color.split(' ')[1]} ${config.color.split(' ')[2]}`}>
                                            <Icon size={28} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${config.color}`}>
                                            {mold.status}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-mjt-slateDark group-hover:text-mjt-orange transition-colors font-outfit tracking-tight">
                                        {mold.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1.5 tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-mjt-orange"></div>
                                        KODE: {mold.mold_code}
                                    </p>
                                    
                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Klien Pemilik</div>
                                            <div className="text-xs font-black text-mjt-slateDark">{mold.client_name || 'INTERNAL MJT'}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-neutral-50 rounded-xl border border-gray-100">
                                                <div className="text-[9px] font-bold text-gray-400 uppercase mb-1">Total Produksi</div>
                                                <div className="text-sm font-black text-indigo-600 font-outfit tracking-tight">{mold.total_shots.toLocaleString()} Shots</div>
                                            </div>
                                            <div className="p-3 bg-neutral-50 rounded-xl border border-gray-100">
                                                <div className="text-[9px] font-bold text-gray-400 uppercase mb-1">Lokasi Rak</div>
                                                <div className="text-sm font-black text-mjt-slateDark truncate"><MapPin size={12} className="inline mr-1 text-orange-400" /> {mold.location || '-'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <button 
                                            onClick={() => openEditModal(mold)}
                                            className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-indigo-600 hover:text-indigo-800 uppercase"
                                        >
                                            <Pencil size={16} />
                                            Update
                                        </button>
                                        <button 
                                            onClick={() => deleteMold(mold.id)}
                                            className="p-2 text-gray-200 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {molds.data.length === 0 && (
                            <div className="col-span-full rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center">
                                <Database className="mx-auto h-16 w-16 text-gray-100 mb-6" />
                                <h3 className="text-2xl font-black text-gray-300 font-outfit uppercase tracking-tight">Data Aset Kosong</h3>
                                <p className="text-sm text-gray-300 mt-2">Daftarkan cetakan/mold baru untuk memantau siklus hidup produksi.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CRUD Modal - Premium Style */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-mjt-slateDark font-outfit uppercase tracking-tight flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <Settings size={28} />
                            </div>
                            {editingMold ? 'Edit Cetakan' : 'Daftarkan Aset'}
                        </h3>
                        <button onClick={closeModal} className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Nama Aset / Cetakan</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all placeholder:text-gray-300"
                                    placeholder="Contoh: Cetakan Gear Motor A"
                                    required
                                />
                                {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Kode Unik Mold</label>
                                <input
                                    type="text"
                                    value={data.mold_code}
                                    onChange={(e) => setData('mold_code', e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-black font-mono uppercase focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all placeholder:text-gray-300"
                                    placeholder="MLD-XXXX"
                                    required
                                />
                                {errors.mold_code && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.mold_code}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Pemilik / Klien</label>
                            <input
                                type="text"
                                value={data.client_name}
                                onChange={(e) => setData('client_name', e.target.value)}
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all placeholder:text-gray-300"
                                placeholder="Kosongkan jika milik Internal"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Lokasi Penyimpanan</label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all placeholder:text-gray-300"
                                    placeholder="Rak / Gudang"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Status Operasional</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold uppercase focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
                                >
                                    <option value="ACTIVE">Aktif (Operasional)</option>
                                    <option value="MAINTENANCE">Dalam Perbaikan</option>
                                    <option value="RETIRED">Pensiun (Retired)</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-mjt-slate shadow-2xl shadow-indigo-100 py-5 text-lg font-black font-outfit uppercase tracking-widest text-white transition-all hover:bg-mjt-slateDark active:scale-95 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {editingMold ? 'Simpan Perubahan' : 'Daftarkan Aset'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

