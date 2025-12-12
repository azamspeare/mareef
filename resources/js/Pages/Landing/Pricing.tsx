import { Head } from '@inertiajs/react';
import { HeroHeader } from '@/components/header';
import PricingHeroSection from '@/components/sections/pricing/hero-section';
import ComparisonSection from '@/components/sections/pricing/comparison-section';
import FAQSection from '@/components/sections/pricing/faq-section';
import FooterSection from '@/components/sections/footer-section';

export default function Pricing() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Pricing - Mareff" />

            {/* Header */}
            <HeroHeader />

            {/* Hero Section */}
            <main className="overflow-hidden">
                <PricingHeroSection />

                {/* Comparison Section */}
                <ComparisonSection />

                {/* FAQ Section */}
                <FAQSection />
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
