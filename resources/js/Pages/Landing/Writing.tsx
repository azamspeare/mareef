import { Head } from '@inertiajs/react'
import { HeroHeader } from '@/components/header'
import TaskHeroSection from '@/components/sections/task/hero-section'
import ProblemSection, { Problem } from '@/components/sections/task/problem-section'
import SolutionSection2, { Solution2 } from '@/components/sections/task/solution-section-2'
import CallToActionSection from '@/components/sections/call-to-action-section'
import FooterSection from '@/components/sections/footer-section'
import { FileText, MessageSquareMore, BarChart3, PenLine, Edit3, MessageSquare, Bell } from 'lucide-react'

const writingProblems: Problem[] = [
    {
        icon: FileText,
        title: 'Tasks lost in chats',
        description: 'Teachers assign tasks in Google Docs or chats. Students reply with documents or messages. Nothing is organized.',
    },
    {
        icon: MessageSquareMore,
        title: 'Feedback is scattered',
        description: 'Comments live in emails, Google Docs, and Telegram. Students miss corrections and repeat the same mistakes.',
    },
    {
        icon: BarChart3,
        title: 'No history or analytics',
        description: "There's no structure, no submission tracking, no way to measure progress. It's slow, manual, and frustrating.",
    },
]

const writingSolutions: Solution2[] = [
    {
        icon: PenLine,
        title: 'Structured task creation',
        description: 'Teachers create writing tasks with clear instructions, word limits, and deadlines — all in one place.',
    },
    {
        icon: Edit3,
        title: 'Built-in writing editor',
        description: 'Students write directly inside Mareef. No file uploads, no messy attachments, no lost documents.',
    },
    {
        icon: MessageSquare,
        title: 'Inline feedback & scoring',
        description: 'Teachers give feedback right on the submission. Highlight text, leave comments, assign scores.',
    },
    {
        icon: Bell,
        title: 'Instant notifications',
        description: 'Students get notified when feedback is ready. No more chasing students to check their results.',
    },
]

export default function Writing() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Writing Tasks - Mareef">
                <meta property="og:title" content="Writing Tasks - Mareef" />
                <meta property="og:description" content="No more Google Docs chaos. Create, assign, and evaluate writing tasks in one clean workflow." />
                <meta property="og:image" content="/images/og/tasks.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Writing Tasks - Mareef" />
                <meta name="twitter:description" content="No more Google Docs chaos. Create, assign, and evaluate writing tasks in one clean workflow." />
                <meta name="twitter:image" content="/images/og/tasks.png" />
            </Head>

            {/* Header */}
            <HeroHeader faqHref="/#faq" />

            {/* Main Content */}
            <main className="overflow-hidden">
                <TaskHeroSection
                    badge="Live now"
                    title="Writing assignments, finally organized."
                    description="No more Google Docs chaos or Telegram file drops.
Mareef makes writing tasks clean, trackable, and fast — for teachers and students."
                    primaryButtonText="Create Writing Task"
                    secondaryButtonText="See Example"
                    secondaryButtonHref="#features"
                    imageSrc={{
                        light: '/images/task-mockup/writing/light.png',
                        dark: '/images/task-mockup/writing/dark.png',
                    }}
                />

                {/* Problem Section */}
                <ProblemSection
                    title="Managing writing assignments is a mess"
                    subtitle="It's slow. It's manual. And no one enjoys it."
                    problems={writingProblems}
                />

                {/* Solution Section */}
                <SolutionSection2
                    headline="Mareef gives writing tasks a dedicated workflow"
                    subheadline="Every submission is saved. Every comment is tracked. Writing becomes repeatable, not chaotic."
                    solutions={writingSolutions}
                    bottomMessage="Every submission is saved. Every comment is tracked."
                />

                {/* Call to Action */}
                <CallToActionSection
                    title="Ready to clean up your writing workflow?"
                    subtitle="It takes 2 minutes to set up your first task. No friction."
                    primaryButtonText="Create a Writing Task"
                    secondaryButtonText="View Sample Submission"
                />
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    )
}
