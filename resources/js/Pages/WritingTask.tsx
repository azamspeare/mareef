import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { en } from "@blocknote/core/locales";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { Clock, UserCheck, GraduationCap, PenLine, ArrowUpRightIcon, MessageSquare, Star } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { useTimer } from "@/hooks/use-timer";
import { useAutoSave } from "@/hooks/use-auto-save";
import {
    AnnotationEditor,
    extractPlainText,
    type Annotation,
    type AnnotationData,
} from '@/components/annotation';

// Types
interface Writing {
    id: number;
    title: string;
    content: any;
    allocated_time: string;
    slug: string;
}

interface Feedback {
    id: number;
    submission_id: number;
    content: AnnotationData | null;
    score: number | null;
    feedback: string | null;
    created_at: string;
    updated_at: string;
}

interface Submission {
    id: number;
    writing_id: number;
    student_id: number;
    content: any;
    spent_time: string;
    submitted_at: string;
    evaluated_at: string | null;
    status: 'in_progress' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
    feedback: Feedback | null;
}

interface WritingTaskProps {
    writing: Writing;
    submission: Submission | null;
}

// Utility: Get draft from localStorage
function getLocalDraft(storageKey: string | null): any[] | null {
    if (typeof window === "undefined" || !storageKey) return null;

    const localDraft = localStorage.getItem(storageKey);
    if (!localDraft) return null;

    try {
        const parsed = JSON.parse(localDraft);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
    } catch (e) {
        console.error("Failed to parse local draft", e);
    }
    return null;
}

// Utility: Parse submission content
function parseSubmissionContent(content: any): any[] | null {
    if (!content) return null;

    try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
    } catch (e) {
        console.error("Failed to parse submission content", e);
    }
    return null;
}

// Header Component
interface HeaderProps {
    isSaving: boolean;
    isInProgress: boolean;
    isCompleted: boolean;
    formattedTime: string;
    timeColorClass: string;
    timeLeft: number;
    completedSpentTime?: string;
    onFinishClick: () => void;
}

