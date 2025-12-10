import { Clock, Brain, Heart, RefreshCw } from 'lucide-react';

export default function WhyTeachersLoveSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto flex flex-col px-6 md:grid md:max-w-5xl md:grid-cols-2 md:gap-12">
                    <div className="order-last mt-6 flex flex-col gap-12 md:order-first">
                        <div className="space-y-6">
                            <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
                                Why Teachers Love Mareff
                            </h2>
                            <p className="text-muted-foreground">
                                Designed specifically for language teachers who want to spend less time on admin and more time on what matters — teaching.
                            </p>
                        </div>

                        <div className="mt-auto grid grid-cols-[auto_1fr] gap-3">
                            <div className="bg-background flex aspect-square size-12 items-center justify-center rounded-lg border">
                                <Heart className="size-6 text-primary" />
                            </div>
                            <blockquote>
                                <p className="text-muted-foreground italic">
                                    "I used to dread writing assignments. Now I look forward to reviewing them."
                                </p>
                                <div className="mt-2 flex gap-2 text-sm">
                                    <cite className="font-medium not-italic">Beta User</cite>
                                    <p className="text-muted-foreground">Private English Tutor</p>
                                </div>
                            </blockquote>
                        </div>
                    </div>

                    <div className="-mx-6 px-6 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] sm:mx-auto sm:max-w-md md:-mx-6 md:ml-auto md:mr-0">
                        <div className="bg-background dark:bg-muted/50 rounded-2xl border p-3 shadow-lg md:pb-12">
                            <div className="grid grid-cols-2 gap-2">
                                <FeatureCard
                                    icon={<Clock className="size-6 text-primary" />}
                                    name="Saves Hours"
                                    description="No more downloading files, marking by hand, or replying in chat threads. Cut grading time in half."
                                />
                                <FeatureCard
                                    icon={<Brain className="size-6 text-primary" />}
                                    name="Reduces Stress"
                                    description="Everything in one place — tasks, submissions, feedback, history. Never lose track of anything."
                                />
                                <FeatureCard
                                    icon={<Heart className="size-6 text-primary" />}
                                    name="Built for Teachers"
                                    description="Task types that match how you actually teach — writing, speaking, reading, listening."
                                />
                                <FeatureCard
                                    icon={<RefreshCw className="size-6 text-primary" />}
                                    name="Better Learning"
                                    description="Faster feedback means better outcomes. Students get clearer guidance, instantly."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const FeatureCard = ({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) => {
    return (
        <div className="hover:bg-muted dark:hover:bg-muted/50 space-y-4 rounded-lg border p-4 transition-colors">
            <div className="flex size-fit items-center justify-center">{icon}</div>
            <div className="space-y-1">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-muted-foreground line-clamp-3 text-sm">{description}</p>
            </div>
        </div>
    );
};
