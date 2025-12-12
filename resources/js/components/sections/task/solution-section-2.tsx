import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export interface Solution2 {
    icon: LucideIcon
    title: string
    description: string
    image?: {
        light: string
        dark: string
    }
}

interface SolutionSection2Props {
    headline: string
    subheadline: string
    solutions: Solution2[]
    bottomMessage: string
}

export default function SolutionSection2({
    headline,
    solutions,
    bottomMessage,
}: SolutionSection2Props) {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="relative z-10 max-w-2xl mb-12">
                    <h2 className="text-4xl font-semibold lg:text-5xl">{headline}</h2>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Solution 1 */}
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={solutions[0].icon}
                                title={solutions[0].title}
                                description={solutions[0].description}
                            />
                        </CardHeader>

                        {solutions[0].image && (
                            <div className="relative border-t border-dashed max-sm:mb-6">
                                <div
                                    aria-hidden
                                    className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-primary),var(--color-background)_100%)]"
                                />
                                <div className="aspect-76/59 p-1 px-6">
                                    <DualModeImage
                                        darkSrc={solutions[0].image.dark}
                                        lightSrc={solutions[0].image.light}
                                        alt={solutions[0].title}
                                    />
                                </div>
                            </div>
                        )}
                    </FeatureCard>

                    {/* Solution 2 */}
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={solutions[1].icon}
                                title={solutions[1].title}
                                description={solutions[1].description}
                            />
                        </CardHeader>

                        {solutions[1].image && (
                            <CardContent>
                                <div className="relative max-sm:mb-6">
                                    <div className="aspect-76/59 overflow-hidden rounded-lg border">
                                        <DualModeImage
                                            darkSrc={solutions[1].image.dark}
                                            lightSrc={solutions[1].image.light}
                                            alt={solutions[1].title}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </FeatureCard>

                    {/* Solution 3 */}
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={solutions[2].icon}
                                title={solutions[2].title}
                                description={solutions[2].description}
                            />
                        </CardHeader>

                        {solutions[2].image && (
                            <CardContent>
                                <div className="relative max-sm:mb-6">
                                    <div className="aspect-76/59 overflow-hidden rounded-lg border">
                                        <DualModeImage
                                            darkSrc={solutions[2].image.dark}
                                            lightSrc={solutions[2].image.light}
                                            alt={solutions[2].title}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </FeatureCard>

                    {/* Solution 4 */}
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={solutions[3].icon}
                                title={solutions[3].title}
                                description={solutions[3].description}
                            />
                        </CardHeader>

                        {solutions[3].image && (
                            <CardContent>
                                <div className="relative max-sm:mb-6">
                                    <div className="aspect-76/59 overflow-hidden rounded-lg border">
                                        <DualModeImage
                                            darkSrc={solutions[3].image.dark}
                                            lightSrc={solutions[3].image.light}
                                            alt={solutions[3].title}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </FeatureCard>

                    {/* Bottom message */}
                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">
                            {bottomMessage}
                        </p>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-muted-foreground flex items-center gap-2">
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, className }: DualModeImageProps) => (
    <>
        <img
            src={darkSrc}
            className={cn('hidden dark:block w-full h-auto', className)}
            alt={`${alt} dark`}
        />
        <img
            src={lightSrc}
            className={cn('shadow dark:hidden w-full h-auto', className)}
            alt={`${alt} light`}
        />
    </>
)
