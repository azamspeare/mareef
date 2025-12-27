import type { Teacher } from './user';
import type { WritingSubmission } from './submission';

/**
 * BlockNote content block type
 */
export interface BlockContent {
    id?: string;
    type: string;
    props?: Record<string, unknown>;
    content?: Array<{ type: string; text?: string; styles?: Record<string, unknown> }>;
    children?: BlockContent[];
}

/**
 * Base Writing model matching backend Writing model
 */
export interface Writing {
    id: number;
    teacher_id: number;
    title: string;
    slug: string;
    content: BlockContent[];
    allocated_time: string;
    public_at: string | null;
    hash: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Writing for list views
 */
export interface WritingListItem {
    id: number;
    title: string;
    slug: string;
    allocated_time: string;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    submissions_count?: number;
}

/**
 * Writing with teacher relation
 */
export interface WritingWithTeacher extends Writing {
    teacher: Teacher;
}

/**
 * Writing with submissions relation
 */
export interface WritingWithSubmissions extends Writing {
    submissions: WritingSubmission[];
}

/**
 * Writing for show/edit pages
 */
export interface WritingDetail extends Writing {
    archived_at: string | null;
}

/**
 * Writing for student task page (public view)
 */
export interface WritingTask {
    id: number;
    title: string;
    content: BlockContent[];
    allocated_time: string;
    slug: string;
}
