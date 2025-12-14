import { Head } from '@inertiajs/react';
import { HeroHeader } from '@/components/header';
import PricingHeroSection from '@/components/sections/pricing/hero-section';
import ComparisonSection from '@/components/sections/pricing/comparison-section';
import FAQSection from '@/components/sections/pricing/faq-section';
import FooterSection from '@/components/sections/footer-section';

export default function Pricing() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Pricing - Mareef">
                <meta property="og:title" content="Pricing - Mareef" />
                <meta property="og:description" content="Simple, transparent pricing for language teachers. Start free, upgrade when you need more." />
                <meta property="og:image" content="/images/og/pricing.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Pricing - Mareef" />
                <meta name="twitter:description" content="Simple, transparent pricing for language teachers. Start free, upgrade when you need more." />
                <meta name="twitter:image" content="/images/og/pricing.png" />
            </Head>

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
