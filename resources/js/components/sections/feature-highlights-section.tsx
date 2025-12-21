import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BookOpen, MessageSquare, LayoutGrid, Sparkles } from 'lucide-react'
import { ThemedImage } from '@/components/themed-image'
import { featureMockups } from '@/lib/images'

export default function FeatureHighlightsSection() {
    return (
        <section className="bg-muted/40 py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center mb-12">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl">Designed for how you actually teach</h2>
                    <p className="text-muted-foreground mt-4">Every feature built with language teachers in mind.</p>
                </div>

                <div className="mx-auto grid gap-2 sm:grid-cols-5">
                    {/* Card 1: Built for Language Teachers */}
                    <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
                        <CardHeader>
                            <div className="md:p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex size-8 items-center justify-center rounded-full border">
                                        <BookOpen className="size-4" />
                                    </div>
                                    <p className="font-medium">Built for Language Teachers</p>
                                </div>
                                <p className="text-muted-foreground text-sm">Create writing, reading, listening, and speaking tasks. Task flows designed for async or classroom use with a structured creation → submission → evaluation loop.</p>
                            </div>
                        </CardHeader>

                        <div className="relative h-fit pl-6 md:pl-12">
                            <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2">
                                <ThemedImage
                                    src={featureMockups.languageTeachers}
                                    alt="Task creation interface"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Card 2: Feedback Made Simple */}
                    <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
                        <CardHeader className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex size-8 items-center justify-center rounded-full border">
                                    <MessageSquare className="size-4" />
                                </div>
                                <p className="font-medium">Feedback Made Simple</p>
                            </div>
                            <p className="text-muted-foreground text-sm">Inline comments and highlights. Score input with feedback notes. Email notifications for both teacher and student.</p>
                        </CardHeader>

                        <CardContent className="mt-auto h-fit">
                            <div className="relative">
                                <div className="overflow-hidden rounded-lg border">
                                    <ThemedImage
                                        src={featureMockups.feedbackSimple}
                                        alt="Evaluation interface"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3: Organized by Default */}
                    <Card className="group p-6 shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-8">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex size-8 items-center justify-center rounded-full border">
                                <LayoutGrid className="size-4" />
                            </div>
                            <p className="font-medium">Organized by Default</p>
                        </div>
                        <p className="text-muted-foreground text-sm mb-8">All tasks and submissions in one dashboard. Filter by status: Not Reviewed, Evaluated. Full history of feedback per student.</p>

                        <div className="flex justify-center gap-3">
                            <div className="rounded-lg border bg-background px-4 py-2 text-sm font-medium shadow-sm">Not Reviewed</div>
                            <div className="rounded-lg border bg-foreground text-background px-4 py-2 text-sm font-medium shadow-sm">Evaluated</div>
                        </div>
                    </Card>

                    {/* Card 4: Time-Saving Automations */}
                    <Card className="group relative shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
                        <CardHeader className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex size-8 items-center justify-center rounded-full border">
                                    <Sparkles className="size-4" />
                                </div>
                                <p className="font-medium">Time-Saving Automations</p>
                                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">Premium</span>
                            </div>
                            <p className="text-muted-foreground text-sm">Auto-grading for quizzes (reading/listening). AI task generator and AI feedback assistant coming soon.</p>
                        </CardHeader>
                        <CardContent className="relative h-fit px-6 pb-6 md:px-8 md:pb-8">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-lg border bg-background p-4 text-center">
                                    <p className="text-2xl font-semibold">AI</p>
                                    <p className="text-xs text-muted-foreground mt-1">Task Generator</p>
                                </div>
                                <div className="rounded-lg border bg-background p-4 text-center">
                                    <p className="text-2xl font-semibold">Auto</p>
                                    <p className="text-xs text-muted-foreground mt-1">Grading</p>
                                </div>
                                <div className="rounded-lg border bg-background p-4 text-center">
                                    <p className="text-2xl font-semibold">AI</p>
                                    <p className="text-xs text-muted-foreground mt-1">Feedback</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Writing task flow is fully live. Other task types and automation tools are coming soon.
                </p>
            </div>
        </section>
    )
}
