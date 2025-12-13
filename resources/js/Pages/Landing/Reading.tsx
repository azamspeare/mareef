import { Head } from '@inertiajs/react'
import { HeroHeader } from '@/components/header'
import TaskHeroSection from '@/components/sections/task/hero-section'
import ProblemSection, { Problem } from '@/components/sections/task/problem-section'
import SolutionSection2, { Solution2 } from '@/components/sections/task/solution-section-2'
import CallToActionSection from '@/components/sections/call-to-action-section'
import FooterSection from '@/components/sections/footer-section'
import { Toaster } from '@/components/ui/sonner'
import { FileText, ClipboardList, BarChart3, Upload, ListChecks, Timer } from 'lucide-react'

const readingProblems: Problem[] = [
    {
        icon: FileText,
        title: 'Paper printouts everywhere',
        description: "Teachers manually prepare PDFs or scans. Students return messy answers. It's tedious and outdated.",
    },
    {
        icon: ClipboardList,
        title: 'Hours spent grading',
        description: 'Each comprehension task takes hours to check by hand. No shortcuts, no automation.',
    },
    {
        icon: BarChart3,
        title: 'No data or tracking',
        description: "There's no history, no analytics, no way to measure student progress over time.",
    },
]

const readingSolutions: Solution2[] = [
    {
        icon: Upload,
        title: 'Upload or write directly',
        description: 'Upload your reading material or write it directly in the editor. No more PDFs or scans.',
    },
    {
        icon: ListChecks,
        title: 'Multiple question types',
        description: 'Add multiple choice, fill-in-the-blank, or short answer questions all in one task.',
    },
    {
        icon: Timer,
        title: 'Timed reading sessions',
        description: 'Set timers or reading durations. Students answer inside the task no separate docs.',
    },
    {
        icon: BarChart3,
        title: 'Auto-grading & analytics',
        description: 'Auto-grade close-ended questions. Feedback and analytics built-in for every task.',
    },
]

export default function Reading() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Reading Tasks - Mareef" />

            {/* Header */}
            <HeroHeader faqHref="/#faq" />

            {/* Main Content */}
            <main className="overflow-hidden">
                <TaskHeroSection
                    badge="Coming soon"
                    title="Reading tasks, without the paperwork."
                    description="No more printing 50 worksheets and checking them by hand. Mareef's upcoming Reading Tasks will let you build, assign, and auto-grade comprehension tasks all in one flow."
                    primaryButtonText="Join Waitlist"
                    isWaitlist={true}
                    imageSrc={{
                        light: '/images/dashboard-mockups/light.png',
                        dark: '/images/dashboard-mockups/dark.png',
                    }}
                />

                {/* Problem Section */}
                <ProblemSection
                    title="Reading comprehension is still stuck in 2005"
                    subtitle="In 2025, this still eats up hours a week."
                    problems={readingProblems}
                />

                {/* Solution Section */}
                <SolutionSection2
                    headline="Mareef's Reading Tasks will change that"
                    subheadline="Designed to feel like a real classroom worksheet but smarter."
                    solutions={readingSolutions}
                    bottomMessage="Designed to feel like a real classroom worksheetbut smarter."
                />

                {/* Call to Action */}
                <CallToActionSection
                    title="Want early access to Reading Tasks?"
                    subtitle="You'll be the first to test it when it launches."
                    primaryButtonText="Join Waitlist"
                    secondaryButtonText="Explore Writing Tasks Now"
                    secondaryButtonHref="/tasks/writing"
                    isWaitlist={true}
                />
            </main>

            {/* Footer */}
            <FooterSection />

            {/* Toast notifications */}
            <Toaster position="bottom-right" />
        </div>
    )
}
