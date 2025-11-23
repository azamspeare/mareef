import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CheckCircle2, Menu, ArrowRight, FileText, Zap, ShieldCheck, LayoutDashboard, Share2, PenTool, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Welcome() {
    const [isOpen, setIsOpen] = useState(false);
    const teacherLoginUrl = `${window.location.protocol}//${import.meta.env.VITE_APP_TEACHER_DOMAIN}/login`;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Mareff - The Writing Assignment Platform for Teachers" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-sm">M</div>
                        <span className="text-xl font-bold tracking-tight">Mareff</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
                        <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                        <div className="flex items-center gap-3 ml-2">
                            <ThemeToggle />
                            <a href={teacherLoginUrl}>
                                <Button size="sm" className="rounded-full px-6 shadow-sm hover:shadow-md transition-all">Get Started</Button>
                            </a>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col gap-6 mt-10">
                                    <Link href="#features" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Features</Link>
                                    <Link href="#how-it-works" className="text-lg font-medium" onClick={() => setIsOpen(false)}>How it Works</Link>
                                    <Link href="#faq" className="text-lg font-medium" onClick={() => setIsOpen(false)}>FAQ</Link>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium">Theme</span>
                                        <ThemeToggle />
                                    </div>
                                    <div className="h-px bg-border my-2"></div>
                                    <a href={teacherLoginUrl} onClick={() => setIsOpen(false)}>
                                        <Button className="w-full rounded-full">Get Started</Button>
                                    </a>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
                    <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 mb-8 backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-bold mr-1">New</span>
                        <span>The modern way to teach writing</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
                        Writing Assignments,<br className="hidden md:block" /> Finally Organized.
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                        Mareff replaces the chaos of Google Docs and WhatsApp with a clean, unified platform for creating, collecting, and evaluating student writing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
                        <a href={teacherLoginUrl}>
                            <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                        </a>
                        <Link href="#how-it-works">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80">
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Hero Visual Mockup */}
                    <div className="relative w-full max-w-5xl mx-auto perspective-1000">
                        <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden transform rotate-x-12 transition-transform hover:rotate-x-0 duration-700 ease-out group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Mockup Header */}
                            <div className="h-10 border-b bg-muted/20 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                                </div>
                                <div className="mx-auto w-1/3 h-5 rounded-md bg-muted/30"></div>
                            </div>

                            {/* Mockup Content Placeholder */}
                            <div className="p-6 md:p-10 grid md:grid-cols-[250px_1fr] gap-6 h-[400px] md:h-[500px] bg-background/40">
                                {/* Sidebar Mockup */}
                                <div className="hidden md:flex flex-col gap-4 border-r pr-6">
                                    <div className="h-8 w-3/4 bg-muted/40 rounded-md mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-8 w-full bg-primary/10 text-primary rounded-md flex items-center px-3 text-sm font-medium">Dashboard</div>
                                        <div className="h-8 w-full hover:bg-muted/30 rounded-md flex items-center px-3 text-sm text-muted-foreground">My Classes</div>
                                        <div className="h-8 w-full hover:bg-muted/30 rounded-md flex items-center px-3 text-sm text-muted-foreground">Assignments</div>
                                        <div className="h-8 w-full hover:bg-muted/30 rounded-md flex items-center px-3 text-sm text-muted-foreground">Students</div>
                                    </div>
                                </div>

                                {/* Main Content Mockup */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="h-8 w-48 bg-muted/60 rounded-md mb-2"></div>
                                            <div className="h-4 w-32 bg-muted/30 rounded-md"></div>
                                        </div>
                                        <div className="h-9 w-24 bg-primary rounded-md shadow-sm"></div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="border rounded-lg p-4 bg-card/50 shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                                                    <div className="h-5 w-12 rounded-full bg-green-500/10"></div>
                                                </div>
                                                <div className="h-4 w-3/4 bg-muted/60 rounded-md mb-2"></div>
                                                <div className="h-3 w-1/2 bg-muted/30 rounded-md"></div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border rounded-lg p-1 flex-1 bg-card/30">
                                        <div className="h-full w-full bg-muted/5 rounded border border-dashed flex items-center justify-center text-muted-foreground/50 text-sm">
                                            Student Submissions Chart
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-24 bg-secondary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Teaching writing shouldn't be this hard</h2>
                        <p className="text-lg text-muted-foreground">
                            You love teaching, but the admin work is draining. We understand the struggle of managing student writing in a digital world.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background/60 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-destructive/30 transition-colors group">
                            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6 text-destructive" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">The "File Chaos"</h3>
                            <p className="text-muted-foreground">
                                Dozens of Word docs, Google Drive links, and PDFs scattered everywhere. You spend more time finding files than grading them.
                            </p>
                        </div>

                        <div className="bg-background/60 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-destructive/30 transition-colors group">
                            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Share2 className="h-6 w-6 text-destructive" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">The "Submission Mess"</h3>
                            <p className="text-muted-foreground">
                                Students sending homework via WhatsApp, Telegram, email, and screenshots. Keeping track of who submitted what is a nightmare.
                            </p>
                        </div>

                        <div className="bg-background/60 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-destructive/30 transition-colors group">
                            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <PenTool className="h-6 w-6 text-destructive" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">The "Feedback Loop"</h3>
                            <p className="text-muted-foreground">
                                Adding comments in different formats, struggling to give meaningful feedback on phone screens, and students losing your corrections.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section - How it Works */}
            <section id="how-it-works" className="py-24 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Mareff in 3 Simple Steps</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We've stripped away the complexity. No learning curve, just a better workflow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -z-10"></div>

                        <div className="relative flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-2xl bg-background border-2 border-primary/20 shadow-lg flex items-center justify-center mb-6 z-10 relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-6 transition-transform group-hover:rotate-12 -z-10"></div>
                                <FileText className="h-10 w-10 text-primary" />
                                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold border-4 border-background">1</div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Create a Task</h3>
                            <p className="text-muted-foreground">
                                Set up a writing assignment with clear instructions, word count limits, and due dates in seconds.
                            </p>
                        </div>

                        <div className="relative flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-2xl bg-background border-2 border-primary/20 shadow-lg flex items-center justify-center mb-6 z-10 relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl transform -rotate-3 transition-transform group-hover:-rotate-6 -z-10"></div>
                                <Share2 className="h-10 w-10 text-primary" />
                                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold border-4 border-background">2</div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Share the Link</h3>
                            <p className="text-muted-foreground">
                                Copy one magic link and send it to your students via WhatsApp, Telegram, or anywhere else.
                            </p>
                        </div>

                        <div className="relative flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-2xl bg-background border-2 border-primary/20 shadow-lg flex items-center justify-center mb-6 z-10 relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-3 transition-transform group-hover:rotate-6 -z-10"></div>
                                <CheckCircle2 className="h-10 w-10 text-primary" />
                                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold border-4 border-background">3</div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Receive & Evaluate</h3>
                            <p className="text-muted-foreground">
                                Submissions appear in your dashboard. Grade them, leave feedback, and track progress instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-secondary/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-6">
                                Features
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                                Everything you need to manage writing tasks
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Mareff is built specifically for language teachers. We've included the tools you actually need and removed the clutter you don't.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <LayoutDashboard className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Clean Teacher Dashboard</h3>
                                        <p className="text-muted-foreground">See all your classes, assignments, and pending reviews at a glance.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <PenTool className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Distraction-Free Writing</h3>
                                        <p className="text-muted-foreground">Students get a clean interface to write, with auto-save and word counting built in.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Structured Evaluation</h3>
                                        <p className="text-muted-foreground">Give scores, general feedback, and specific inline corrections easily.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Block-Based Instructions</h3>
                                        <p className="text-muted-foreground">Create rich instructions with text, images, and examples using our block editor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] -z-10 transform rotate-3 blur-2xl"></div>
                            <div className="bg-background border rounded-[2rem] shadow-2xl overflow-hidden">
                                <div className="h-12 border-b bg-muted/30 flex items-center px-6 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-8 space-y-6">
                                    {/* Mockup of Feature UI */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="h-6 w-32 bg-muted rounded"></div>
                                            <div className="h-6 w-20 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center font-medium">Published</div>
                                        </div>
                                        <div className="h-4 w-full bg-muted/30 rounded"></div>
                                        <div className="h-4 w-2/3 bg-muted/30 rounded"></div>
                                    </div>

                                    <div className="border rounded-xl p-4 bg-card">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                                                <div>
                                                    <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                                                    <div className="h-3 w-16 bg-muted/50 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-8 w-20 bg-primary rounded"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-full bg-muted/30 rounded"></div>
                                            <div className="h-3 w-full bg-muted/30 rounded"></div>
                                            <div className="h-3 w-3/4 bg-muted/30 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="border rounded-xl p-4 bg-card opacity-60">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-muted"></div>
                                                <div>
                                                    <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                                                    <div className="h-3 w-16 bg-muted/50 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-8 w-20 bg-muted rounded"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-full bg-muted/30 rounded"></div>
                                            <div className="h-3 w-full bg-muted/30 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Teachers Love Mareff */}
            <section className="py-24 bg-primary dark:bg-secondary/10 text-primary-foreground dark:text-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Why Teachers Love Mareff</h2>
                        <p className="text-primary-foreground/80 dark:text-muted-foreground text-lg max-w-2xl mx-auto">
                            Designed by educators, for educators. We know what matters in your daily workflow.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-primary-foreground/10 dark:bg-card border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CheckCircle2 className="h-5 w-5" /> No Document Chaos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-sm">
                                Stop searching through chat history for files. Everything is organized by class and assignment.
                            </CardContent>
                        </Card>

                        <Card className="bg-primary-foreground/10 dark:bg-card border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CheckCircle2 className="h-5 w-5" /> Fast Evaluation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-sm">
                                Grading tools are right next to the student's work. Speed up your feedback loop significantly.
                            </CardContent>
                        </Card>

                        <Card className="bg-primary-foreground/10 dark:bg-card border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CheckCircle2 className="h-5 w-5" /> Clean UI
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-sm">
                                A modern interface that feels professional and welcoming, not like a complex enterprise tool.
                            </CardContent>
                        </Card>

                        <Card className="bg-primary-foreground/10 dark:bg-card border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CheckCircle2 className="h-5 w-5" /> Any Language
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-sm">
                                Whether you teach English, Spanish, Korean, or Arabic, Mareff works perfectly for you.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-muted">
                            <AccordionTrigger className="text-lg">Is Mareff free to use?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Yes, Mareff is currently in public beta and is free for all users. We want to help as many teachers as possible streamline their workflow.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-b-muted">
                            <AccordionTrigger className="text-lg">Do students need to create an account?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Students simply log in with their Google account. This ensures their work is saved and attributed correctly without the hassle of creating a new username and password.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-b-muted">
                            <AccordionTrigger className="text-lg">Can I use Mareff for other types of assignments?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Mareff is laser-focused on <strong>writing assignments</strong>. This specialization allows us to build the best possible tools for text-based work, rather than trying to be a generic LMS.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-b-muted">
                            <AccordionTrigger className="text-lg">Is my data secure?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Absolutely. We use industry-standard security practices and encryption. Authentication is handled securely via Google, so we never see or store your passwords.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary/30 -z-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/5 blur-3xl rounded-full -z-10"></div>

                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to simplify your teaching?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Join other tutors who are saving time and improving their student's writing experience with Mareff.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={teacherLoginUrl}>
                            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                                Start for free
                            </Button>
                        </a>
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full bg-background/60 backdrop-blur-sm">
                                Learn more
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        No credit card required. Built for online teachers.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">M</div>
                            <span className="font-bold text-lg">Mareff</span>
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                        </div>
                        <p className="text-sm text-muted-foreground text-center md:text-right">
                            &copy; {new Date().getFullYear()} Mareff. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
