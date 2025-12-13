import { Badge } from '@/components/ui/badge'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/effect-coverflow'

const swiperContent = [
    {
        emoji: '⏳',
        title: 'Saved 6+ hours/week on grading',
        description: 'Private tutors using Mareef\'s writing workflow reduced manual feedback time by 50–70%.',
    },
    {
        emoji: '🧠',
        title: 'Better student engagement',
        description: 'Teachers report students submit on time more consistently with Mareef\'s structured writing flow.',
    },
    {
        emoji: '🔁',
        title: '90% task feedback visibility',
        description: 'Every student sees their teacher\'s comments — no more ignored Google Docs or lost chats.',
    },
    {
        emoji: '🧪',
        title: 'Over 700 tasks created in private beta',
        description: 'Teachers from 5+ countries tested Mareef to streamline writing instruction.',
    },
    {
        emoji: '🌍',
        title: 'Supports 10+ languages',
        description: 'English, Arabic, Korean, Russian, and more — Mareef works for every language teacher.',
    },
]

export default function PricingHeroSection() {
    return (
        <section className="relative pt-24 pb-12 md:pt-36 md:pb-16">
            {/* Background decorative elements */}
            <div
                aria-hidden
                className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            </div>

            <div
                aria-hidden
                className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                    <AnimatedGroup preset="blur-slide">
                        <Badge variant="outline" className="mx-auto mb-6 px-4 py-1.5 text-sm font-medium">
                            🎉 All features free during early access
                        </Badge>
                    </AnimatedGroup>

                    <TextEffect
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h1"
                        className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-medium max-md:font-semibold md:text-5xl lg:text-6xl">
                        Simple pricing that scales with you
                    </TextEffect>

                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.5}
                        as="p"
                        className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
                        Start free with all core features. Upgrade when you need more students, assistants, and AI-powered automation.
                    </TextEffect>
                </div>

                {/* Swiper Section */}
                <div className="relative mx-auto mt-12 max-w-lg sm:mt-16">
                    <div className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10" />
                    <div className="absolute inset-x-0 top-12 -z-[1] mx-auto h-1/3 w-2/3 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />

                    <Swiper
                        slidesPerView={1}
                        loop
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        modules={[Autoplay, EffectCoverflow]}
                        className="px-2">
                        {swiperContent.map((item, index) => (
                            <SwiperSlide key={index} className="px-2">
                                <div className="bg-background rounded-xl h-48 max-w-lg border p-8 shadow-sm">
                                    <div className="mx-auto text-center">
                                        <span className="text-4xl">{item.emoji}</span>
                                        <p className="mt-4 text-lg font-semibold">{item.title}</p>
                                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}
