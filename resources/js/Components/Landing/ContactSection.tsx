import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, UploadCloud } from 'lucide-react';
import { useState } from 'react';

export default function ContactSection() {
    // In Phase 2, this will be replaced with Inertia's useForm hook and connected to /api/rfq
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate delay for frontend showcase
        setTimeout(() => {
            alert('Permintaan RFQ (Request For Quotation) berhasil dikirim. Tim kami akan segera menghubungi Anda.');
            setSubmitting(false);
        }, 1500);
    };

    return (
        <section id="contact" className="bg-mjt-slateDark py-24 text-white relative z-10 border-t border-mjt-slate/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                    
                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-extrabold text-slate-100 md:text-5xl">
                            Siap Merealisasikan <br/><span className="text-mjt-orange">Cetakan Presisi?</span>
                        </h2>
                        <p className="mt-6 text-lg text-slate-400">
                            Hubungi engineer kami untuk konsultasi batas fisis material, kelonggaran mekanik (mechanical allowance), hingga negosiasi penyusunan purwarupa pertama Anda.
                        </p>

                        <div className="mt-12 space-y-8">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mjt-slate text-mjt-orange">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Workshop Kami</h4>
                                    <p className="mt-1 text-slate-400">Jl. Industri Pratama No. 12, Kavling C, Kawasan Pabrik Cikarang - Bekasi 17530</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mjt-slate text-mjt-orange">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Telepon / WhatsApp</h4>
                                    <p className="mt-1 text-slate-400">+62 812-3456-7890 (Direct Hotline Teknik)</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mjt-slate text-mjt-orange">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Email Bisnis</h4>
                                    <p className="mt-1 text-slate-400">rfq@mandirijayateknik.co.id</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: RFQ Form (Fase 2 Ready) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl border border-mjt-slate bg-mjt-slate/30 p-8 shadow-2xl backdrop-blur-md sm:p-10"
                    >
                        <h3 className="mb-6 text-2xl font-bold text-white">Minta Penawaran (RFQ)</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">Nama Perusahaan / PT</label>
                                    <input type="text" required className="w-full rounded-lg border border-slate-700 bg-mjt-slateDark px-4 py-3 text-white placeholder-slate-500 focus:border-mjt-orange focus:outline-none focus:ring-1 focus:ring-mjt-orange" placeholder="PT Megatama Industri" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">Nama PIC</label>
                                    <input type="text" required className="w-full rounded-lg border border-slate-700 bg-mjt-slateDark px-4 py-3 text-white placeholder-slate-500 focus:border-mjt-orange focus:outline-none focus:ring-1 focus:ring-mjt-orange" placeholder="Budi Santoso" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">Email Utama / Kontak</label>
                                    <input type="email" required className="w-full rounded-lg border border-slate-700 bg-mjt-slateDark px-4 py-3 text-white placeholder-slate-500 focus:border-mjt-orange focus:outline-none focus:ring-1 focus:ring-mjt-orange" placeholder="email@perusahaan.com" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">Pilihan Material (Jika tahu)</label>
                                    <select className="w-full rounded-lg border border-slate-700 bg-mjt-slateDark px-4 py-3 text-slate-300 focus:border-mjt-orange focus:outline-none focus:ring-1 focus:ring-mjt-orange">
                                        <option value="">Belum Yakin (Konsultasi)</option>
                                        <option value="rubber">Natural Industrial Rubber</option>
                                        <option value="bakelite">Termoset Bakelite</option>
                                        <option value="silicone">Medical/Food Silicone</option>
                                        <option value="polyurethane">Polyurethane (Custom)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Spesifikasi Detail / Deskripsi Kebutuhan</label>
                                <textarea required rows={4} className="w-full resize-none rounded-lg border border-slate-700 bg-mjt-slateDark px-4 py-3 text-white placeholder-slate-500 focus:border-mjt-orange focus:outline-none focus:ring-1 focus:ring-mjt-orange" placeholder="Jelaskan rasio ukuran, kondisi tekanan operasi, suhu lingkungan, dsb."></textarea>
                            </div>
                            
                            {/* File Upload Mockup */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Lampirkan Cetak Biru (PDF, DWG, STEP) - Opsional</label>
                                <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-600 px-6 py-6 transition hover:border-mjt-orangeAccent hover:bg-mjt-slate/50 cursor-pointer">
                                    <div className="text-center">
                                        <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                                        <div className="mt-4 flex text-sm leading-6 text-slate-400">
                                            <span className="relative cursor-pointer rounded-md font-semibold text-mjt-orange focus-within:outline-none hover:text-mjt-orangeAccent">
                                                Pilih file
                                            </span>
                                            <p className="pl-1">atau seret dan lepas</p>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-500">Maksimal resolusi 10MB file</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full rounded-lg bg-mjt-orange px-6 py-4 text-base font-bold text-white shadow-lg shadow-mjt-orange/30 transition hover:bg-mjt-orangeAccent disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Mengirim Data...' : 'Kirim Form RFQ'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
