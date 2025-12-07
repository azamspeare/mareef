import { useState, useEffect, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";

interface UseAutoSaveOptions {
    isActive: boolean;
    interval?: number; // in milliseconds, default 30000 (30 seconds)
    routeName: string;
    getPayload: () => Record<string, any>;
}

interface UseAutoSaveReturn {
    isSaving: boolean;
    saveNow: () => void;
}

/**
 * Custom hook for auto-saving content at regular intervals
 */
export function useAutoSave({
    isActive,
    interval = 30000,
    routeName,
    getPayload,
}: UseAutoSaveOptions): UseAutoSaveReturn {
    const [isSaving, setIsSaving] = useState(false);
    const getPayloadRef = useRef(getPayload);

    // Keep the ref updated with latest getPayload function
    useEffect(() => {
        getPayloadRef.current = getPayload;
    }, [getPayload]);

    const saveNow = useCallback(() => {
        if (!isActive) return;

        setIsSaving(true);
        router.post(route(routeName), getPayloadRef.current(), {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    }, [isActive, routeName]);

    // Auto-save interval
    useEffect(() => {
        if (!isActive) return;

        const autoSaveTimer = setInterval(() => {
            setIsSaving(true);
            router.post(route(routeName), getPayloadRef.current(), {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            });
        }, interval);

        return () => clearInterval(autoSaveTimer);
    }, [isActive, interval, routeName]);

    return {
        isSaving,
        saveNow,
    };
}
