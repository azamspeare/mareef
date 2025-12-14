import { useState, useEffect, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";

interface UseAutoSaveOptions {
    isActive: boolean;
    interval?: number; // in milliseconds, default 60000 (60 seconds)
    routeName: string;
    getPayload: () => Record<string, any>;
    debounceMs?: number; // debounce time for manual saves, default 2000ms
}

interface UseAutoSaveReturn {
    isSaving: boolean;
    saveNow: () => void;
    markDirty: () => void; // Call this when content changes
}

/**
 * Custom hook for auto-saving content at regular intervals.
 * Optimized to only save when there are actual changes (dirty state).
 */
export function useAutoSave({
    isActive,
    interval = 60000,
    routeName,
    getPayload,
    debounceMs = 2000,
}: UseAutoSaveOptions): UseAutoSaveReturn {
    const [isSaving, setIsSaving] = useState(false);
    const getPayloadRef = useRef(getPayload);
    const isDirtyRef = useRef(false);
    const lastSavedContentRef = useRef<string | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isSavingRef = useRef(false);

    // Keep the ref updated with latest getPayload function
    useEffect(() => {
        getPayloadRef.current = getPayload;
    }, [getPayload]);

    // Perform the actual save
    const performSave = useCallback(() => {
        if (!isActive || isSavingRef.current) return;

        const payload = getPayloadRef.current();
        const contentString = JSON.stringify(payload.content);

        // Skip if content hasn't changed since last save
        if (contentString === lastSavedContentRef.current) {
            isDirtyRef.current = false;
            return;
        }

        isSavingRef.current = true;
        setIsSaving(true);

        router.post(route(routeName), payload, {
            preserveScroll: true,
            onSuccess: () => {
                lastSavedContentRef.current = contentString;
                isDirtyRef.current = false;
            },
            onFinish: () => {
                isSavingRef.current = false;
                setIsSaving(false);
            },
        });
    }, [isActive, routeName]);

    // Mark content as dirty (changed)
    const markDirty = useCallback(() => {
        isDirtyRef.current = true;
    }, []);

    // Manual save with debouncing
    const saveNow = useCallback(() => {
        if (!isActive) return;

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Debounce the save to prevent rapid successive saves
        debounceTimerRef.current = setTimeout(() => {
            performSave();
        }, debounceMs);
    }, [isActive, performSave, debounceMs]);

    // Auto-save interval - only saves if dirty
    useEffect(() => {
        if (!isActive) return;

        const autoSaveTimer = setInterval(() => {
            if (isDirtyRef.current) {
                performSave();
            }
        }, interval);

        return () => clearInterval(autoSaveTimer);
    }, [isActive, interval, performSave]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        isSaving,
        saveNow,
        markDirty,
    };
}
