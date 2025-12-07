import { useState, useEffect, useCallback, useMemo } from "react";

interface UseTimerOptions {
    allocatedTime: string; // Format: HH:MM:SS
    startedAt?: string | null; // ISO date string
    isActive: boolean;
    onTimeUp?: () => void;
}

interface UseTimerReturn {
    timeLeft: number;
    formattedTime: string;
    timeColorClass: string;
    spentTime: string;
}

/**
 * Parses a time string (HH:MM:SS) into total seconds
 */
function parseTimeToSeconds(time: string): number {
    const parts = time.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;
    return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Formats seconds into HH:MM:SS or MM:SS string
 */
function formatSeconds(totalSeconds: number, forceHours = false): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0 || forceHours) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Custom hook for managing countdown timer with pause/resume support
 */
export function useTimer({
    allocatedTime,
    startedAt,
    isActive,
    onTimeUp,
}: UseTimerOptions): UseTimerReturn {
    const totalAllocatedSeconds = useMemo(
        () => parseTimeToSeconds(allocatedTime),
        [allocatedTime]
    );

    const calculateInitialTime = useCallback(() => {
        if (startedAt && isActive) {
            const createdAt = new Date(startedAt).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - createdAt) / 1000);
            return Math.max(0, totalAllocatedSeconds - elapsedSeconds);
        }
        return totalAllocatedSeconds;
    }, [startedAt, isActive, totalAllocatedSeconds]);

    const [timeLeft, setTimeLeft] = useState(calculateInitialTime);

    // Recalculate when dependencies change
    useEffect(() => {
        setTimeLeft(calculateInitialTime());
    }, [calculateInitialTime]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0 || !isActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive]); // Only restart when isActive changes

    // Trigger onTimeUp callback
    useEffect(() => {
        if (timeLeft <= 0 && isActive && onTimeUp) {
            onTimeUp();
        }
    }, [timeLeft, isActive, onTimeUp]);

    const formattedTime = useMemo(() => formatSeconds(timeLeft), [timeLeft]);

    const timeColorClass = useMemo(() => {
        if (timeLeft <= 300) { // 5 minutes or less
            return 'bg-destructive/20 text-destructive';
        }
        if (timeLeft <= 600) { // 10 minutes or less
            return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500';
        }
        return 'bg-muted';
    }, [timeLeft]);

    const spentTime = useMemo(() => {
        const spentSeconds = totalAllocatedSeconds - timeLeft;
        return formatSeconds(Math.max(0, spentSeconds), true);
    }, [totalAllocatedSeconds, timeLeft]);

    return {
        timeLeft,
        formattedTime,
        timeColorClass,
        spentTime,
    };
}
