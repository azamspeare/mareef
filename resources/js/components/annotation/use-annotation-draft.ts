import { useCallback, useEffect, useState } from 'react';
import type { Annotation, AnnotationData } from './types';

const DRAFT_KEY_PREFIX = 'annotation_draft_';

interface UseAnnotationDraftOptions {
    submissionId: number;
    originalText: string;
    existingAnnotations?: Annotation[];
}

interface UseAnnotationDraftReturn {
    annotations: Annotation[];
    setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
    addAnnotation: (annotation: Annotation) => void;
    updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
    removeAnnotation: (id: string) => void;
    clearDraft: () => void;
    hasDraft: boolean;
}

export function useAnnotationDraft({
    submissionId,
    originalText,
    existingAnnotations,
}: UseAnnotationDraftOptions): UseAnnotationDraftReturn {
    const storageKey = `${DRAFT_KEY_PREFIX}${submissionId}`;

    const [annotations, setAnnotations] = useState<Annotation[]>(() => {
        // Priority: existing annotations from server > draft from localStorage
        if (existingAnnotations && existingAnnotations.length > 0) {
            return existingAnnotations;
        }

        if (typeof window === 'undefined') return [];

        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed: AnnotationData = JSON.parse(saved);
                // Verify the draft is for the same content
                if (parsed.originalText === originalText) {
                    return parsed.annotations;
                }
                // Content changed, discard draft
                localStorage.removeItem(storageKey);
            }
        } catch {
            // Ignore parse errors
        }
        return [];
    });

    const [hasDraft, setHasDraft] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed: AnnotationData = JSON.parse(saved);
                return parsed.originalText === originalText && parsed.annotations.length > 0;
            }
        } catch {
            // Ignore
        }
        return false;
    });

    // Save to localStorage whenever annotations change
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (annotations.length > 0) {
            const data: AnnotationData = {
                annotations,
                originalText,
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
            setHasDraft(true);
        } else {
            localStorage.removeItem(storageKey);
            setHasDraft(false);
        }
    }, [annotations, originalText, storageKey]);

    const addAnnotation = useCallback((annotation: Annotation) => {
        setAnnotations((prev) => [...prev, annotation]);
    }, []);

    const updateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
        setAnnotations((prev) =>
            prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))
        );
    }, []);

    const removeAnnotation = useCallback((id: string) => {
        setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
    }, []);

    const clearDraft = useCallback(() => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(storageKey);
        setHasDraft(false);
    }, [storageKey]);

    return {
        annotations,
        setAnnotations,
        addAnnotation,
        updateAnnotation,
        removeAnnotation,
        clearDraft,
        hasDraft,
    };
}
