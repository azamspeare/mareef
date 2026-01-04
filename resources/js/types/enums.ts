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

/**
 * Quiz question types matching backend QuizTypeEnum
 */
export type QuizQuestionType =
    | 'single_choice'
    | 'multiple_choice'
    | 'true_false'
    | 'short_answer'
    | 'long_answer';

export const QuizQuestionType = {
    SINGLE_CHOICE: 'single_choice' as const,
    MULTIPLE_CHOICE: 'multiple_choice' as const,
    TRUE_FALSE: 'true_false' as const,
    SHORT_ANSWER: 'short_answer' as const,
    LONG_ANSWER: 'long_answer' as const,
} as const;

/**
 * Quiz question type labels for display
 */
export const QuizQuestionTypeLabels: Record<QuizQuestionType, string> = {
    [QuizQuestionType.SINGLE_CHOICE]: 'Single Choice',
    [QuizQuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
    [QuizQuestionType.TRUE_FALSE]: 'True/False',
    [QuizQuestionType.SHORT_ANSWER]: 'Short Answer',
    [QuizQuestionType.LONG_ANSWER]: 'Long Answer',
};

/**
 * Get all quiz question types as array
 */
export const getQuizQuestionTypes = (): QuizQuestionType[] =>
    Object.values(QuizQuestionType) as QuizQuestionType[];
