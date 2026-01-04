import type { QuizQuestionType, SubmissionStatus } from '../enums';
import { QuizQuestionType as QuizQuestionTypeEnum } from '../enums';

/**
 * Quiz option for choice-based questions (teacher/form view)
 */
export interface QuizOption {
    id: string;
    content: string;
    is_correct: boolean;
    order: number;
}

/**
 * Quiz option for student view (without is_correct)
 */
export interface QuizOptionStudent {
    id: number;
    content: string;
    order: number;
}

/**
 * Quiz question for student view
 */
export interface QuizQuestionStudent {
    id: number;
    type: QuizQuestionType;
    content: string;
    order: number;
    point: number;
    options: QuizOptionStudent[];
}

/**
 * Quiz for student task page
 */
export interface QuizTask {
    id: number;
    title: string;
    description: string | null;
    allocated_time: string;
    slug: string;
    questions: QuizQuestionStudent[];
}

/**
 * Quiz answer (student's selected options for a question)
 */
export interface QuizAnswer {
    id: number;
    submission_id: number;
    question_id: number;
    options: number[]; // array of selected option IDs
    is_correct: boolean;
    correct_options?: number[]; // only available after submission is completed
}

/**
 * Quiz submission for student
 */
export interface QuizSubmission {
    id: number;
    quiz_id: number;
    student_id: number;
    score: number;
    spent_time: string | null;
    submitted_at: string | null;
    status: SubmissionStatus;
    created_at: string;
    answers: QuizAnswer[];
}

/**
 * Quiz question
 */
export interface QuizQuestion {
    id: string;
    type: QuizQuestionType;
    content: string;
    order: number;
    point: number;
    options: QuizOption[];
}

/**
 * Quiz option from database (teacher submission view - includes is_correct)
 */
export interface QuizOptionDB {
    id: number;
    content: string;
    is_correct: boolean;
    order: number;
}

/**
 * Quiz question from database (teacher submission view)
 */
export interface QuizQuestionDB {
    id: number;
    type: QuizQuestionType;
    content: string;
    order: number;
    point: number;
    options: QuizOptionDB[];
}

/**
 * Quiz summary for submission detail view
 */
export interface QuizSummary {
    id: number;
    title: string;
    slug: string;
    allocated_time: string | null;
    questions: QuizQuestionDB[];
}

/**
 * Student info for submission
 */
export interface QuizSubmissionStudent {
    id: number;
    name: string;
    email: string;
    username: string;
    avatar: string;
}

/**
 * Quiz submission detail (for teacher view)
 */
export interface QuizSubmissionDetail {
    id: number;
    quiz_id: number;
    student_id: number;
    score: number;
    spent_time: string | null;
    submitted_at: string | null;
    feedback: string | null;
    evaluated_at: string | null;
    created_at: string;
    quiz: QuizSummary;
    student: QuizSubmissionStudent;
    answers: QuizAnswer[];
}

/**
 * Quiz form data for creating/editing
 */
export interface QuizFormData {
    title: string;
    description: string;
    allocated_time: string | null;
    questions: QuizQuestion[];
}

/**
 * Quiz draft data for localStorage persistence
 */
export interface QuizDraft extends Record<string, unknown> {
    title: string;
    description: string;
    questions: QuizQuestion[];
    allocated_time: string | null;
}

/**
 * Check if question type supports options
 */
export function hasOptions(type: QuizQuestionType): boolean {
    const optionTypes: QuizQuestionType[] = [
        QuizQuestionTypeEnum.SINGLE_CHOICE,
        QuizQuestionTypeEnum.MULTIPLE_CHOICE,
        QuizQuestionTypeEnum.TRUE_FALSE,
    ];
    return optionTypes.includes(type);
}

/**
 * Check if question type allows multiple correct answers
 */
export function allowsMultipleCorrect(type: QuizQuestionType): boolean {
    return type === QuizQuestionTypeEnum.MULTIPLE_CHOICE;
}

/**
 * Create a new empty question
 */
export function createEmptyQuestion(order: number, type: QuizQuestionType = QuizQuestionTypeEnum.SINGLE_CHOICE): QuizQuestion {
    let options: QuizOption[] = [];

    if (type === QuizQuestionTypeEnum.TRUE_FALSE) {
        options = createTrueFalseOptions();
    } else if (hasOptions(type)) {
        options = [
            { id: crypto.randomUUID(), content: '', is_correct: false, order: 1 },
            { id: crypto.randomUUID(), content: '', is_correct: false, order: 2 },
        ];
    }

    return {
        id: crypto.randomUUID(),
        type,
        content: '',
        order,
        point: 1,
        options,
    };
}

/**
 * Create a new empty option
 */
export function createEmptyOption(order: number): QuizOption {
    return {
        id: crypto.randomUUID(),
        content: '',
        is_correct: false,
        order,
    };
}

/**
 * Create default true/false options
 */
export function createTrueFalseOptions(): QuizOption[] {
    return [
        { id: crypto.randomUUID(), content: 'True', is_correct: false, order: 1 },
        { id: crypto.randomUUID(), content: 'False', is_correct: false, order: 2 },
    ];
}

/**
 * Check if a question has valid correct answer(s) based on its type
 */
export function hasValidCorrectAnswer(question: QuizQuestion): boolean {
    // Non-option types don't need correct answer validation
    if (!hasOptions(question.type)) {
        return true;
    }

    const correctCount = question.options.filter(o => o.is_correct).length;

    // Single choice and true/false require exactly one correct answer
    if (question.type === QuizQuestionTypeEnum.SINGLE_CHOICE || question.type === QuizQuestionTypeEnum.TRUE_FALSE) {
        return correctCount === 1;
    }

    // Multiple choice requires at least one correct answer
    if (question.type === QuizQuestionTypeEnum.MULTIPLE_CHOICE) {
        return correctCount >= 1;
    }

    return true;
}

/**
 * Get validation error message for a question's correct answer
 */
export function getCorrectAnswerError(question: QuizQuestion): string | null {
    if (!hasOptions(question.type)) {
        return null;
    }

    const correctCount = question.options.filter(o => o.is_correct).length;

    if (question.type === QuizQuestionTypeEnum.SINGLE_CHOICE || question.type === QuizQuestionTypeEnum.TRUE_FALSE) {
        if (correctCount === 0) {
            return 'Please select one correct answer';
        }
        if (correctCount > 1) {
            return 'Only one correct answer is allowed';
        }
    }

    if (question.type === QuizQuestionTypeEnum.MULTIPLE_CHOICE) {
        if (correctCount === 0) {
            return 'Please select at least one correct answer';
        }
    }

    return null;
}
