import { Head } from '@inertiajs/react';
import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/features-section';
import ProductPreviewSection from '@/components/product-preview-section';
import FeatureHighlightsSection from '@/components/feature-highlights-section';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Mareff - The Task Platform for Language Teachers" />

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Product Preview Section */}
            <ProductPreviewSection />

            {/* Feature Highlights Section */}
            <FeatureHighlightsSection />
        </div>
    );
}
