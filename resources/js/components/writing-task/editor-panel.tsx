import { memo, ReactNode } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { FeedbackBanner } from "./feedback-banner";
import {
    AnnotationEditor,
    type Annotation,
} from "@/components/annotation";
import type { WritingFeedback as Feedback } from "@/types";

interface EditorPanelProps {
    /** Whether the user is authenticated */
    isAuthenticated: boolean;
    /** Whether the user has started the submission */
    hasStarted: boolean;
    /** Whether the submission is evaluated */
    isEvaluated: boolean;
    /** Whether the submission is in progress */
    isInProgress: boolean;
    /** Time left in seconds */
    timeLeft: number;
    /** Word count */
    wordCount: number;
    /** BlockNote editor instance */
    editor: any;
    /** Submission ID for editor key */
    submissionId?: number;
    /** Submission status for editor key */
    submissionStatus?: string;
    /** Handler for editor content change */
    onEditorChange: () => void;
    /** Feedback data (when evaluated) */
    feedback?: Feedback | null;
    /** Feedback annotations */
    feedbackAnnotations: Annotation[];
    /** Plain text content for annotation display */
    submissionPlainText: string;
    /** Whether comments drawer is open */
    commentsDrawerOpen: boolean;
    /** Handler for comments drawer state change */
    onCommentsDrawerOpenChange: (open: boolean) => void;
    /** Empty state component to show when not started */
    emptyState: ReactNode;
    /** Layout variant */
    variant?: "mobile" | "desktop";
}

/**
 * Editor panel for WritingTask - handles the right side content area.
 * Displays feedback banner, editor, or annotation viewer based on submission state.
 */
export const EditorPanel = memo(function EditorPanel({
    isAuthenticated,
    hasStarted,
    isEvaluated,
    isInProgress,
    timeLeft,
    wordCount,
    editor,
    submissionId,
    submissionStatus,
    onEditorChange,
    feedback,
    feedbackAnnotations,
    submissionPlainText,
    commentsDrawerOpen,
    onCommentsDrawerOpenChange,
    emptyState,
    variant = "desktop",
}: EditorPanelProps) {
    const { theme } = useTheme();
    const isMobile = variant === "mobile";

    return (
        <div
            className={cn(
                "h-full flex flex-col",
                isMobile ? "px-4 pt-4" : "px-8 pt-8"
            )}
        >
            {/* Feedback Summary Banner */}
            {isEvaluated && feedback && (
                <FeedbackBanner
                    feedback={feedback}
                    annotations={feedbackAnnotations}
                    onViewComments={() => onCommentsDrawerOpenChange(true)}
                    variant={variant}
                />
            )}

            <div className="flex-1 overflow-y-auto">
                {/* Empty state - not started but authenticated */}
                {!hasStarted && isAuthenticated && emptyState}

                {/* Not authenticated message */}
                {!hasStarted && !isAuthenticated && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Please log in to start writing</p>
                    </div>
                )}

                {/* Editor - started but not evaluated */}
                {hasStarted && !isEvaluated && (
                    <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 writing-details">
                        <BlockNoteView
                            key={`editor-${submissionStatus}-${submissionId}`}
                            editor={editor}
                            theme={theme === "dark" ? "dark" : "light"}
                            slashMenu={false}
                            sideMenu={false}
                            formattingToolbar={false}
                            editable={isInProgress && timeLeft > 0}
                            onChange={onEditorChange}
                        />
                    </div>
                )}

                {/* Annotation viewer - evaluated */}
                {hasStarted && isEvaluated && (
                    <AnnotationEditor
                        text={submissionPlainText}
                        annotations={feedbackAnnotations}
                        isEditable={false}
                        onAddAnnotation={() => {}}
                        onUpdateAnnotation={() => {}}
                        onRemoveAnnotation={() => {}}
                        drawerOpen={commentsDrawerOpen}
                        onDrawerOpenChange={onCommentsDrawerOpenChange}
                    />
                )}
            </div>

            {/* Word count */}
            {hasStarted && (
                <div
                    className={cn(
                        "text-right text-sm text-muted-foreground",
                        isMobile ? "my-3" : "my-4"
                    )}
                >
                    Words: {wordCount}
                </div>
            )}
        </div>
    );
});
