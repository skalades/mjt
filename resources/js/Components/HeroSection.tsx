import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="relative flex h-screen items-center justify-center overflow-hidden bg-mjt-slateDark">
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero.png"
                    alt="Pabrik Molding Industri MJT"
                    className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mjt-slateDark via-mjt-slateDark/70 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-4 pt-20 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl"
                >
                    Presisi Molding untuk
                    <br />
                    <span className="text-mjt-orange drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">Keunggulan Industri</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-2xl"
                >
                    <p>
                        Mandiri Jaya Teknik (MJT) adalah pelopor spesialis pengolahan karet alam (Natural Rubber), 
                        Silikon, dan Bakelite berkualitas tinggi dengan jaminan akurasi serta durabilitas ekstra 
                        untuk seluruh sektor manufaktur dan heavy-duty machinery.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col justify-center gap-4 sm:flex-row"
                >
                    <a href="#contact" className="rounded bg-mjt-orange px-8 py-4 font-bold text-white shadow-lg shadow-mjt-orange/30 transition-all hover:bg-mjt-orangeAccent hover:shadow-xl hover:shadow-mjt-orange/50 hover:-translate-y-1 cursor-pointer inline-flex justify-center items-center">
                        Minta Penawaran (RFQ)
                    </a>
                    <a href="#portfolio" className="rounded border border-mjt-slate bg-mjt-slateDark/80 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-mjt-slate hover:-translate-y-1 cursor-pointer inline-flex justify-center items-center">
                        Lihat Portofolio Produk
                    </a>
                </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
            >
                <span className="text-sm font-semibold tracking-widest uppercase">Eksplorasi Material</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
            </motion.div>
        </section>
    );
}
