import { Head } from '@inertiajs/react';
import HeroSection from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import ProductPreviewSection from '@/components/sections/product-preview-section';
import FeatureHighlightsSection from '@/components/sections/feature-highlights-section';
import WhyTeachersLoveSection from '@/components/sections/why-teachers-love-section';
import PricingSection from '@/components/sections/pricing-section';
import CallToActionSection from '@/components/sections/call-to-action-section';
import FaqSection from '@/components/sections/faq-section';
import FooterSection from '@/components/sections/footer-section';
import { ogImages } from '@/lib/images';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Mareef - The Task Platform for Language Teachers">
                <meta property="og:title" content="Mareef - The Task Platform for Language Teachers" />
                <meta property="og:description" content="Create, share, and evaluate language tasks. Simplify your teaching workflow with Mareef." />
                <meta property="og:image" content={ogImages.welcome} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Mareef - The Task Platform for Language Teachers" />
                <meta name="twitter:description" content="Create, share, and evaluate language tasks. Simplify your teaching workflow with Mareef." />
                <meta name="twitter:image" content={ogImages.welcome} />
            </Head>

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Product Preview Section */}
            <ProductPreviewSection />

            {/* Feature Highlights Section */}
            <FeatureHighlightsSection />

            {/* Why Teachers Love Mareef Section */}
            <WhyTeachersLoveSection />

            {/* Pricing Section */}
            <PricingSection />

            {/* Call to Action Section */}
            <CallToActionSection />

            {/* FAQ Section */}
            <FaqSection />

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
