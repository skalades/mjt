import { motion } from 'framer-motion';

const materials = [
    {
        name: 'Industrial Rubber',
        desc: 'Karet alam berstandar tinggi yang menawarkan elastisitas superior, daya tahan robek maksimal, dan penyusutan minimal. Sempurna untuk O-ring tugas berat, seal industri, gasket, dan komponen peredam getaran.',
        img: '/images/rubber.png',
    },
    {
        name: 'Precision Bakelite',
        desc: 'Material plastik termoseting andalan untuk beban mekanis tinggi. Memiliki ketahanan panas ekstrem dan isolasi listrik luar biasa, sering digunakan pada industri otomotif, alat berat, dan panel kontrol listrik.',
        img: '/images/bakelite.png',
    },
    {
        name: 'High-Temp Silicone',
        desc: 'Material silikon transparan hingga berwarna dengan kelenturan tinggi. Tahan terhadap degradasi kimia, cairan korosif, steril, dan suhu mesin panas. Digunakan secara luas di industri medis, mesin F&B, dan manufaktur bersih.',
        img: '/images/silicone.png',
    },
];

export default function MaterialCatalog() {
    return (
        <section id="materials" className="relative z-10 bg-mjt-slateDark py-24 text-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold text-slate-100 md:text-5xl"
                    >
                        Katalog Material Kami
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-slate-400"
                    >
                        Diproses dengan tingkat toleransi spesifik untuk memenuhi standar kekerasan cetakan industri Anda.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-12 border-t border-mjt-slate/50 pt-16 md:grid-cols-3">
                    {materials.map((m, i) => (
                        <motion.div
                            key={m.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            className="group overflow-hidden rounded-2xl border border-mjt-slate bg-mjt-slateDark transition-all duration-300 hover:border-mjt-orangeAccent/50 hover:shadow-2xl hover:shadow-mjt-orange/10"
                        >
                            <div className="relative h-72 w-full overflow-hidden">
                                <img
                                    src={m.img}
                                    alt={m.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-mjt-slateDark via-mjt-slateDark/40 to-transparent" />
                            </div>
                            <div className="relative z-20 -mt-20 p-8">
                                <h3 className="mb-4 text-2xl font-bold text-white drop-shadow-md">
                                    {m.name}
                                </h3>
                                <p className="text-base leading-relaxed text-slate-300">{m.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
