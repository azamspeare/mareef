import { useCallback, useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button.tsx';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Loader2 } from 'lucide-react';
import type { Annotation, AnnotationData } from '@/components/annotation';

interface EvaluationFormProps {
    submissionId: number;
    annotations: Annotation[];
    originalText: string;
    existingScore?: number | null;
    existingFeedback?: string | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function EvaluationForm({
    submissionId,
    annotations,
    originalText,
    existingScore,
    existingFeedback,
    isOpen,
    onOpenChange,
    onSuccess,
}: EvaluationFormProps) {
    const [score, setScore] = useState<string>(existingScore?.toString() ?? '');
    const [overallFeedback, setOverallFeedback] = useState<string>(existingFeedback ?? '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);

        const annotationData: AnnotationData = {
            annotations,
            originalText,
        };

        router.post(
            route('submissions.evaluate', submissionId),
            {
                submission_id: submissionId,
                content: JSON.stringify(annotationData),
                score: score ? parseFloat(score) : null,
                feedback: overallFeedback || null,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.();
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    }, [annotations, originalText, submissionId, score, overallFeedback, onOpenChange, onSuccess]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Finish Assessment</DialogTitle>
                    <DialogDescription>
                        Add an optional score and overall feedback. {annotations.length} comment(s) added.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="score">Score (optional)</Label>
                        <Input
                            id="score"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="overall-feedback">Overall Feedback (optional)</Label>
                        <Textarea
                            id="overall-feedback"
                            placeholder="Add any overall comments..."
                            value={overallFeedback}
                            onChange={(e) => setOverallFeedback(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
