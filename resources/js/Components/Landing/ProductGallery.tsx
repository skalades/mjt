import { motion } from 'framer-motion';

// This acts as a static fallback, but the component is structured
// to eventually accept data directly from an API endpoint or Inertia Props in Phase 2
// interface Product { id: number; name: string; category: string; image_path: string; }

const portfolio = [
    {
        id: 1,
        name: 'O-Ring Industri Heavy-Duty',
        category: 'Karet Alam (Natural Rubber)',
        image_path: '/images/product_oring.png',
        desc: 'Diproduksi khusus menghindari kebocoran cair pada poros putar maupun panel hidrolik dengan viskositas ekstrem.'
    },
    {
        id: 2,
        name: 'Isolator & Roda Gigi Bakelite Terpresisi',
        category: 'Precision Bakelite',
        image_path: '/images/product_bakelite.png',
        desc: 'Kompleksitas rasio isolasi yang stabil menjadikannya pilihan panel operasional tegangan listrik tinggi dan perlengkapan sakelar otomotif.'
    },
    {
        id: 3,
        name: 'Seal Silikon Kelas Pangan Medis',
        category: 'Silikon (High-Temp Silicone)',
        image_path: '/images/product_silicone.png',
        desc: 'Cincin silikon fleksibel ultra-bening tanpa bau tajam. Standar farmasi untuk insulasi panas mesin pasteurisasi F&B maksimum 250 derajat celcius.'
    }
];

export default function ProductGallery() {
    return (
        <section id="portfolio" className="bg-mjt-slate py-24 text-white relative z-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold text-slate-100 md:text-5xl"
                    >
                        Portofolio Produk Jadi
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-slate-400"
                    >
                        Contoh realisasi pembuatan molding terkustomisasi hasil karya pakar teknik Mandiri Jaya Teknik.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {portfolio.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="group flex flex-col overflow-hidden rounded-2xl bg-mjt-slateDark shadow-2xl transition hover:-translate-y-2 hover:shadow-mjt-orange/10"
                        >
                            <div className="relative h-64 overflow-hidden border-b border-mjt-slate">
                                <img
                                    src={item.image_path}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 rounded-full bg-mjt-orange px-3 py-1 text-xs font-bold text-white shadow-lg">
                                    {item.category}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="mb-3 text-xl font-bold text-white">
                                    {item.name}
                                </h3>
                                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-400">
                                    {item.desc}
                                </p>
                                <button className="self-start text-sm font-semibold text-mjt-orange transition hover:text-mjt-orangeAccent flex items-center gap-2">
                                    Selengkapnya 
                                    <span aria-hidden="true">&rarr;</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
