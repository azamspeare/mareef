import { Link } from "@inertiajs/react";
import { useRef, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { autoResizeTextarea } from "@/lib/block-note";

interface WritingFormLayoutProps {
    /** The back button link */
    backHref: string;
    /** Subtitle shown next to back button */
    subtitle: string;
    /** Primary action button label */
    actionLabel: string;
    /** Called when action button is clicked */
    onAction: () => void;
    /** Whether the action button should be disabled */
    actionDisabled?: boolean;
    /** Current title value */
    title: string;
    /** Called when title changes */
    onTitleChange: (title: string) => void;
    /** Whether to auto-focus the title input */
    autoFocus?: boolean;
    /** Children (typically WritingEditor and PublishModal) */
    children: ReactNode;
}

/**
 * Shared layout component for writing forms (create/edit).
 * Includes header with back button and action button, and title input.
 */
export function WritingFormLayout({
    backHref,
    subtitle,
    actionLabel,
    onAction,
    actionDisabled,
    title,
    onTitleChange,
    autoFocus,
    children,
}: WritingFormLayoutProps) {
    const titleRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto-resize title on initial load if there's content
    useEffect(() => {
        if (titleRef.current && title) {
            autoResizeTextarea(titleRef.current);
        }
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="max-w-3xl lg:max-w-4xl 2xl:max-w-6xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <header className="flex items-center justify-between py-6">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Link href={backHref} className="hover:text-foreground transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-sm">{subtitle}</span>
                    </div>
                    <Button
                        onClick={onAction}
                        className="rounded-full px-6"
                        disabled={actionDisabled}
                    >
                        {actionLabel}
                    </Button>
                </header>

                {/* Main Content */}
                <main className="pb-16">
                    {/* Title Input */}
                    <textarea
                        ref={titleRef}
                        placeholder="Title..."
                        rows={1}
                        autoFocus={autoFocus}
                        className="w-full overflow-hidden resize-none border-0 bg-transparent text-2xl font-bold leading-tight placeholder:text-muted-foreground focus:outline-none focus:ring-0 md:text-3xl"
                        value={title}
                        onInput={() => autoResizeTextarea(titleRef.current)}
                        onChange={(e) => onTitleChange(e.target.value)}
                    />

                    {children}
                </main>
            </div>
        </div>
    );
}
