import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
}: PublishModalProps) {
    const [hasTimeLimit, setHasTimeLimit] = useState(false);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(30);
    const [seconds, setSeconds] = useState(0);

    const handlePublish = () => {
        if (!hasTimeLimit) {
            onPublish(null);
            return;
        }

        if (hours === 0 && minutes === 0 && seconds === 0) {
            onPublish(null);
        } else {
            const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            onPublish(formattedTime);
        }
    };

    const adjustValue = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        current: number,
        delta: number,
        max: number
    ) => {
        const newValue = current + delta;
        if (newValue >= 0 && newValue <= max) {
            setter(newValue);
        }
    };

    const TimeInput = ({
        label,
        value,
        onChange,
        max,
    }: {
        label: string;
        value: number;
        onChange: React.Dispatch<React.SetStateAction<number>>;
        max: number;
    }) => (
        <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {label}
            </span>
            <div className="flex flex-col items-center">
                <button
                    type="button"
                    onClick={() => adjustValue(onChange, value, 1, max)}
                    disabled={!hasTimeLimit}
                    className="h-8 w-16 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-t-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="stroke-current">
                        <path d="M1 6.5L6 1.5L11 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div
                    className={`h-14 w-16 flex items-center justify-center text-2xl font-semibold tabular-nums rounded-lg border transition-colors ${hasTimeLimit
                        ? "bg-background border-input"
                        : "bg-muted/50 border-muted text-muted-foreground"
                        }`}
                >
                    {value.toString().padStart(2, "0")}
                </div>
                <button
                    type="button"
                    onClick={() => adjustValue(onChange, value, -1, max)}
                    disabled={!hasTimeLimit}
                    className="h-8 w-16 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-b-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="stroke-current">
                        <path d="M1 1.5L6 6.5L11 1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center sm:text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <IconClock className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-xl">
                        Create Writing Assignment
                    </DialogTitle>
                    <DialogDescription>
                        Set a time limit for students to complete this writing, or allow unlimited time.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    <div className="flex items-center justify-between rounded-lg border p-4 mb-6">
                        <div className="space-y-0.5">
                            <Label htmlFor="time-limit" className="text-base font-medium">
                                Enable time limit
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Students must submit within the time limit
                            </p>
                        </div>
                        <Switch
                            id="time-limit"
                            checked={hasTimeLimit}
                            onCheckedChange={setHasTimeLimit}
                        />
                    </div>

                    <div
                        className={`flex justify-center items-center gap-2 transition-opacity ${hasTimeLimit ? "opacity-100" : "opacity-40"
                            }`}
                    >
                        <TimeInput
                            label="Hours"
                            value={hours}
                            onChange={setHours}
                            max={23}
                        />
                        <span className="text-2xl font-semibold text-muted-foreground mt-6">:</span>
                        <TimeInput
                            label="Minutes"
                            value={minutes}
                            onChange={setMinutes}
                            max={59}
                        />
                        <span className="text-2xl font-semibold text-muted-foreground mt-6">:</span>
                        <TimeInput
                            label="Seconds"
                            value={seconds}
                            onChange={setSeconds}
                            max={59}
                        />
                    </div>

                    {hasTimeLimit && (hours > 0 || minutes > 0 || seconds > 0) && (
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Time limit:{" "}
                            <span className="font-medium text-foreground">
                                {hours > 0 && `${hours}h `}
                                {minutes > 0 && `${minutes}m `}
                                {seconds > 0 && `${seconds}s`}
                                {hours === 0 && minutes === 0 && seconds === 0 && "No limit"}
                            </span>
                        </p>
                    )}
                </div>

                <DialogFooter className="sm:justify-end gap-2">
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
                                Creating...
                            </>
                        ) : (
                            "Create Writing"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
