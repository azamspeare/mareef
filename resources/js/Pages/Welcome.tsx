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

export default function Welcome() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Mareef - The Task Platform for Language Teachers" />

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