const Header = memo(function Header({
    isSaving,
    isInProgress,
    isCompleted,
    formattedTime,
    timeColorClass,
    timeLeft,
    completedSpentTime,
    onFinishClick,
}: HeaderProps) {
    return (
        <header className="px-4 py-3 border-b border-border bg-card md:px-6">
            {/* Mobile: 2 rows, Desktop: 1 row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                {/* Row 1 on mobile: Logo + Theme Toggle */}
                <div className="flex items-center justify-between md:justify-start md:gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <span className="font-bold text-sm">M</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight md:text-xl">Writing Task</h1>
                    </div>
                    {/* Theme toggle - visible on mobile in row 1 */}
                    <div className="md:hidden">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Row 2 on mobile: Time + Actions */}
                <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        {isSaving && (
                            <span className="text-sm text-muted-foreground">Saving...</span>
                        )}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm ${isInProgress ? timeColorClass : 'bg-muted'}`}>
                            <Clock className="w-4 h-4" />
                            <span>{formattedTime}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Theme toggle - visible on desktop */}
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>
                        {isInProgress && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={onFinishClick}
                                disabled={timeLeft <= 0}
                                className="relative overflow-hidden group md:size-default"
                            >
                                <span className="relative z-10">Finish</span>
                                <div className="absolute top-0 -left-[100%] w-[50%] h-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 dark:via-black/20 to-transparent animate-shine" />
                            </Button>
                        )}
                        {isCompleted && (
                            <Button variant="outline" size="sm" disabled className="md:size-default">
                                Completed {completedSpentTime && `· ${completedSpentTime}`}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
});

// Task Panel Component (Left side - read-only task content)
interface TaskPanelProps {
    title: string;
    content: any;
}

const TaskPanel = memo(function TaskPanel({ title, content }: TaskPanelProps) {
    const { theme } = useTheme();

    const taskEditor = useCreateBlockNote({
        initialContent: content
            ? (Array.isArray(content) ? content : JSON.parse(content as string))
            : undefined,
    });

    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                    {title}
                </h1>
                <div className="prose prose-stone dark:prose-invert max-w-none [&_.bn-container]:bg-transparent [&_.bn-editor]:p-0 [&_.bn-editor]:bg-transparent writing-details">
                    <BlockNoteView
                        editor={taskEditor}
                        theme={theme === "dark" ? "dark" : "light"}
                        editable={false}
                    />
                </div>
            </div>
        </div>
    );
});

// Login Drawer Component
interface LoginDrawerProps {
    isOpen: boolean;
}

const LoginDrawer = memo(function LoginDrawer({ isOpen }: LoginDrawerProps) {
    const handleLogin = useCallback(() => {
        window.location.href = route('student.auth.google.redirect');
    }, []);

    const handleRegister = useCallback(() => {
        window.location.href = route('student.auth.register');
    }, []);

    return (
        <Drawer open={isOpen} dismissible={false}>
            <DrawerContent className="max-w-full">
                <DrawerHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-primary/10">
                            <GraduationCap className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <DrawerTitle className="text-2xl mb-2">
                        Ready to Start Your Writing Test?
                    </DrawerTitle>
                    <DrawerDescription className="text-base max-w-md mx-auto">
                        Please log in to begin your writing task.
                        This allows us to save your progress, track your performance,
                        and enable your teacher to provide personalized feedback.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 pb-8">
                    <div className="max-w-sm mx-auto space-y-3">
                        <Button
                            className="w-full"
                            size="default"
                            onClick={handleLogin}
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Log In with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">or</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            size="default"
                            onClick={handleRegister}
                        >
                            Register Manually
                        </Button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground max-w-md mx-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Track Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Get Feedback</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span>Save Work</span>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
});

// Empty State Component
interface EmptyStateProps {
    onStart: () => void;
}

const EmptyState = memo(function EmptyState({ onStart }: EmptyStateProps) {
    return (
        <Empty className="h-full border-0">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PenLine />
                </EmptyMedia>
                <EmptyTitle>No Submission Yet</EmptyTitle>
                <EmptyDescription>
                    You haven't taken this writing test yet. Click the button below to start your submission.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={onStart}>
                    Start Writing
                </Button>
                <Button
                    variant="link"
                    asChild
                    className="text-muted-foreground"
                    size="sm"
                >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        Learn More <ArrowUpRightIcon />
                    </a>
                </Button>
            </EmptyContent>
        </Empty>
    );
});

// Main Component
export default function WritingTask({ writing, submission }: WritingTaskProps) {
    const { props } = usePage<{
        auth?: { user?: any };
        flash?: { success?: string; error?: string; message?: string }
    }>();

    const isAuthenticated = !!props.auth?.user;
    const hasStarted = !!submission;
    const isCompleted = submission?.status === 'completed';
    const isInProgress = submission?.status === 'in_progress';
    const isEvaluated = !!submission?.feedback;

    const [wordCount, setWordCount] = useState(0);
    const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(!isAuthenticated);
    const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
    const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);

    const { theme } = useTheme();
    const locale = en;
    const isMobile = useIsMobile();

    // Storage key uses submission.id to be student-specific
    const storageKey = submission?.id ? `writing_draft_${submission.id}` : null;

    // Create a writing editor
    const initialEditorContent = useMemo(() => {
        // 1. Try local storage (only if we have a submission/student-specific key)
        const localDraft = getLocalDraft(storageKey);
        if (localDraft) return localDraft;

        // 2. Fallback to server submission
        const serverContent = parseSubmissionContent(submission?.content);
        if (serverContent) return serverContent;

        return [{ type: "paragraph" as const, content: "" }];
    }, [submission?.content, storageKey]);

    const schema = BlockNoteSchema.create({
        blockSpecs: {
            paragraph: defaultBlockSpecs.paragraph,
        },
        styleSpecs: {},
    });

    const writingEditor = useCreateBlockNote({
        schema,
        initialContent: initialEditorContent,
        domAttributes: {
            editor: {
                class: "bn-editor-plain",
            },
        },
        dictionary: {
            ...locale,
            placeholders: {
                ...locale.placeholders,
                emptyDocument: "Start typing..",
                default: "Start typing..",
                heading: "Start typing..",
            },
        },
    });

    // Parse submission content for plain text (used for annotation display)
    const submissionBlocks = useMemo(() => {
        if (!submission?.content) return [];
        return Array.isArray(submission.content)
            ? submission.content
            : JSON.parse(submission.content as string);
    }, [submission?.content]);

    const submissionPlainText = useMemo(
        () => extractPlainText(submissionBlocks),
        [submissionBlocks]
    );

    // Parse existing annotations from feedback
    const feedbackAnnotations = useMemo((): Annotation[] => {
        if (!submission?.feedback?.content) return [];
        const content = submission.feedback.content;
        if (typeof content === 'string') {
            try {
                const parsed = JSON.parse(content);
                return parsed.annotations || [];
            } catch {
                return [];
            }
        }
        return content.annotations || [];
    }, [submission?.feedback?.content]);

    // Use custom timer hook
    const { timeLeft, formattedTime, timeColorClass, spentTime } = useTimer({
        allocatedTime: writing.allocated_time,
        startedAt: submission?.created_at,
        isActive: isInProgress,
        onTimeUp: useCallback(() => {
            toast.error("Time's up! Submitting your work automatically.");
        }, []),
    });

    // Get auto-save payload
    const getAutoSavePayload = useCallback(() => ({
        writing_id: writing.id,
        content: JSON.stringify(writingEditor.document),
    }), [writing.id, writingEditor]);

    // Use custom auto-save hook with dirty tracking
    const { isSaving, markDirty } = useAutoSave({
        isActive: isInProgress,
        interval: 60000,
        routeName: 'student.tasks.submissions.save',
        getPayload: getAutoSavePayload,
    });

    // Word count calculation (defined early as it's used by multiple effects)
    const updateWordCount = useCallback(() => {
        let text = "";
        writingEditor.document.forEach((block: any) => {
            if (block.content) {
                if (Array.isArray(block.content)) {
                    block.content.forEach((span: any) => {
                        if (span.text) {
                            text += span.text + " ";
                        }
                    });
                } else if (typeof block.content === "string") {
                    text += block.content + " ";
                }
            }
        });

        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    }, [writingEditor]);

    // Update drawer state when authentication changes
    useEffect(() => {
        setIsLoginDrawerOpen(!isAuthenticated);
    }, [isAuthenticated]);

    // Handle flash messages
    useEffect(() => {
        const flash = props.flash;
        if (!flash) return;

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.message) {
            toast.info(flash.message);
        }
    }, [props.flash]);

    // Update editor content when submission changes (but respect localStorage draft)
    useEffect(() => {
        if (!submission?.content) return;

        // If localStorage has a draft, use it instead of server content
        const localDraft = getLocalDraft(storageKey);
        if (localDraft) {
            writingEditor.replaceBlocks(writingEditor.document, localDraft);
            updateWordCount();
            return;
        }

        // Fallback to server content
        const serverContent = parseSubmissionContent(submission.content);
        if (serverContent) {
            writingEditor.replaceBlocks(writingEditor.document, serverContent);
            updateWordCount();
        }
    }, [submission?.id, submission?.status, storageKey, writingEditor, updateWordCount]);

    // Start the task
    const handleStart = useCallback(() => {
        router.post(route('student.tasks.submissions.start'), {
            writing_id: writing.id,
        });
    }, [writing.id]);

    // Open the finish confirmation dialog
    const handleFinishClick = useCallback(() => {
        setIsFinishDialogOpen(true);
    }, []);

    // Finish the task
    const handleFinish = useCallback(() => {
        if (timeLeft <= 0 && !isInProgress) return;

        setIsFinishDialogOpen(false);
        router.post(route('student.tasks.submissions.finish'), {
            writing_id: writing.id,
            content: JSON.stringify(writingEditor.document),
            spent_time: spentTime,
        }, {
            onSuccess: () => {
                if (typeof window !== "undefined" && storageKey) {
                    localStorage.removeItem(storageKey);
                }
            }
        });
    }, [writing.id, writingEditor, spentTime, timeLeft, isInProgress, storageKey]);

    // Editor change handler
    const handleEditorChange = useCallback(() => {
        updateWordCount();
        markDirty(); // Mark content as dirty for auto-save
        if (typeof window !== "undefined" && storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(writingEditor.document));
        }
    }, [updateWordCount, writingEditor, storageKey, markDirty]);

    // Force paste as plain text inside the writing editor
    useEffect(() => {
        const editorElement = document.querySelector(".bn-editor-plain") as HTMLElement | null;
        if (!editorElement) return;

        const handlePaste = (event: ClipboardEvent) => {
            event.preventDefault();
        };

        editorElement.addEventListener("paste", handlePaste);
        return () => editorElement.removeEventListener("paste", handlePaste);
    }, []);

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeLeft <= 0 && isInProgress) {
            handleFinish();
        }
    }, [timeLeft, isInProgress, handleFinish]);

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <Head>
                <title>Writing Task</title>
                <meta property="og:title" content={writing.title || "Writing Task"} />
                <meta property="og:description" content="Complete your writing task on Mareef." />
                <meta property="og:image" content="/images/og/writing-task.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="/images/og/writing-task.png" />
            </Head>

            <Header
                isSaving={isSaving}
                isInProgress={isInProgress}
                isCompleted={isCompleted}
                formattedTime={formattedTime}
                timeColorClass={timeColorClass}
                timeLeft={timeLeft}
                completedSpentTime={submission?.spent_time}
                onFinishClick={handleFinishClick}
            />

            {/* Main Content - Split Pane */}
            <div className="flex-1 overflow-hidden">
                {isMobile ? (
                    /* Mobile Layout - Vertical with static separator */
                    <div className="h-full flex flex-col">
                        {/* Top - Task Description */}
                        <div className="h-[40%] overflow-y-auto bg-muted/30">
                            <TaskPanel title={writing.title} content={writing.content} />
                        </div>

                        {/* Static Separator */}
                        <div className="h-px bg-border shrink-0" />

                        {/* Bottom - Editor */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full flex flex-col px-4 pt-4">
                                {/* Feedback Summary Banner */}
                                {isEvaluated && (
                                    <div className="mb-4 rounded-lg border bg-card p-3">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-muted">
                                                    <Star className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Your submission has been evaluated
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {submission?.feedback?.score !== null && (
                                                            <span>Score: {submission?.feedback?.score} · </span>
                                                        )}
                                                        {feedbackAnnotations.length} comment(s) from your teacher
                                                    </p>
                                                </div>
                                            </div>
                                            {feedbackAnnotations.length > 0 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCommentsDrawerOpen(true)}
                                                    className="gap-2 w-full"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                    View Comments
                                                </Button>
                                            )}
                                        </div>
                                        {submission?.feedback?.feedback && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-sm font-medium mb-1">
                                                    Overall Feedback:
                                                </p>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {submission.feedback.feedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto">
                                    {!hasStarted && isAuthenticated && (
                                        <EmptyState onStart={handleStart} />
                                    )}
                                    {!hasStarted && !isAuthenticated && (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <p>Please log in to start writing</p>
                                        </div>
                                    )}
                                    {hasStarted && !isEvaluated && (
                                        <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 writing-details">
                                            <BlockNoteView
                                                key={`editor-${submission?.status}-${submission?.id}`}
                                                editor={writingEditor}
                                                theme={theme === "dark" ? "dark" : "light"}
                                                slashMenu={false}
                                                sideMenu={false}
                                                formattingToolbar={false}
                                                editable={isInProgress && timeLeft > 0}
                                                onChange={handleEditorChange}
                                            />
                                        </div>
                                    )}
                                    {hasStarted && isEvaluated && (
                                        <AnnotationEditor
                                            text={submissionPlainText}
                                            annotations={feedbackAnnotations}
                                            isEditable={false}
                                            onAddAnnotation={() => {}}
                                            onUpdateAnnotation={() => {}}
                                            onRemoveAnnotation={() => {}}
                                            drawerOpen={commentsDrawerOpen}
                                            onDrawerOpenChange={setCommentsDrawerOpen}
                                        />
                                    )}
                                </div>
                                {hasStarted && (
                                    <div className="my-3 text-right text-sm text-muted-foreground">
                                        Words: {wordCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Desktop Layout - Horizontal with resizable panels */
                    <ResizablePanelGroup direction="horizontal">
                        {/* Left Panel - Task Content */}
                        <ResizablePanel
                            defaultSize={50}
                            minSize={20}
                            maxSize={50}
                            className="bg-muted/30"
                        >
                            <TaskPanel title={writing.title} content={writing.content} />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Right Panel - Editor or Feedback View */}
                        <ResizablePanel defaultSize={50} minSize={30}>
                            <div className="h-full flex flex-col px-8 pt-8">
                                {/* Feedback Summary Banner */}
                                {isEvaluated && (
                                    <div className="mb-6 rounded-lg border bg-card p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-muted">
                                                    <Star className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Your submission has been evaluated
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {submission?.feedback?.score !== null && (
                                                            <span>Score: {submission?.feedback?.score} · </span>
                                                        )}
                                                        {feedbackAnnotations.length} comment(s) from your teacher
                                                    </p>
                                                </div>
                                            </div>
                                            {feedbackAnnotations.length > 0 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCommentsDrawerOpen(true)}
                                                    className="gap-2"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                    View Comments
                                                </Button>
                                            )}
                                        </div>
                                        {submission?.feedback?.feedback && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-sm font-medium mb-1">
                                                    Overall Feedback:
                                                </p>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {submission.feedback.feedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto">
                                    {!hasStarted && isAuthenticated && (
                                        <EmptyState onStart={handleStart} />
                                    )}
                                    {!hasStarted && !isAuthenticated && (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <p>Please log in to start writing</p>
                                        </div>
                                    )}
                                    {hasStarted && !isEvaluated && (
                                        <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 writing-details">
                                            <BlockNoteView
                                                key={`editor-${submission?.status}-${submission?.id}`}
                                                editor={writingEditor}
                                                theme={theme === "dark" ? "dark" : "light"}
                                                slashMenu={false}
                                                sideMenu={false}
                                                formattingToolbar={false}
                                                editable={isInProgress && timeLeft > 0}
                                                onChange={handleEditorChange}
                                            />
                                        </div>
                                    )}
                                    {hasStarted && isEvaluated && (
                                        <AnnotationEditor
                                            text={submissionPlainText}
                                            annotations={feedbackAnnotations}
                                            isEditable={false}
                                            onAddAnnotation={() => {}}
                                            onUpdateAnnotation={() => {}}
                                            onRemoveAnnotation={() => {}}
                                            drawerOpen={commentsDrawerOpen}
                                            onDrawerOpenChange={setCommentsDrawerOpen}
                                        />
                                    )}
                                </div>
                                {hasStarted && (
                                    <div className="my-4 text-right text-sm text-muted-foreground">
                                        Words: {wordCount}
                                    </div>
                                )}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )}
            </div>

            <LoginDrawer isOpen={isLoginDrawerOpen} />

            {/* Finish Confirmation Dialog */}
            <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit your writing?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to finish and submit your writing task?
                            This action cannot be undone, and you won't be able to make
                            any further changes after submission.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Time remaining: {formattedTime}</span>
                        </div>
                        <div>Words: {wordCount}</div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsFinishDialogOpen(false)}
                        >
                            Continue Writing
                        </Button>
                        <Button onClick={handleFinish}>
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Toaster position="bottom-center" />
        </div>
    );
}
