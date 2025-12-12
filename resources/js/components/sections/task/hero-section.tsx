import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { getTeacherUrl } from '@/lib/utils'

interface TaskHeroSectionProps {
    badge?: string
    title: string
    description: string
    primaryButtonText?: string
    primaryButtonHref?: string
    secondaryButtonText?: string
    secondaryButtonHref?: string
    imageSrc?: {
        light: string
        dark: string
    }
}

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function TaskHeroSection({
    badge,
    title,
    description,
    primaryButtonText = 'Get Started Free',
    primaryButtonHref,
    imageSrc,
}: TaskHeroSectionProps) {
    const teacherLoginUrl = getTeacherUrl('login')
    const primaryHref = primaryButtonHref || teacherLoginUrl

    return (
        <section className="relative pt-24 md:pt-36">
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

            <div className="mx-auto max-w-5xl px-6">
                <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                    {badge && (
                        <AnimatedGroup variants={transitionVariants}>
                            <span className="bg-muted text-muted-foreground mx-auto mb-6 block w-fit rounded-full border px-4 py-1.5 text-sm font-medium md:mx-0">
                                {badge}
                            </span>
                        </AnimatedGroup>
                    )}

                    <TextEffect
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h1"
                        className="mt-8 max-w-2xl text-balance text-5xl font-medium max-md:font-semibold md:text-6xl lg:mt-16">
                        {title}
                    </TextEffect>

                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.5}
                        as="p"
                        className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground">
                        {description}
                    </TextEffect>

                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.75,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}
                        className="mt-12 flex items-center gap-2">
                        <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-xl px-5 text-base">
                                <a href={primaryHref}>
                                    <span className="text-nowrap">{primaryButtonText}</span>
                                </a>
                            </Button>
                        </div>
                    </AnimatedGroup>
                </div>
            </div>

            {imageSrc && (
                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.75,
                                },
                            },
                        },
                        ...transitionVariants,
                    }}>
                    <div className="relative mt-8 sm:mt-12 md:mt-20 w-full flex justify-center px-4">
                        <div className="w-full max-w-5xl relative rounded-xl overflow-hidden border shadow-2xl">
                            <img
                                src={imageSrc.light}
                                alt="Feature preview"
                                className="w-full h-auto block dark:hidden"
                            />
                            <img
                                src={imageSrc.dark}
                                alt="Feature preview"
                                className="w-full h-auto hidden dark:block"
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </AnimatedGroup>
            )}
        </section>
    )
}
