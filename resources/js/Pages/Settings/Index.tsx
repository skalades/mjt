import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Landmark, Settings2, Save, Mail, Phone, MapPin, CreditCard, Info } from 'lucide-react';

interface Setting {
    id: number;
    key: string;
    value: string;
    group: string;
}

interface Props {
    settings: Record<string, Setting[]>;
}

export default function Index({ settings }: Props) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        settings: Object.values(settings).flat().map(s => ({
            key: s.key,
            value: s.value || ''
        }))
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.update'), {
            preserveScroll: true,
        });
    };

    const handleInputChange = (key: string, value: string) => {
        const newSettings = data.settings.map(s => 
            s.key === key ? { ...s, value } : s
        );
        setData('settings', newSettings);
    };

    const getSettingValue = (key: string) => {
        return data.settings.find(s => s.key === key)?.value || '';
    };

    const renderSettingInput = (label: string, key: string, icon: any, type: string = 'text', placeholder: string = '') => (
        <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1 flex items-center gap-2">
                {icon} {label}
            </label>
            <input
                type={type}
                value={getSettingValue(key)}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
            />
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold leading-tight text-mjt-slateDark font-outfit uppercase tracking-tight">
                            Pengaturan <span className="text-mjt-orange">Sistem</span>
                        </h2>
                        <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">Konfigurasi Identitas Perusahaan & Dokumen</p>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan MJT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-10">
                        {/* Company Settings */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="p-8 bg-indigo-50 rounded-[2.5rem] border-2 border-dashed border-indigo-100 flex flex-col items-center text-center">
                                    <div className="p-5 bg-white rounded-3xl shadow-xl shadow-indigo-100 mb-6">
                                        <Building2 size={40} className="text-mjt-slate" />
                                    </div>
                                    <h3 className="text-xl font-black text-mjt-slateDark font-outfit uppercase tracking-tight mb-2">Identitas Bisnis</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Informasi ini akan digunakan sebagai kepala surat (Header) pada semua dokumen PDF seperti Invoice dan Surat Jalan.</p>
                                </div>
                            </div>
                            <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderSettingInput('Nama Perusahaan', 'company_name', <Building2 size={12} />)}
                                    {renderSettingInput('Slogan / Tagline', 'company_tagline', <Settings2 size={12} />)}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderSettingInput('Email Resmi', 'company_email', <Mail size={12} />, 'email')}
                                    {renderSettingInput('Telepon / WA', 'company_phone', <Phone size={12} />)}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderSettingInput('Website', 'company_website', <Info size={12} />)}
                                    <div className="space-y-2 md:col-span-1">
                                         {/* Reserved for logo future */}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <MapPin size={12} /> Alamat Lengkap Workshop
                                    </label>
                                    <textarea
                                        value={getSettingValue('company_address')}
                                        onChange={(e) => handleInputChange('company_address', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border-gray-100 bg-gray-50/50 p-5 text-sm font-bold focus:ring-4 focus:ring-mjt-orange/10 focus:border-mjt-orange transition-all"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Finance Settings */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="p-8 bg-green-50 rounded-[2.5rem] border-2 border-dashed border-green-100 flex flex-col items-center text-center">
                                    <div className="p-5 bg-white rounded-3xl shadow-xl shadow-green-100 mb-6">
                                        <Landmark size={40} className="text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-mjt-slateDark font-outfit uppercase tracking-tight mb-2">Informasi Pembayaran</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Detail rekening bank yang akan dicantumkan di bagian bawah Invoice untuk instruksi pembayaran klien.</p>
                                </div>
                            </div>
                            <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {renderSettingInput('Nama Bank', 'bank_name', <Landmark size={12} />)}
                                    <div className="md:col-span-2">
                                        {renderSettingInput('Nomor Rekening', 'bank_account_number', <CreditCard size={12} />)}
                                    </div>
                                </div>
                                {renderSettingInput('Nama Pemilik Rekening', 'bank_account_name', <Info size={12} />)}
                            </div>
                        </div>

                        {/* System Config */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                            <div className="lg:col-span-1">
                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
                                    <div className="p-5 bg-white rounded-3xl shadow-xl shadow-gray-100 mb-6">
                                        <Settings2 size={40} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-black text-mjt-slateDark font-outfit uppercase tracking-tight mb-2">Sistem & Penomoran</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Pengaturan teknis pembuatan dokumen otomatis.</p>
                                </div>
                            </div>
                            <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderSettingInput('Prefix Invoice', 'invoice_prefix', <Info size={12} />)}
                                    {renderSettingInput('Prefix Surat Jalan', 'do_prefix', <Info size={12} />)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-6 pt-10 border-t border-gray-100 sticky bottom-0 bg-gray-50/80 backdrop-blur-md p-6 rounded-t-[3rem] -mx-4 sm:-mx-8 z-10 shadow-2xl">
                            {recentlySuccessful && (
                                <p className="text-sm font-black text-green-600 uppercase tracking-widest animate-pulse">✓ Pengaturan Berhasil Disimpan</p>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-3 rounded-2xl bg-mjt-slate px-10 py-5 text-lg font-black font-outfit uppercase tracking-widest text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-mjt-slateDark active:scale-95 disabled:opacity-50"
                            >
                                <Save size={24} />
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
