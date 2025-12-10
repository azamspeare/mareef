import { Button } from '@/components/ui/button';

export default function CallToActionSection() {
    const teacherDomain = import.meta.env.VITE_APP_TEACHER_DOMAIN || '#';

    return (
        <section className="bg-muted/40 py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
                        Ready to Transform Your Teaching?
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        Join teachers who are already saving hours on task management and feedback. Start free today.
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg">
                            <a href={teacherDomain}>
                                <span>Get Started for Free</span>
                            </a>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            >
                            <a href={teacherDomain}>
                                <span>View Demo</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
