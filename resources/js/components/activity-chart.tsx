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
    dark: ['#666666', '#39d353', '#26a641', '#006d32', '#0e4429'],
};

const WEEKDAY_LABEL_WIDTH = 30; // approximate width for weekday labels
const MIN_BLOCK_SIZE = 10;
const MAX_BLOCK_SIZE = 16;
const MOBILE_BREAKPOINT = 640; // sm breakpoint
const DAYS_MOBILE = 90;
const DAYS_DESKTOP = 365;

export function ActivityChart({ data }: ActivityChartProps) {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [blockSize, setBlockSize] = useState(12);
    const [blockMargin, setBlockMargin] = useState(4);
    const [daysToShow, setDaysToShow] = useState(DAYS_DESKTOP);

    // Calculate block size and days to show based on container width
    useEffect(() => {
        const calculateLayout = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;

            // Determine mobile or desktop
            const isMobile = containerWidth < MOBILE_BREAKPOINT;
            const days = isMobile ? DAYS_MOBILE : DAYS_DESKTOP;
            const weeks = Math.ceil(days / 7);

            setDaysToShow(days);

            // Available width = container - weekday labels - padding
            const availableWidth = containerWidth - WEEKDAY_LABEL_WIDTH - 16;

            // Calculate optimal block size + margin to fill the width
            const optimalTotal = availableWidth / weeks;
            // Keep margin as roughly 25-30% of total cell size
            const optimalMargin = Math.max(2, Math.floor(optimalTotal * 0.25));
            const optimalBlockSize = Math.floor(optimalTotal - optimalMargin);

            // Clamp block size to reasonable bounds
            const clampedBlockSize = Math.max(MIN_BLOCK_SIZE, Math.min(MAX_BLOCK_SIZE, optimalBlockSize));
            const clampedMargin = Math.max(2, Math.min(5, optimalMargin));

            setBlockSize(clampedBlockSize);
            setBlockMargin(clampedMargin);
        };

        calculateLayout();

        const resizeObserver = new ResizeObserver(calculateLayout);
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

        // Iterate from daysToShow days ago to today
        for (let d = 0; d <= daysToShow; d++) {
            const currentDate = subDays(today, daysToShow - d);
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
    }, [data, daysToShow]);

    const totalSubmissions = useMemo(() => {
        return Object.values(data).reduce((sum, count) => sum + count, 0);
    }, [data]);

    const periodLabel = daysToShow === DAYS_DESKTOP ? 'year' : `${daysToShow} days`;

    return (
        <div className="rounded-lg border bg-card p-4 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">
                    {totalSubmissions} submission{totalSubmissions !== 1 ? 's' : ''} in the last {periodLabel}
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
