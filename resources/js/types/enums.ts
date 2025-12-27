/**
 * User roles matching backend RoleEnum
 */
export type Role = 'admin' | 'teacher' | 'student';

export const Role = {
    ADMIN: 'admin' as const,
    TEACHER: 'teacher' as const,
    STUDENT: 'student' as const,
} as const;

/**
 * Submission process status matching backend SubmissionProcessEnum
 */
export type SubmissionStatus = 'in_progress' | 'completed' | 'failed';

export const SubmissionStatus = {
    IN_PROGRESS: 'in_progress' as const,
    COMPLETED: 'completed' as const,
    FAILED: 'failed' as const,
} as const;

/**
 * Submission filter status matching backend SubmissionStatusEnum
 */
export type SubmissionFilterStatus = 'all' | 'not_reviewed' | 'evaluated';

export const SubmissionFilterStatus = {
    ALL: 'all' as const,
    NOT_REVIEWED: 'not_reviewed' as const,
    EVALUATED: 'evaluated' as const,
} as const;

/**
 * Model status (archive) matching backend ModelStatusEnum
 */
export type ModelStatus = 'all' | 'active' | 'archived';

export const ModelStatus = {
    ALL: 'all' as const,
    ACTIVE: 'active' as const,
    ARCHIVED: 'archived' as const,
} as const;
