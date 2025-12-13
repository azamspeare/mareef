import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PenTool, Send, MessageSquareMore, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BorderBeam } from '@/components/ui/border-beam'

type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'

const features = {
    'item-1': {
        icon: PenTool,
        title: 'Writing Task Creation',
        description: 'Block-based editor with title, instructions, and allocated time. Create structured assignments in under 2 minutes.',
        image: '/images/feature-mockups/create-task/light.png',
        imageDark: '/images/feature-mockups/create-task/dark.png',
        alt: 'Writing task creation interface',
    },
    'item-2': {
        icon: Send,
        title: 'Student Submission View',
        description: 'Clean writing interface with autosave and one-click submit. No file uploads, no external tools needed.',
        image: '/images/feature-mockups/submission-view/light.png',
        imageDark: '/images/feature-mockups/submission-view/dark.png',
        alt: 'Student submission interface',
    },
    'item-3': {
        icon: MessageSquareMore,
        title: 'Teacher Evaluation Flow',
        description: 'Inline comments, highlights, scoring, and feedback popup. Every response is reviewable anytime.',
        image: '/images/feature-mockups/evaluation-flow/light.png',
        imageDark: '/images/feature-mockups/evaluation-flow/dark.png',
        alt: 'Teacher evaluation interface',
    },
    'item-4': {
        icon: LayoutDashboard,
        title: 'Dashboard Overview',
        description: 'Analytics cards and filtered submission table. See Not Reviewed and Evaluated tasks at a glance.',
        image: '/images/dashboard-mockups/light.png',
        imageDark: '/images/dashboard-mockups/dark.png',
        alt: 'Dashboard overview',
    },
}

export default function ProductPreviewSection() {
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    return (
        <section id="product-preview" className="py-16 md:py-32 bg-background">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-2xl space-y-4 text-center">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl">See Mareef in action</h2>
                    <p className="text-muted-foreground">From task creation to student feedback — everything happens in one place.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        {(Object.entries(features) as [ImageKey, typeof features[ImageKey]][]).map(([key, feature]) => {
                            const Icon = feature.icon
                            return (
                                <AccordionItem key={key} value={key}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-3 text-base">
                                            <Icon className="size-4" />
                                            {feature.title}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {feature.description}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>

                    <div className="bg-background relative flex overflow-hidden rounded-2xl border p-2">
                        <div className="w-12 absolute inset-y-0 right-0 border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
                        <div className="relative w-[calc(100%-2rem)] rounded-xl overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeItem}-id`}
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="size-full overflow-hidden rounded-xl border shadow-sm">
                                    <img
                                        src={features[activeItem].image}
                                        className="size-full object-cover object-left-top dark:hidden"
                                        alt={features[activeItem].alt}
                                    />
                                    <img
                                        src={features[activeItem].imageDark}
                                        className="size-full object-cover object-left-top hidden dark:block"
                                        alt={features[activeItem].alt}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <BorderBeam
                            duration={6}
                            size={200}
                            className="from-transparent via-foreground/20 to-transparent"
                        />
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Writing tasks are live now. Reading, Speaking, and Listening — coming soon.
                </p>
            </div>
        </section>
    )
}
