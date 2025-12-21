import type { AnnotationData } from '@/components/annotation';

/**
 * Base WritingFeedback model matching backend WritingFeedback model
 */
export interface WritingFeedback {
    id: number;
    submission_id: number;
    teacher_id: number;
    content: AnnotationData | null;
    score: number | null;
    feedback: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Feedback for list views (minimal)
 */
export interface FeedbackListItem {
    id: number;
    submission_id: number;
    score: number | null;
}

/**
 * Feedback summary for submission list
 */
export interface FeedbackSummary {
    id: number;
    submission_id: number;
    score: number | null;
}
