import { useState, useEffect } from "react";
import { IconClock, IconLoader2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (timeLimit: string | null) => void;
    isSubmitting: boolean;
}

export function PublishModal({
    isOpen,
    onClose,
    onPublish,
    isSubmitting,
    initialTimeLimit,
    title = "Create Writing Assignment",
    description = "Set a time limit for students to complete this writing.",
    actionLabel = "Create Writing",
}: PublishModalProps & {
    initialTimeLimit?: string | null;
    title?: string;
    description?: string;
    actionLabel?: string;
}) {
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");
    const [seconds, setSeconds] = useState("00");
    const [error, setError] = useState("");

    // Initialize state from initialTimeLimit when modal opens
    useEffect(() => {
        if (isOpen && initialTimeLimit) {
            const [h, m, s] = initialTimeLimit.split(':');
            setHours(h || "00");
            setMinutes(m || "00");
            setSeconds(s || "00");
        } else if (isOpen) {
            // Reset if no initial time limit
            setHours("00");
            setMinutes("00");
            setSeconds("00");
        }
    }, [isOpen, initialTimeLimit]);

    const parseValue = (value: string, max: number): number => {
        const num = parseInt(value) || 0;
        return Math.min(Math.max(0, num), max);
    };

    const formatValue = (value: string, max: number): string => {
        const num = parseValue(value, max);
        return num.toString().padStart(2, "0");
    };

    const handleInputChange = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>,
        max: number
    ) => {
        // Allow empty input
        if (value === "") {
            setter(value);
            setError("");
            return;
        }

        // Only allow numeric input
        if (!/^\d{0,2}$/.test(value)) {
            return;
        }

        // Parse and clamp to max value
        const num = parseInt(value) || 0;
        if (num > max) {
            setter(max.toString().padStart(2, "0"));
        } else {
            setter(value);
        }
        setError("");
    };

    const handleBlur = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>,
        max: number
    ) => {
        setter(formatValue(value, max));
    };

    const getTotalSeconds = (): number => {
        const h = parseValue(hours, 23);
        const m = parseValue(minutes, 59);
        const s = parseValue(seconds, 59);
        return h * 3600 + m * 60 + s;
    };

    const handlePublish = () => {
        const totalSeconds = getTotalSeconds();

        // if everything is 0, publish without time limit
        if (totalSeconds === 0) {
            onPublish(null); // Send null for no time limit
            return;
        }

        // Validation: must have at least 1 minute (60 seconds)
        if (totalSeconds < 60) {
            setError("Please set at least 1 minute for the time limit");
            return;
        }

        const h = parseValue(hours, 23);
        const m = parseValue(minutes, 59);
        const s = parseValue(seconds, 59);

        const formattedTime = `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        onPublish(formattedTime);
    };


    const adjustValue = (
        currentValue: string,
        setter: React.Dispatch<React.SetStateAction<string>>,
        delta: number,
        max: number
    ) => {
        const current = parseValue(currentValue, max);
        let newValue = current + delta;
        if (newValue < 0) newValue = max;
        if (newValue > max) newValue = 0;
        setter(newValue.toString().padStart(2, "0"));
        setError("");
    };

    const TimeInput = ({
        label,
        value,
        onChange,
        onBlur,
        onIncrement,
        onDecrement,
    }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
        onBlur: () => void;
        onIncrement: () => void;
        onDecrement: () => void;
    }) => (
        <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {label}
            </span>
            <div className="flex flex-col items-center">
                <button
                    type="button"
                    onClick={onIncrement}
                    className="h-7 w-16 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-t-lg transition-colors"
                >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="stroke-current">
                        <path d="M1 6.5L6 1.5L11 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    onFocus={(e) => e.target.select()}
                    className="h-12 w-16 text-center text-2xl font-semibold tabular-nums rounded-lg border bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                    maxLength={2}
                />
                <button
                    type="button"
                    onClick={onDecrement}
                    className="h-7 w-16 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-b-lg transition-colors"
                >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="stroke-current">
                        <path d="M1 1.5L6 6.5L11 1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );

    const totalSeconds = getTotalSeconds();
    const displayHours = Math.floor(totalSeconds / 3600);
    const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
    const displaySeconds = totalSeconds % 60;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center sm:text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <IconClock className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-xl">
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    <div className="flex justify-center items-center gap-2">
                        <TimeInput
                            label="Hours"
                            value={hours}
                            onChange={(v) => handleInputChange(v, setHours, 23)}
                            onBlur={() => handleBlur(hours, setHours, 23)}
                            onIncrement={() => adjustValue(hours, setHours, 1, 23)}
                            onDecrement={() => adjustValue(hours, setHours, -1, 23)}
                        />
                        <span className="text-2xl font-semibold text-muted-foreground mt-5">:</span>
                        <TimeInput
                            label="Minutes"
                            value={minutes}
                            onChange={(v) => handleInputChange(v, setMinutes, 59)}
                            onBlur={() => handleBlur(minutes, setMinutes, 59)}
                            onIncrement={() => adjustValue(minutes, setMinutes, 1, 59)}
                            onDecrement={() => adjustValue(minutes, setMinutes, -1, 59)}
                        />
                        <span className="text-2xl font-semibold text-muted-foreground mt-5">:</span>
                        <TimeInput
                            label="Seconds"
                            value={seconds}
                            onChange={(v) => handleInputChange(v, setSeconds, 59)}
                            onBlur={() => handleBlur(seconds, setSeconds, 59)}
                            onIncrement={() => adjustValue(seconds, setSeconds, 1, 59)}
                            onDecrement={() => adjustValue(seconds, setSeconds, -1, 59)}
                        />
                    </div>

                    {totalSeconds > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Time limit:{" "}
                            <span className="font-medium text-foreground">
                                {displayHours > 0 && `${displayHours}h `}
                                {displayMinutes > 0 && `${displayMinutes}m `}
                                {displaySeconds > 0 && `${displaySeconds}s`}
                            </span>
                        </p>
                    )}

                    {error && (
                        <p className="text-center text-sm text-destructive mt-3">
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter className="gap-2 flex-row justify-between">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <IconLoader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            actionLabel
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
