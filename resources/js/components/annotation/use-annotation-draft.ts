import { useCallback, useEffect, useState } from 'react';
import {
    getLocalStorageValue,
    setLocalStorageValue,
    removeLocalStorageValue,
} from '@/hooks/use-local-storage';
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

        const saved = getLocalStorageValue<AnnotationData | null>(storageKey, null);
        if (saved && saved.originalText === originalText) {
            return saved.annotations;
        }

        // Content changed or no saved draft, discard
        if (saved) {
            removeLocalStorageValue(storageKey);
        }

        return [];
    });

    const [hasDraft, setHasDraft] = useState(() => {
        const saved = getLocalStorageValue<AnnotationData | null>(storageKey, null);
        return saved !== null && saved.originalText === originalText && saved.annotations.length > 0;
    });

    // Save to localStorage whenever annotations change
    useEffect(() => {
        if (annotations.length > 0) {
            const data: AnnotationData = {
                annotations,
                originalText,
            };
            setLocalStorageValue(storageKey, data);
            setHasDraft(true);
        } else {
            removeLocalStorageValue(storageKey);
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
        removeLocalStorageValue(storageKey);
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
