import { Head } from '@inertiajs/react';
import LandingLayout from '@/Layouts/LandingLayout';
import HeroSection from '@/Components/HeroSection';
import MaterialCatalog from '@/Components/MaterialCatalog';
import ProductGallery from '@/Components/Landing/ProductGallery';
import WhyChooseUs from '@/Components/Landing/WhyChooseUs';
import Workflow from '@/Components/Landing/Workflow';
import TrustSignals from '@/Components/Landing/TrustSignals';
import ContactSection from '@/Components/Landing/ContactSection';

export default function Welcome({ auth }: { auth: any }) {
    return (
        <LandingLayout auth={auth}>
            <Head title="Mandiri Jaya Teknik - Spesialis Molding Industri" />
            <HeroSection />
            <TrustSignals />
            <MaterialCatalog />
            <ProductGallery />
            <Workflow />
            <WhyChooseUs />
            <ContactSection />
        </LandingLayout>
    );
}
