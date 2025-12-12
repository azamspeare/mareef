import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Sparkles } from 'lucide-react'
import { getTeacherUrl } from '@/lib/utils'

const coreFeatures = [
    {
        feature: 'Teacher accounts',
        free: '1',
        premium: '1',
        vip: 'Up to 10',
    },
    {
        feature: 'Assistants',
        free: '0',
        premium: 'Up to 3',
        vip: 'Up to 20',
    },
    {
        feature: 'Students',
        free: 'Up to 20',
        premium: 'Up to 200',
        vip: 'Up to 500',
    },
    {
        feature: 'All task types (writing, reading, speaking, listening)',
        free: true,
        premium: true,
        vip: true,
    },
    {
        feature: 'Manual workflow (create, assign, review)',
        free: true,
        premium: true,
        vip: true,
    },
    {
        feature: 'Email notifications',
        free: true,
        premium: true,
        vip: true,
    },
]

const aiFeatures = [
    {
        feature: 'Basic analytics',
        free: true,
        premium: true,
        vip: true,
    },
    {
        feature: 'Advanced analytics',
        free: false,
        premium: 'Coming Soon',
        vip: 'Coming Soon',
    },
    {
        feature: 'AI task generator',
        free: false,
        premium: 'Coming Soon',
        vip: 'Coming Soon',
    },
    {
        feature: 'AI feedback assistant',
        free: false,
        premium: 'Coming Soon',
        vip: 'Coming Soon',
    },
]

const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4 text-primary">
        <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
        />
    </svg>
)

const CrossIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4 text-muted-foreground/40">
        <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clipRule="evenodd"
        />
    </svg>
)

const renderCellValue = (value: boolean | string) => {
    if (value === true) return <CheckIcon />
    if (value === false) return <CrossIcon />
    if (value === 'Coming Soon') return <Badge variant="outline" className="text-xs">Coming Soon</Badge>
    return <span>{value}</span>
}

export default function ComparisonSection() {
    const teacherLoginUrl = getTeacherUrl('login')

    return (
        <section className="py-16 md:py-24" id="pricing">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold md:text-4xl">Compare plans</h2>
                    <p className="mt-4 text-muted-foreground">Find the perfect plan for your teaching needs</p>
                </div>

                <div className="w-full overflow-auto lg:overflow-visible">
                    <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full dark:[--color-muted:var(--color-zinc-900)]">
                        <thead className="bg-background sticky top-0">
                            <tr className="*:py-4 *:text-left *:font-medium">
                                <th className="lg:w-2/5"></th>
                                <th className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="block">Free</span>
                                        <Badge variant="secondary" className="text-xs">Start free</Badge>
                                    </div>
                                    <p className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    <p className="text-xs text-muted-foreground">Best for solo teachers just getting started</p>
                                    <Button asChild size="sm">
                                        <a href={teacherLoginUrl}>Start for Free</a>
                                    </Button>
                                </th>
                                <th className="bg-muted rounded-t-(--radius) space-y-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="block">Premium</span>
                                        <Badge className="text-xs">Popular</Badge>
                                    </div>
                                    <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    <p className="text-xs text-muted-foreground">Ideal for tutors managing larger groups</p>
                                    <Button asChild variant="outline" size="sm">
                                        <a href={teacherLoginUrl}>Join Waitlist</a>
                                    </Button>
                                </th>
                                <th className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="block">VIP</span>
                                        <Badge variant="outline" className="text-xs">Teams</Badge>
                                    </div>
                                    <p className="text-2xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    <p className="text-xs text-muted-foreground">For schools, academies, and teaching teams</p>
                                    <Button asChild variant="outline" size="sm">
                                        <a href={teacherLoginUrl}>Join Waitlist</a>
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-caption text-sm">
                            {/* Core Features Header */}
                            <tr className="*:pb-3 *:pt-8">
                                <td className="flex items-center gap-2 font-medium">
                                    <Users className="size-4" />
                                    <span>Core Features</span>
                                </td>
                                <td></td>
                                <td className="bg-muted border-none px-4"></td>
                                <td></td>
                            </tr>
                            {coreFeatures.map((row, index) => (
                                <tr key={index} className="*:border-b *:py-3">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td>{renderCellValue(row.free)}</td>
                                    <td className="bg-muted border-none px-4">
                                        <div className="-mb-3 border-b py-3">
                                            {renderCellValue(row.premium)}
                                        </div>
                                    </td>
                                    <td>{renderCellValue(row.vip)}</td>
                                </tr>
                            ))}

                            {/* AI Features Header */}
                            <tr className="*:pb-3 *:pt-8">
                                <td className="flex items-center gap-2 font-medium">
                                    <Sparkles className="size-4" />
                                    <span>AI & Analytics</span>
                                </td>
                                <td></td>
                                <td className="bg-muted border-none px-4"></td>
                                <td></td>
                            </tr>
                            {aiFeatures.map((row, index) => (
                                <tr key={index} className="*:border-b *:py-3">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td>{renderCellValue(row.free)}</td>
                                    <td className="bg-muted border-none px-4">
                                        <div className="-mb-3 border-b py-3">
                                            {renderCellValue(row.premium)}
                                        </div>
                                    </td>
                                    <td>{renderCellValue(row.vip)}</td>
                                </tr>
                            ))}

                            {/* Bottom spacing for muted column */}
                            <tr className="*:py-6">
                                <td></td>
                                <td></td>
                                <td className="bg-muted rounded-b-(--radius) border-none px-4"></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Early Access Banner */}
                <div className="mt-12 rounded-xl border bg-muted/50 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        💸 <strong>All features are currently free</strong> while we're in early access. You'll be notified before any billing begins.
                    </p>
                </div>
            </div>
        </section>
    )
}
