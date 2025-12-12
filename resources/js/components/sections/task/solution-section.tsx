'use client'
import { LucideIcon } from 'lucide-react'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export interface Solution {
    icon: LucideIcon
    title: string
    description: string
}

interface SolutionSectionProps {
    headline: string
    solutions: Solution[]
    statValue: string
    statLabel: string
    chartTitle: string
    chartSubtitle: string
}

export default function SolutionSection({
    headline,
    solutions,
    statValue,
    statLabel,
    chartTitle,
    chartSubtitle,
}: SolutionSectionProps) {
    const Icon0 = solutions[0].icon
    const Icon1 = solutions[1].icon
    const Icon2 = solutions[2].icon
    const Icon3 = solutions[3].icon

    return (
        <section className="px-4 py-16 md:py-32">
            <div className="mx-auto grid max-w-5xl border md:grid-cols-2">
                {/* Solution 1 */}
                <div className="p-6 sm:p-12 border-b md:border-b-0 md:border-r">
                    <span className="text-muted-foreground flex items-center gap-2">
                        <Icon0 className="size-4" />
                        {solutions[0].title}
                    </span>
                    <p className="mt-8 text-2xl font-semibold">{solutions[0].description}</p>
                </div>

                {/* Solution 2 */}
                <div className="p-6 sm:p-12 border-b">
                    <span className="text-muted-foreground flex items-center gap-2">
                        <Icon1 className="size-4" />
                        {solutions[1].title}
                    </span>
                    <p className="mt-8 text-2xl font-semibold">{solutions[1].description}</p>
                </div>

                {/* Stat highlight */}
                <div className="col-span-full border-b p-12">
                    <p className="text-center text-4xl font-semibold lg:text-7xl">{statValue}</p>
                    <p className="text-center text-muted-foreground mt-2">{statLabel}</p>
                </div>

                {/* Solution 3 */}
                <div className="p-6 sm:p-12 border-b md:border-b-0 md:border-r">
                    <span className="text-muted-foreground flex items-center gap-2">
                        <Icon2 className="size-4" />
                        {solutions[2].title}
                    </span>
                    <p className="mt-8 text-2xl font-semibold">{solutions[2].description}</p>
                </div>

                {/* Solution 4 */}
                <div className="p-6 sm:p-12 border-b">
                    <span className="text-muted-foreground flex items-center gap-2">
                        <Icon3 className="size-4" />
                        {solutions[3].title}
                    </span>
                    <p className="mt-8 text-2xl font-semibold">{solutions[3].description}</p>
                </div>

                {/* Chart section */}
                <div className="relative col-span-full">
                    <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
                        <p className="text-2xl font-semibold">
                            {chartTitle} <span className="text-muted-foreground">{chartSubtitle}</span>
                        </p>
                    </div>
                    <ProgressChart />
                </div>
            </div>
        </section>
    )
}

const chartConfig = {
    submissions: {
        label: 'Submissions',
        color: '#2563eb',
    },
    feedback: {
        label: 'Feedback Given',
        color: '#60a5fa',
    },
} satisfies ChartConfig

const chartData = [
    { week: 'Week 1', submissions: 12, feedback: 10 },
    { week: 'Week 2', submissions: 18, feedback: 16 },
    { week: 'Week 3', submissions: 24, feedback: 22 },
    { week: 'Week 4', submissions: 32, feedback: 30 },
    { week: 'Week 5', submissions: 28, feedback: 28 },
    { week: 'Week 6', submissions: 45, feedback: 42 },
]

const ProgressChart = () => {
    return (
        <ChartContainer
            className="h-120 aspect-auto md:h-96"
            config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 0,
                    right: 0,
                }}>
                <defs>
                    <linearGradient
                        id="fillSubmissions"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-submissions)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-submissions)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient
                        id="fillFeedback"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-feedback)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-feedback)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <ChartTooltip
                    active
                    cursor={false}
                    content={<ChartTooltipContent className="dark:bg-muted" />}
                />
                <Area
                    strokeWidth={2}
                    dataKey="feedback"
                    type="stepBefore"
                    fill="url(#fillFeedback)"
                    fillOpacity={0.1}
                    stroke="var(--color-feedback)"
                    stackId="a"
                />
                <Area
                    strokeWidth={2}
                    dataKey="submissions"
                    type="stepBefore"
                    fill="url(#fillSubmissions)"
                    fillOpacity={0.1}
                    stroke="var(--color-submissions)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}
