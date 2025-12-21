import { memo } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WritingFeedback as Feedback } from "@/types";
import type { Annotation } from "@/components/annotation";

interface FeedbackBannerProps {
    feedback: Feedback;
    annotations: Annotation[];
    onViewComments: () => void;
    /** Layout variant - affects spacing and button placement */
    variant?: "mobile" | "desktop";
}

/**
 * Banner showing feedback summary after a submission has been evaluated.
 * Displays score, annotation count, overall feedback, and a button to view comments.
 */
export const FeedbackBanner = memo(function FeedbackBanner({
    feedback,
    annotations,
    onViewComments,
    variant = "desktop",
}: FeedbackBannerProps) {
    const isMobile = variant === "mobile";

    return (
        <div
            className={cn(
                "rounded-lg border bg-card",
                isMobile ? "mb-4 p-3" : "mb-6 p-4"
            )}
        >
            <div
                className={cn(
                    isMobile
                        ? "flex flex-col gap-3"
                        : "flex items-center justify-between"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className={cn("font-medium", isMobile && "text-sm")}>
                            Your submission has been evaluated
                        </p>
                        <p
                            className={cn(
                                "text-muted-foreground",
                                isMobile ? "text-xs" : "text-sm"
                            )}
                        >
                            {feedback.score !== null && (
                                <span>Score: {feedback.score} · </span>
                            )}
                            {annotations.length} comment(s) from your teacher
                        </p>
                    </div>
                </div>
                {annotations.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onViewComments}
                        className={cn("gap-2", isMobile && "w-full")}
                    >
                        <MessageSquare className="h-4 w-4" />
                        View Comments
                    </Button>
                )}
            </div>
            {feedback.feedback && (
                <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-1">Overall Feedback:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {feedback.feedback}
                    </p>
                </div>
            )}
        </div>
    );
});
