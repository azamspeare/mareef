import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CheckCircle2, Menu, ArrowRight, FileText, Zap, ShieldCheck, LayoutDashboard, Share2, PenTool, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getTeacherUrl } from '@/lib/utils';
import { MareefLogo } from '@/components/logo';

export default function Welcome() {
    const [isOpen, setIsOpen] = useState(false);
    const teacherLoginUrl = getTeacherUrl('login');

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Mareef - The Writing Assignment Platform for Teachers" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <MareefLogo />

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
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10 bg-background">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
                    <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 opacity-30 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-purple-500/10 opacity-30 blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8 backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5 mr-2" />
                        <span className="font-bold mr-1">New</span>
                        <span>The modern way to teach writing</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2 leading-tight">
                        Writing Assignments, <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-primary">Finally Organized.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                        Mareef replaces the chaos of Google Docs and WhatsApp with a clean, unified platform for creating, collecting, and evaluating student writing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
                        <a href={teacherLoginUrl}>
                            <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                        </a>
                        <Link href="#how-it-works">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 border-primary/20 hover:border-primary/50 transition-all">
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Hero Visual Mockup */}
                    <div className="relative w-full max-w-6xl mx-auto perspective-1000">
                        <div className="relative rounded-xl border border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden transform rotate-x-6 transition-transform hover:rotate-x-0 duration-700 ease-out group ring-1 ring-white/10">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Mockup Header */}
                            <div className="h-12 border-b border-white/10 bg-black/5 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="mx-auto w-1/3 h-6 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] text-muted-foreground font-mono">mareef.uz</div>
                            </div>

                            {/* Mockup Content */}
                            <div className="p-6 md:p-10 grid md:grid-cols-[280px_1fr] gap-8 h-[500px] md:h-[600px] bg-background/40">
                                {/* Sidebar Mockup */}
                                <div className="hidden md:flex flex-col gap-6 border-r border-white/10 pr-6">
                                    <div className="h-10 w-3/4 bg-primary/20 rounded-lg mb-2 animate-pulse"></div>
                                    <div className="space-y-3">
                                        <div className="h-10 w-full bg-primary/10 text-primary rounded-lg flex items-center px-4 text-sm font-medium border border-primary/20">
                                            <LayoutDashboard className="mr-3 h-4 w-4" /> Dashboard
                                        </div>
                                        <div className="h-10 w-full hover:bg-white/5 rounded-lg flex items-center px-4 text-sm text-muted-foreground transition-colors">
                                            <FileText className="mr-3 h-4 w-4" /> Assignments
                                        </div>
                                        <div className="h-10 w-full hover:bg-white/5 rounded-lg flex items-center px-4 text-sm text-muted-foreground transition-colors">
                                            <CheckCircle2 className="mr-3 h-4 w-4" /> Submissions
                                        </div>
                                        <div className="h-10 w-full hover:bg-white/5 rounded-lg flex items-center px-4 text-sm text-muted-foreground transition-colors">
                                            <Sparkles className="mr-3 h-4 w-4" /> AI Insights
                                        </div>
                                    </div>

                                    <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10">
                                        <div className="h-2 w-full bg-white/20 rounded-full mb-2">
                                            <div className="h-full w-3/4 bg-primary rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">Storage used: 75%</div>
                                    </div>
                                </div>

                                {/* Main Content Mockup */}
                                <div className="flex flex-col gap-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="h-8 w-64 bg-white/10 rounded-lg mb-3"></div>
                                            <div className="h-4 w-48 bg-white/5 rounded-lg"></div>
                                        </div>
                                        <div className="h-10 w-32 bg-primary rounded-lg shadow-lg shadow-primary/20"></div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="border border-white/10 rounded-xl p-5 bg-white/5 shadow-sm hover:bg-white/10 transition-colors group/card cursor-pointer">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${i === 1 ? 'bg-blue-500/20 text-blue-500' : i === 2 ? 'bg-purple-500/20 text-purple-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div className="h-6 w-16 rounded-full bg-green-500/20 text-green-500 text-[10px] flex items-center justify-center font-bold">ACTIVE</div>
                                                </div>
                                                <div className="h-5 w-3/4 bg-white/10 rounded-md mb-3"></div>
                                                <div className="h-3 w-1/2 bg-white/5 rounded-md"></div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border border-white/10 rounded-xl p-1 flex-1 bg-white/5 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10"></div>
                                        <div className="h-full w-full p-6 flex flex-col gap-4">
                                            <div className="h-6 w-48 bg-white/10 rounded-md"></div>
                                            <div className="space-y-3">
                                                {[1, 2, 3, 4].map((j) => (
                                                    <div key={j} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                                                        <div className="h-10 w-10 rounded-full bg-white/10"></div>
                                                        <div className="flex-1">
                                                            <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                                                            <div className="h-3 w-24 bg-white/5 rounded"></div>
                                                        </div>
                                                        <div className="h-8 w-20 bg-white/5 rounded"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary/20 -z-10"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Teaching writing shouldn't be this hard</h2>
                        <p className="text-lg text-muted-foreground">
                            You love teaching, but the admin work is draining. We understand the struggle of managing student writing in a digital world.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FileText className="h-7 w-7 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">The "File Chaos"</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Dozens of Word docs, Google Drive links, and PDFs scattered everywhere. You spend more time finding files than grading them.
                            </p>
                        </div>

                        <div className="bg-background/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Share2 className="h-7 w-7 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">The "Submission Mess"</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Students sending homework via WhatsApp, Telegram, email, and screenshots. Keeping track of who submitted what is a nightmare.
                            </p>
                        </div>

                        <div className="bg-background/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <PenTool className="h-7 w-7 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">The "Feedback Loop"</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Adding comments in different formats, struggling to give meaningful feedback on phone screens, and students losing your corrections.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section - How it Works */}
            <section id="how-it-works" className="py-32 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Mareef in 3 Simple Steps</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We've stripped away the complexity. No learning curve, just a better workflow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-10 rounded-full"></div>

                        <div className="relative flex flex-col items-center text-center group">
                            <div className="h-32 w-32 rounded-3xl bg-background border-4 border-primary/10 shadow-2xl flex items-center justify-center mb-8 z-10 relative transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl -z-10"></div>
                                <FileText className="h-12 w-12 text-primary" />
                                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg border-4 border-background shadow-lg">1</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Create a Task</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed px-4">
                                Set up a writing assignment with clear instructions, word count limits, and due dates in seconds.
                            </p>
                        </div>

                        <div className="relative flex flex-col items-center text-center group">
                            <div className="h-32 w-32 rounded-3xl bg-background border-4 border-primary/10 shadow-2xl flex items-center justify-center mb-8 z-10 relative transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl -z-10"></div>
                                <Share2 className="h-12 w-12 text-primary" />
                                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg border-4 border-background shadow-lg">2</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Share the Link</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed px-4">
                                Copy one magic link and send it to your students via WhatsApp, Telegram, or anywhere else.
                            </p>
                        </div>

                        <div className="relative flex flex-col items-center text-center group">
                            <div className="h-32 w-32 rounded-3xl bg-background border-4 border-primary/10 shadow-2xl flex items-center justify-center mb-8 z-10 relative transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl -z-10"></div>
                                <CheckCircle2 className="h-12 w-12 text-primary" />
                                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg border-4 border-background shadow-lg">3</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Receive & Evaluate</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed px-4">
                                Submissions appear in your dashboard. Grade them, leave feedback, and track progress instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-secondary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-6">
                                Features
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                                Everything you need to manage writing tasks
                            </h2>
                            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                                Mareef is built specifically for language teachers. We've included the tools you actually need and removed the clutter you don't.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <LayoutDashboard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2">Clean Teacher Dashboard</h3>
                                        <p className="text-muted-foreground leading-relaxed">See all your classes, assignments, and pending reviews at a glance.</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <PenTool className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2">Distraction-Free Writing</h3>
                                        <p className="text-muted-foreground leading-relaxed">Students get a clean interface to write, with auto-save and word counting built in.</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2">Structured Evaluation</h3>
                                        <p className="text-muted-foreground leading-relaxed">Give scores, general feedback, and specific inline corrections easily.</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2">Block-Based Instructions</h3>
                                        <p className="text-muted-foreground leading-relaxed">Create rich instructions with text, images, and examples using our block editor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] -z-10 transform rotate-3 blur-2xl"></div>
                            <div className="bg-background/80 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-white/20">
                                <div className="h-14 border-b border-white/10 bg-muted/30 flex items-center px-6 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="p-8 space-y-6">
                                    {/* Mockup of Feature UI */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="h-8 w-40 bg-muted rounded-lg"></div>
                                            <div className="h-8 w-24 bg-green-500/10 text-green-600 rounded-lg text-xs flex items-center justify-center font-bold uppercase tracking-wider">Published</div>
                                        </div>
                                        <div className="h-4 w-full bg-muted/30 rounded"></div>
                                        <div className="h-4 w-2/3 bg-muted/30 rounded"></div>
                                    </div>

                                    <div className="border border-white/10 rounded-2xl p-5 bg-card shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-primary/10"></div>
                                                <div>
                                                    <div className="h-5 w-32 bg-muted rounded mb-1.5"></div>
                                                    <div className="h-3 w-20 bg-muted/50 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-10 w-24 bg-primary rounded-lg shadow-lg shadow-primary/20"></div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <div className="h-3 w-full bg-muted/30 rounded"></div>
                                            <div className="h-3 w-full bg-muted/30 rounded"></div>
                                            <div className="h-3 w-3/4 bg-muted/30 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="border border-white/10 rounded-2xl p-5 bg-card opacity-60">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-muted"></div>
                                                <div>
                                                    <div className="h-5 w-32 bg-muted rounded mb-1.5"></div>
                                                    <div className="h-3 w-20 bg-muted/50 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-10 w-24 bg-muted rounded-lg"></div>
                                        </div>
                                        <div className="space-y-2.5">
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

            {/* Why Teachers Love Mareef */}
            <section className="py-32 bg-primary dark:bg-secondary/10 text-primary-foreground dark:text-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 dark:to-transparent pointer-events-none"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Why Teachers Love Mareef</h2>
                        <p className="text-primary-foreground/80 dark:text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Designed by educators, for educators. We know what matters in your daily workflow.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-white/10 dark:bg-card border-white/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-md hover:bg-white/20 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 rounded-lg bg-white/20 dark:bg-primary/20">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    No Chaos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-base leading-relaxed">
                                Stop searching through chat history for files. Everything is organized by class and assignment.
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 dark:bg-card border-white/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-md hover:bg-white/20 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 rounded-lg bg-white/20 dark:bg-primary/20">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    Fast Grading
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-base leading-relaxed">
                                Grading tools are right next to the student's work. Speed up your feedback loop significantly.
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 dark:bg-card border-white/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-md hover:bg-white/20 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 rounded-lg bg-white/20 dark:bg-primary/20">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    Clean UI
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-base leading-relaxed">
                                A modern interface that feels professional and welcoming, not like a complex enterprise tool.
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 dark:bg-card border-white/20 dark:border-border text-primary-foreground dark:text-card-foreground backdrop-blur-md hover:bg-white/20 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 rounded-lg bg-white/20 dark:bg-primary/20">
                                        <LayoutDashboard className="h-5 w-5" />
                                    </div>
                                    Any Language
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-primary-foreground/80 dark:text-muted-foreground text-base leading-relaxed">
                                Whether you teach English, Spanish, Korean, or Arabic, Mareef works perfectly for you.
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
                            <AccordionTrigger className="text-lg">Is Mareef free to use?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Yes, Mareef is currently in public beta and is free for all users. We want to help as many teachers as possible streamline their workflow.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-b-muted">
                            <AccordionTrigger className="text-lg">Do students need to create an account?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Students simply log in with their Google account. This ensures their work is saved and attributed correctly without the hassle of creating a new username and password.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-b-muted">
                            <AccordionTrigger className="text-lg">Can I use Mareef for other types of assignments?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Mareef is laser-focused on <strong>writing assignments</strong>. This specialization allows us to build the best possible tools for text-based work, rather than trying to be a generic LMS.
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
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary/30 -z-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[120px] rounded-full -z-10"></div>

                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to simplify your teaching?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join other tutors who are saving time and improving their student's writing experience with Mareef.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <a href={teacherLoginUrl}>
                            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0">
                                Start for free
                            </Button>
                        </a>
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 border-primary/20 hover:border-primary/50 transition-all">
                                Learn more
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-8 text-sm text-muted-foreground">
                        No credit card required. Built for online teachers.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <MareefLogo iconSize="sm" />
                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                        </div>
                        <p className="text-sm text-muted-foreground text-center md:text-right">
                            &copy; {new Date().getFullYear()} Mareef. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
