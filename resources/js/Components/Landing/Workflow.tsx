import { motion } from 'framer-motion';
import { PenTool, Settings, Boxes, Truck } from 'lucide-react';

const steps = [
    {
        title: 'Konsultasi & Penawaran',
        desc: 'Kami menerima permintaan penawaran (RFQ) dan cetak biru CAD Anda. Tim teknis berdiskusi mengenai kebutuhan spesifikasi material & batas toleransi mekanis.',
        icon: PenTool,
    },
    {
        title: 'Desain Molding & Purwarupa',
        desc: 'Pembuatan master cetakan logam atau molding khusus serta pencetakan sampel awal (prototyping) agar klien dapat meninjau kualitas presisi sebelum diproduksi.',
        icon: Settings,
    },
    {
        title: 'Produksi Massal',
        desc: 'Memanfaatkan mesin vulkanisasi bertekanan mutakhir, bahan mentah kemudian mulai dicetak massal untuk menghasilkan bagian presisi dengan tingkat kesalahan minimal.',
        icon: Boxes,
    },
    {
        title: 'Quality Assurance & Ekspedisi',
        desc: 'Produksi akhir melewati penjaminan mutu sangat teliti. Pengemasan dilakukan secara profesional sehingga sampai di lokasi perakitan persis tepat waktu.',
        icon: Truck,
    },
];

export default function Workflow() {
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
                        Proses Kerja Kami
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-slate-400"
                    >
                        Lintasan transparan, terukur, dan tersistem mulai dari konsepsi hingga pengiriman di tangan Anda.
                    </motion.p>
                </div>

                <div className="relative mt-20">
                    {/* Horizontal Connector Line for Desktop */}
                    <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-mjt-slate" />

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    className="relative flex flex-col items-center text-center"
                                >
                                    <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-mjt-slateDark bg-mjt-slate text-mjt-orangeAccent shadow-2xl transition hover:scale-110 hover:bg-mjt-orange hover:text-white duration-300">
                                        <Icon size={40} />
                                    </div>
                                    <div className="mt-8 flex flex-col items-center">
                                        <div className="mb-4 inline-flex h-8 items-center justify-center rounded-full bg-mjt-slate px-4 text-sm font-bold text-slate-300">
                                            Tahap {i + 1}
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-slate-100">
                                            {step.title}
                                        </h3>
                                        <p className="text-base text-slate-400">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
