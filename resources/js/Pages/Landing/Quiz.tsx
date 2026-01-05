import { Head } from '@inertiajs/react'
import { HeroHeader } from '@/components/header'
import TaskHeroSection from '@/components/sections/task/hero-section'
import ProblemSection, { Problem } from '@/components/sections/task/problem-section'
import SolutionSection2, { Solution2 } from '@/components/sections/task/solution-section-2'
import CallToActionSection from '@/components/sections/call-to-action-section'
import FooterSection from '@/components/sections/footer-section'
import { ogImages, dashboardMockups } from '@/lib/images'
import { FileSpreadsheet, Link2, RefreshCw, ClipboardCheck, Zap, BarChart3, Bell } from 'lucide-react'

const quizProblems: Problem[] = [
    {
        icon: FileSpreadsheet,
        title: 'Quizzes scattered everywhere',
        description: 'Teachers create quizzes in Google Forms, Word, or paper. Submissions live in emails, spreadsheets, and chat apps.',
    },
    {
        icon: Link2,
        title: 'Manual link & answer management',
        description: 'Sharing links, collecting responses, and matching answers to students is tedious and error-prone.',
    },
    {
        icon: RefreshCw,
        title: 'Re-checking results manually',
        description: 'Even for simple multiple choice, teachers spend hours checking answers instead of teaching.',
    },
]

const quizSolutions: Solution2[] = [
    {
        icon: ClipboardCheck,
        title: 'Create quizzes in minutes',
        description: 'Add questions, set correct answers, and publish — all in one clean interface. No forms, no exports.',
    },
    {
        icon: Zap,
        title: 'Auto-graded instantly',
        description: 'Multiple choice, true/false, and single choice questions are graded automatically. Results appear immediately.',
    },
    {
        icon: BarChart3,
        title: 'Clear results & analytics',
        description: 'See scores, completion rates, and student progress at a glance. No spreadsheets required.',
    },
    {
        icon: Bell,
        title: 'Instant notifications',
        description: 'Students get notified when results are ready. Teachers see submissions as they come in.',
    },
]

export default function Quiz() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Quiz Tasks - Mareef">
                <meta property="og:title" content="Quiz Tasks - Mareef" />
                <meta property="og:description" content="Auto-graded quizzes for language teachers. Create, assign, and evaluate in minutes — not hours." />
                <meta property="og:image" content={ogImages.quizTask} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Quiz Tasks - Mareef" />
                <meta name="twitter:description" content="Auto-graded quizzes for language teachers. Create, assign, and evaluate in minutes — not hours." />
                <meta name="twitter:image" content={ogImages.quizTask} />
            </Head>

            {/* Header */}
            <HeroHeader faqHref="/#faq" />

            {/* Main Content */}
            <main className="overflow-hidden">
                <TaskHeroSection
                    badge="Live now"
                    title="Quizzes that check knowledge — not patience."
                    description="Auto-graded quizzes for language and subject teachers.
Create, assign, and evaluate students in minutes — not hours."
                    primaryButtonText="Create Quiz Task"
                    secondaryButtonText="See how it works"
                    secondaryButtonHref="#features"
                    imageSrc={dashboardMockups}
                />

                {/* Problem Section */}
                <ProblemSection
                    title="Traditional quizzes are harder than they should be"
                    subtitle="Too much time creating, checking, and managing — not enough time teaching."
                    problems={quizProblems}
                />

                {/* Solution Section */}
                <SolutionSection2
                    headline="Mareef Quizzes are built as a native task type"
                    subheadline="No extra tools. No copy-paste workflows. No manual checking."
                    solutions={quizSolutions}
                    bottomMessage="All tasks live in one system — quizzes, writing, and more."
                />

                {/* Call to Action */}
                <CallToActionSection
                    title="Ready to stop checking answers manually?"
                    subtitle="It takes 2 minutes to create your first quiz. No friction."
                    primaryButtonText="Create a Quiz Task"
                    secondaryButtonText="See how Mareef works"
                />
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    )
}
