import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";

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
    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("0");
    const [seconds, setSeconds] = useState("0");

    const handlePublish = (withTime: boolean) => {
        if (!withTime) {
            onPublish(null);
            return;
        }

        const h = parseInt(hours) || 0;
        const m = parseInt(minutes) || 0;
        const s = parseInt(seconds) || 0;

        if (h === 0 && m === 0 && s === 0) {
            onPublish(null);
        } else {
            // Format as HH:MM:SS
            const formattedTime = `${h.toString().padStart(2, "0")}:${m
                .toString()
                .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
            onPublish(formattedTime);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center font-handwriting text-2xl">
                        Do you want to limit writing time?
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Set a time limit for the writing assignment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center gap-4 text-center">
                        <div className="grid gap-2">
                            <Label htmlFor="hours" className="font-handwriting text-lg">
                                Hours
                            </Label>
                            <Input
                                id="hours"
                                type="number"
                                min="0"
                                max="23"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="h-12 w-16 text-center text-lg"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="minutes" className="font-handwriting text-lg">
                                Minutes
                            </Label>
                            <Input
                                id="minutes"
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                className="h-12 w-16 text-center text-lg"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seconds" className="font-handwriting text-lg">
                                Seconds
                            </Label>
                            <Input
                                id="seconds"
                                type="number"
                                min="0"
                                max="59"
                                value={seconds}
                                onChange={(e) => setSeconds(e.target.value)}
                                className="h-12 w-16 text-center text-lg"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handlePublish(false)}
                        disabled={isSubmitting}
                        className="font-handwriting text-lg"
                    >
                        Create without time
                    </Button>
                    <Button
                        onClick={() => handlePublish(true)}
                        disabled={isSubmitting}
                        className="font-handwriting text-lg"
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
