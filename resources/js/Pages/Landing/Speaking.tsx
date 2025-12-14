import { Head } from '@inertiajs/react'
import { HeroHeader } from '@/components/header'
import TaskHeroSection from '@/components/sections/task/hero-section'
import ProblemSection, { Problem } from '@/components/sections/task/problem-section'
import SolutionSection2, { Solution2 } from '@/components/sections/task/solution-section-2'
import CallToActionSection from '@/components/sections/call-to-action-section'
import FooterSection from '@/components/sections/footer-section'
import { Toaster } from '@/components/ui/sonner'
import { MessageCircle, Clock, History, Mic, FileText, MessageSquareQuote, Archive } from 'lucide-react'

const speakingProblems: Problem[] = [
    {
        icon: MessageCircle,
        title: 'Voice messages in chats',
        description: 'Students send voice messages through Telegram or WhatsApp. No structure, no organization.',
    },
    {
        icon: Clock,
        title: 'Feedback without timestamps',
        description: 'Teachers reply with general comments  no timestamps, no way to point to specific moments.',
    },
    {
        icon: History,
        title: 'No version history',
        description: 'No way to track pronunciation progress. Feedback often gets ignored or forgotten.',
    },
]

const speakingSolutions: Solution2[] = [
    {
        icon: Mic,
        title: 'Record in browser',
        description: 'Students record audio directly in the browser. No extra apps, no file transfers.',
    },
    {
        icon: FileText,
        title: 'Topic instructions',
        description: 'Optional word limit or topic instructions to guide the speaking task.',
    },
    {
        icon: MessageSquareQuote,
        title: 'Timestamped feedback',
        description: 'Teachers listen and leave timestamped feedback. Score and feedback saved with the recording.',
    },
    {
        icon: Archive,
        title: 'Full history stored',
        description: 'All history is stored  every attempt, every review. Track progress over time.',
    },
]

export default function Speaking() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Speaking Tasks - Mareef">
                <meta property="og:title" content="Speaking Tasks - Mareef" />
                <meta property="og:description" content="Collect and evaluate student speech with timestamped feedback. No more voice messages in chat." />
                <meta property="og:image" content="/images/og/tasks.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Speaking Tasks - Mareef" />
                <meta name="twitter:description" content="Collect and evaluate student speech with timestamped feedback. No more voice messages in chat." />
                <meta name="twitter:image" content="/images/og/tasks.png" />
            </Head>

            {/* Header */}
            <HeroHeader faqHref="/#faq" />

            {/* Main Content */}
            <main className="overflow-hidden">
                <TaskHeroSection
                    badge="Coming soon"
                    title="Speaking tasks, reimagined for async teaching."
                    description="No more lost voice messages or timestampless replies. Mareef's upcoming Speaking Tasks will give teachers a clean way to collect, evaluate, and comment on student speech."
                    primaryButtonText="Join Waitlist"
                    isWaitlist={true}
                    imageSrc={{
                        light: '/images/dashboard-mockups/light.png',
                        dark: '/images/dashboard-mockups/dark.png',
                    }}
                />

                {/* Problem Section */}
                <ProblemSection
                    title="Speaking assignments are one of the hardest to manage"
                    subtitle="It's messy, unscalable, and hard to use for real teaching growth."
                    problems={speakingProblems}
                />

                {/* Solution Section */}
                <SolutionSection2
                    headline="Mareef's Speaking Tasks will offer a structured voice submission workflow"
                    subheadline="It's like a speaking test, without the scheduling headaches."
                    solutions={speakingSolutions}
                    bottomMessage="It's like a speaking test, without the scheduling headaches."
                />

                {/* Call to Action */}
                <CallToActionSection
                    title="Want a better way to handle speaking tasks?"
                    subtitle="Be among the first to test when it's ready."
                    primaryButtonText="Join Waitlist"
                    secondaryButtonText="Try Writing Tasks Now"
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
