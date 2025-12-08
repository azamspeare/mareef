export type AnnotationColor = 'error' | 'suggestion' | 'praise' | 'neutral';

export interface Annotation {
    id: string;
    startOffset: number;
    endOffset: number;
    color: AnnotationColor;
    comment: string;
    createdAt: string;
}

export interface AnnotationData {
    annotations: Annotation[];
    originalText: string;
}

export const ANNOTATION_COLORS: Record<AnnotationColor, { label: string; bg: string; bgHover: string; border: string; text: string }> = {
    error: {
        label: 'Mistake',
        bg: 'bg-red-200 dark:bg-red-900/70',
        bgHover: 'hover:bg-red-300 dark:hover:bg-red-800/70',
        border: 'border-red-400 dark:border-red-700',
        text: 'text-red-800 dark:text-red-300',
    },
    suggestion: {
        label: 'Suggestion',
        bg: 'bg-yellow-200 dark:bg-yellow-900/70',
        bgHover: 'hover:bg-yellow-300 dark:hover:bg-yellow-800/70',
        border: 'border-yellow-400 dark:border-yellow-700',
        text: 'text-yellow-800 dark:text-yellow-300',
    },
    praise: {
        label: 'Good',
        bg: 'bg-green-200 dark:bg-green-900/70',
        bgHover: 'hover:bg-green-300 dark:hover:bg-green-800/70',
        border: 'border-green-400 dark:border-green-700',
        text: 'text-green-800 dark:text-green-300',
    },
    neutral: {
        label: 'Note',
        bg: 'bg-blue-200 dark:bg-blue-900/70',
        bgHover: 'hover:bg-blue-300 dark:hover:bg-blue-800/70',
        border: 'border-blue-400 dark:border-blue-700',
        text: 'text-blue-800 dark:text-blue-300',
    },
};

export function generateAnnotationId(): string {
    return `ann_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
