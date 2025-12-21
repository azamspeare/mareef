import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import type { FlashMessages } from '@/types';

/**
 * Centralized flash message handler that automatically shows toast notifications
 * for flash messages from Laravel session.
 *
 * Place this component in your layout to handle all flash messages automatically.
 *
 * Supports: success, error, message, info, warning
 *
 * @example
 * // In your layout:
 * <FlashToaster />
 * <Toaster />
 */
export function FlashToaster() {
    const { flash } = usePage<{ flash: FlashMessages }>().props;

    // Track the last shown flash to prevent duplicate toasts on re-renders
    const lastFlashRef = useRef<string | null>(null);

    useEffect(() => {
        if (!flash) return;

        // Create a unique key for current flash state
        const flashKey = JSON.stringify(flash);

        // Skip if we've already shown this flash
        if (flashKey === lastFlashRef.current) return;
        lastFlashRef.current = flashKey;

        // Show appropriate toast for each flash type
        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        if (flash.message) {
            toast.message(flash.message);
        }

        if (flash.info) {
            toast.info(flash.info);
        }

        if (flash.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    // This component doesn't render anything
    return null;
}
