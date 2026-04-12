import { motion } from 'framer-motion';
import { CarFront, Stethoscope, Factory, Coffee } from 'lucide-react';

const industries = [
    { name: 'Otomotif & Transportasi', icon: CarFront },
    { name: 'Alat Berat & Heavy Machinery', icon: Factory },
    { name: 'Kesehatan & Alat Medis', icon: Stethoscope },
    { name: 'Makanan & Minuman (F&B)', icon: Coffee },
];

export default function TrustSignals() {
    return (
        <section className="bg-mjt-slate py-20 text-white relative z-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:w-1/3 text-center md:text-left"
                    >
                        <h2 className="text-3xl font-extrabold text-slate-100">
                            Kepercayaan Lintas <span className="text-mjt-orange">Industri</span>
                        </h2>
                        <p className="mt-4 text-slate-400">
                            Spesialisasi dan fleksibilitas kami menjadikan fabrikasi Mandiri Jaya Teknik diandalkan oleh berbagai lanskap pabrikan perakitan krusial di seluruh Indonesia.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {industries.map((industry, i) => {
                            const Icon = industry.icon;
                            return (
                                <div key={industry.name} className="flex flex-col items-center justify-center gap-3 rounded-xl bg-mjt-slateDark/50 p-6 border border-mjt-slate transition-all hover:bg-mjt-slateDark hover:border-mjt-orangeAccent">
                                    <Icon size={32} className="text-slate-300" strokeWidth={1.5} />
                                    <span className="text-center text-sm font-semibold text-slate-200">{industry.name}</span>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
