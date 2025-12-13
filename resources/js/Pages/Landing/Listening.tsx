import { Head } from '@inertiajs/react'
import { HeroHeader } from '@/components/header'
import TaskHeroSection from '@/components/sections/task/hero-section'
import ProblemSection, { Problem } from '@/components/sections/task/problem-section'
import SolutionSection2, { Solution2 } from '@/components/sections/task/solution-section-2'
import CallToActionSection from '@/components/sections/call-to-action-section'
import FooterSection from '@/components/sections/footer-section'
import { Toaster } from '@/components/ui/sonner'
import { MessageSquare, Link2, FileQuestion, Headphones, Timer, Lock, ClipboardCheck } from 'lucide-react'

const listeningProblems: Problem[] = [
    {
        icon: MessageSquare,
        title: 'Audio sent via chat',
        description: 'Teachers send audio files in Telegram or upload to YouTube. Questions are sent separately in Google Docs.',
    },
    {
        icon: FileQuestion,
        title: 'Random answer formats',
        description: "Students answer in random formats chat, email, handwritten. There's no alignment with listening time.",
    },
    {
        icon: Link2,
        title: 'Disconnected workflow',
        description: 'Everything is disconnected. Teachers waste time re-linking audio, questions, and student responses.',
    },
]

const listeningSolutions: Solution2[] = [
    {
        icon: Headphones,
        title: 'Upload or embed audio',
        description: 'Upload audio files or embed links directly. Everything lives in one place.',
    },
    {
        icon: Timer,
        title: 'Timed questions',
        description: 'Write timed or general comprehension questions synced with the audio.',
    },
    {
        icon: Lock,
        title: 'Playback controls',
        description: 'Optional playback restrictions  1x listen, no rewind. Perfect for test conditions.',
    },
    {
        icon: ClipboardCheck,
        title: 'Answer & review panel',
        description: 'Students answer directly beneath the player. Full review + feedback panel for teachers.',
    },
]

export default function Listening() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Head title="Listening Tasks - Mareef" />

            {/* Header */}
            <HeroHeader faqHref="/#faq" />

            {/* Main Content */}
            <main className="overflow-hidden">
                <TaskHeroSection
                    badge="Coming soon"
                    title="Finally, a real workflow for listening tasks."
                    description="No more sending audio in chats and chasing down answers. Mareef will let you create structured listening tasks with synced questions all in one clean flow."
                    primaryButtonText="Join Waitlist"
                    isWaitlist={true}
                    imageSrc={{
                        light: '/images/dashboard-mockups/light.png',
                        dark: '/images/dashboard-mockups/dark.png',
                    }}
                />

                {/* Problem Section */}
                <ProblemSection
                    title="Listening tasks are messy and disconnected"
                    subtitle="It's disconnected, and teachers waste time re-linking everything."
                    problems={listeningProblems}
                />

                {/* Solution Section */}
                <SolutionSection2
                    headline="Mareef's Listening Tasks will be built for language teachers"
                    subheadline="Everything in one task no extra apps, no tracking confusion."
                    solutions={listeningSolutions}
                    bottomMessage="Everything in one task no extra apps, no tracking confusion."
                />

                {/* Call to Action */}
                <CallToActionSection
                    title="Listening tasks are coming soon. Want in early?"
                    subtitle="Join the waitlist to be among the first to try it."
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
