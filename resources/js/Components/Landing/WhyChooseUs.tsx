import { motion } from 'framer-motion';
import { Target, ShieldCheck, Factory, Award } from 'lucide-react';

const reasons = [
    {
        title: 'Akurasi Presisi Tinggi',
        desc: 'Dilengkapi dengan sistem CNC dan molding termutakhir untuk mencapai toleransi dimensi seketat mungkin sesuai dengan rancangan industri aslinya.',
        icon: Target,
    },
    {
        title: 'Durabilitas Material Utama',
        desc: 'Hanya menggunakan bahan polimer dan elastomer kualitas terbaik yang tahan lama, tahan suhu ekstrem, serta bahan kimia korosif.',
        icon: ShieldCheck,
    },
    {
        title: 'Kapasitas Produksi Besar',
        desc: 'Mampu menangani pesanan mulai dari purwarupa tunggal (prototyping) hingga produksi massal berskala besar dengan jadwal pengiriman akurat.',
        icon: Factory,
    },
    {
        title: 'Quality Control Ketat',
        desc: 'Setiap komponen melewati inspeksi visual dan pengukuran mekanis yang ketat guna menekan tingkat cacat produk mendekati nol persen.',
        icon: Award,
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-mjt-slateDark py-24 text-white relative z-10 border-t border-mjt-slate/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold text-slate-100 md:text-5xl"
                    >
                        Keunggulan <span className="text-mjt-orange">Mandiri Jaya Teknik</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto"
                    >
                        Mitra terpercaya berbagai sektor krusial. Kami memberikan yang terbaik demi kelancaran operasional permesinan Anda tanpa kompromi.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {reasons.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group rounded-2xl border border-mjt-slate bg-mjt-slate/20 p-8 transition-colors hover:border-mjt-orange/50 hover:bg-mjt-slate/40"
                            >
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-mjt-slate text-mjt-orange group-hover:bg-mjt-orange group-hover:text-white transition-colors duration-300">
                                    <Icon size={28} />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-200">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-400">
                                    {item.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
