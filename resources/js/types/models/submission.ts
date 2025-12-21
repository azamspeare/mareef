import type { SubmissionStatus } from '../enums';
import type { Student } from './user';
import type { Writing, WritingTask } from './writing';
import type { WritingFeedback } from './feedback';
import type { BlockContent } from './writing';

/**
 * Base WritingSubmission model matching backend WritingSubmission model
 */
export interface WritingSubmission {
    id: number;
    writing_id: number;
    student_id: number;
    content: BlockContent[];
    spent_time: string | null;
    submitted_at: string | null;
    evaluated_at: string | null;
    status: SubmissionStatus;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Submission for list views (minimal fields)
 */
export interface SubmissionListItem {
    id: number;
    writing_id: number;
    student_id: number;
    spent_time: string;
    submitted_at: string;
    evaluated_at: string | null;
    status: SubmissionStatus;
    writing: {
        id: number;
        title: string;
        allocated_time: string;
    };
    student: {
        id: number;
        name: string;
    };
    feedback: {
        id: number;
        submission_id: number;
        score: number | null;
    } | null;
}

/**
 * Submission with full relations for detail view
 */
export interface SubmissionDetail extends WritingSubmission {
    writing: Writing & { slug: string };
    student: Student;
    feedback: WritingFeedback | null;
}

/**
 * Submission for student's writing task page
 */
export interface StudentSubmission {
    id: number;
    writing_id: number;
    student_id: number;
    content: BlockContent[] | null;
    spent_time: string | null;
    submitted_at: string | null;
    status: SubmissionStatus;
    created_at: string;
    feedback: WritingFeedback | null;
}

/**
 * Submission for teacher's student show page
 */
export interface StudentSubmissionItem {
    id: number;
    writing_id: number;
    student_id: number;
    spent_time: string;
    submitted_at: string;
    evaluated_at: string | null;
    status: SubmissionStatus;
    writing: {
        id: number;
        title: string;
        allocated_time: string;
    };
    feedback: {
        id: number;
        score: number | null;
    } | null;
}
