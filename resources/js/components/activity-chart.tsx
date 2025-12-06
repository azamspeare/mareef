import { useMemo, useRef, useState, useEffect } from 'react';
import { ActivityCalendar, type Activity, type ThemeInput } from 'react-activity-calendar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { format, subDays } from 'date-fns';
import { useTheme } from 'next-themes';

interface ActivityData {
    [date: string]: number; // date in 'YYYY-MM-DD' format -> submission count
}

interface ActivityChartProps {
    data: ActivityData;
}

const explicitTheme: ThemeInput = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
};

// 53 weeks in a year, 7 days per week
const WEEKS_IN_YEAR = 53;
const WEEKDAY_LABEL_WIDTH = 30; // approximate width for weekday labels
const MIN_BLOCK_SIZE = 10;
const MAX_BLOCK_SIZE = 16;

export function ActivityChart({ data }: ActivityChartProps) {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [blockSize, setBlockSize] = useState(12);
    const [blockMargin, setBlockMargin] = useState(4);

    // Calculate block size based on container width
    useEffect(() => {
        const calculateBlockSize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            // Available width = container - weekday labels - padding
            const availableWidth = containerWidth - WEEKDAY_LABEL_WIDTH - 16;

            // Calculate optimal block size + margin to fill the width
            // totalWidth = weeks * (blockSize + margin) - margin
            // availableWidth = 53 * (blockSize + margin) - margin
            // availableWidth + margin = 53 * (blockSize + margin)
            // (availableWidth + margin) / 53 = blockSize + margin

            const optimalTotal = availableWidth / WEEKS_IN_YEAR;
            // Keep margin as roughly 25-30% of total cell size
            const optimalMargin = Math.max(2, Math.floor(optimalTotal * 0.25));
            const optimalBlockSize = Math.floor(optimalTotal - optimalMargin);

            // Clamp block size to reasonable bounds
            const clampedBlockSize = Math.max(MIN_BLOCK_SIZE, Math.min(MAX_BLOCK_SIZE, optimalBlockSize));
            const clampedMargin = Math.max(2, Math.min(5, optimalMargin));

            setBlockSize(clampedBlockSize);
            setBlockMargin(clampedMargin);
        };

        calculateBlockSize();

        const resizeObserver = new ResizeObserver(calculateBlockSize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const transformedData = useMemo(() => {
        const today = new Date();
        const dates: Activity[] = [];

        // Helper to format date as YYYY-MM-DD
        const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

        // Iterate from 365 days ago to today
        for (let d = 0; d <= 365; d++) {
            const currentDate = subDays(today, 365 - d);
            const dateStr = formatDate(currentDate);
            const count = data[dateStr] || 0;

            // Calculate level based on count (0-4)
            let level = 0;
            if (count === 0) level = 0;
            else if (count === 1) level = 1;
            else if (count <= 3) level = 2;
            else if (count <= 5) level = 3;
            else level = 4;

            dates.push({
                date: dateStr,
                count,
                level,
            });
        }

        return dates;
    }, [data]);

    const totalSubmissions = useMemo(() => {
        return Object.values(data).reduce((sum, count) => sum + count, 0);
    }, [data]);

    return (
        <div className="rounded-lg border bg-card p-4 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">
                    {totalSubmissions} submission{totalSubmissions !== 1 ? 's' : ''} in the last year
                </h3>
            </div>

            <div ref={containerRef} className="w-full overflow-x-auto">
                <TooltipProvider delayDuration={0}>
                    <ActivityCalendar
                        data={transformedData}
                        theme={explicitTheme}
                        colorScheme={theme === 'dark' ? 'dark' : 'light'}
                        blockSize={blockSize}
                        blockMargin={blockMargin}
                        blockRadius={3}
                        fontSize={12}
                        showWeekdayLabels
                        renderBlock={(block, activity) => (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {block}
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                    <p className="font-medium">
                                        {activity.count} submission{activity.count !== 1 ? 's' : ''}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {format(new Date(activity.date), 'MMMM d, yyyy')}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    />
                </TooltipProvider>
            </div>
        </div>
    );
}
