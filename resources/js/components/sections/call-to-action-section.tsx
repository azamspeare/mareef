import { Button } from '@/components/ui/button';
import { getTeacherUrl } from '@/lib/utils';

interface CallToActionSectionProps {
    title?: string
    subtitle?: string
    primaryButtonText?: string
    primaryButtonHref?: string
    secondaryButtonText?: string
    secondaryButtonHref?: string
}

export default function CallToActionSection({
    title = 'Ready to Transform Your Teaching?',
    subtitle = 'Join teachers who are already saving hours on task management and feedback. Start free today.',
    primaryButtonText = 'Get Started for Free',
    primaryButtonHref,
    secondaryButtonText = 'View Demo',
    secondaryButtonHref,
}: CallToActionSectionProps) {
    const teacherUrl = getTeacherUrl();
    const primaryHref = primaryButtonHref || teacherUrl;
    const secondaryHref = secondaryButtonHref || teacherUrl;

    return (
        <section className="bg-muted/40 py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
                        {title}
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        {subtitle}
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg">
                            <a href={primaryHref}>
                                <span>{primaryButtonText}</span>
                            </a>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            >
                            <a href={secondaryHref}>
                                <span>{secondaryButtonText}</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
