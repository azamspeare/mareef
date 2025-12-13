import { Card, CardContent } from '@/components/ui/card'
import { Zap, PenLine, MessageSquareText, BarChart3, Layers } from 'lucide-react'

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-32 bg-background">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl">Everything you need to manage tasks</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Built specifically for language teachers who want structure without complexity.</p>
                </div>

                <div className="relative mt-12">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        {/* Card 1: One-Click Task Creation */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <Zap className="m-auto size-5" strokeWidth={1.5} />
                                </div>
                                <div className="mt-6 space-y-2">
                                    <h3 className="text-lg font-medium">One-Click Task Creation</h3>
                                    <p className="text-muted-foreground text-sm">Create structured assignments with media, time limits, and clear instructions — in under 2 minutes.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 2: Built-In Student Workspace */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <PenLine className="m-auto size-5" strokeWidth={1.5} />
                                </div>
                                <div className="mt-6 space-y-2">
                                    <h3 className="text-lg font-medium">Built-In Student Workspace</h3>
                                    <p className="text-muted-foreground text-sm">Students write, record, or respond directly in Mareef. No file uploads. No external tools.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3: Inline Feedback Tools */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <MessageSquareText className="m-auto size-5" strokeWidth={1.5} />
                                </div>
                                <div className="mt-6 space-y-2">
                                    <h3 className="text-lg font-medium">Inline Feedback Tools</h3>
                                    <p className="text-muted-foreground text-sm">Highlight, comment, and score right on the submission. Every response is reviewable anytime.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 4: Smart Analytics - Coming Soon */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <BarChart3 className="m-auto size-5" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-medium">Smart Analytics</h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Track class-wide performance, see completion rates, and spot struggling students instantly.</p>
                                    </div>
                                </div>
                                <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 sm:ml-6">
                                    <div className="absolute left-3 top-2 flex gap-1">
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                    </div>
                                    {/* Mini chart visualization */}
                                    <div className="mt-6 flex items-end gap-1.5 h-24">
                                        <div className="flex-1 bg-muted rounded-t h-[40%]"></div>
                                        <div className="flex-1 bg-muted rounded-t h-[65%]"></div>
                                        <div className="flex-1 bg-muted rounded-t h-[45%]"></div>
                                        <div className="flex-1 bg-foreground/20 rounded-t h-[80%]"></div>
                                        <div className="flex-1 bg-muted rounded-t h-[55%]"></div>
                                        <div className="flex-1 bg-muted rounded-t h-[70%]"></div>
                                        <div className="flex-1 bg-muted rounded-t h-[50%]"></div>
                                    </div>
                                    <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                                        <span>Mon</span>
                                        <span>Sun</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 5: Supports All Task Types */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Layers className="m-auto size-5" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">Supports All Task Types</h3>
                                        <p className="text-muted-foreground text-sm">Writing live now. Reading, Listening, and Speaking coming soon — all built for language classrooms.</p>
                                    </div>
                                </div>
                                <div className="relative mt-6 sm:-my-6 sm:-mr-6">
                                    {/* Center vertical line */}
                                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border"></div>

                                    <div className="relative flex h-full flex-col justify-center space-y-3 py-6">
                                        {/* Writing - left side */}
                                        <div className="flex items-center pr-[50%]">
                                            <div className="flex-1 flex justify-end pr-3">
                                                <span className="rounded-full border bg-foreground text-background px-3 py-1 text-xs font-medium shadow-sm">Writing</span>
                                            </div>
                                            <div className="size-2 rounded-full bg-foreground ring-4 ring-background -mr-1"></div>
                                        </div>
                                        {/* Reading - right side */}
                                        <div className="flex items-center pl-[50%]">
                                            <div className="size-2 rounded-full bg-muted-foreground/40 ring-4 ring-background -ml-1"></div>
                                            <div className="flex-1 pl-3">
                                                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground shadow-sm">Reading</span>
                                            </div>
                                        </div>
                                        {/* Listening - left side */}
                                        <div className="flex items-center pr-[50%]">
                                            <div className="flex-1 flex justify-end pr-3">
                                                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground shadow-sm">Listening</span>
                                            </div>
                                            <div className="size-2 rounded-full bg-muted-foreground/40 ring-4 ring-background -mr-1"></div>
                                        </div>
                                        {/* Speaking - right side */}
                                        <div className="flex items-center pl-[50%]">
                                            <div className="size-2 rounded-full bg-muted-foreground/40 ring-4 ring-background -ml-1"></div>
                                            <div className="flex-1 pl-3">
                                                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground shadow-sm">Speaking</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
