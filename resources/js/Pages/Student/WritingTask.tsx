import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button.tsx";
import { ThemeToggle } from "@/components/theme-toggle.tsx";
import { en } from "@blocknote/core/locales";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable.tsx";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { Clock, UserCheck, GraduationCap, PenLine, ArrowUpRightIcon } from "lucide-react";
import { ogImages } from "@/lib/images";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner.tsx";
import { FlashToaster } from "@/components/flash-toaster.tsx";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import {
    getLocalStorageValue,
    setLocalStorageValue,
    removeLocalStorageValue,
} from "@/hooks/use-local-storage.ts";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty.tsx";
import { useTimer } from "@/hooks/use-timer.ts";
import { useAutoSave } from "@/hooks/use-auto-save.ts";
import { extractPlainText, type Annotation } from '@/components/annotation';
import { EditorPanel } from "@/components/writing-task";
import type { WritingTask as Writing, StudentSubmission as Submission } from "@/types";

interface WritingTaskProps {
    writing: Writing;
    submission: Submission | null;
}

// Utility: Get draft from localStorage
function getLocalDraft(storageKey: string | null): any[] | null {
    if (!storageKey) return null;

    const parsed = getLocalStorageValue<any[] | null>(storageKey, null);
    if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <div className="flex items-center justify-between md:justify-start md:gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <span className="font-bold text-sm">M</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight md:text-xl">Writing Task</h1>
                    </div>
                    <div className="md:hidden">
                        <ThemeToggle />
                    </div>
                </div>

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
                        <Button className="w-full" size="default" onClick={handleLogin}>
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

                        <Button variant="outline" className="w-full" size="default" onClick={handleRegister}>
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
                <Button variant="link" asChild className="text-muted-foreground" size="sm">
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

    const locale = en;
    const isMobile = useIsMobile();

    // Storage key uses submission.id to be student-specific
    const storageKey = submission?.id ? `writing_draft_${submission.id}` : null;

    // Create a writing editor
    const initialEditorContent = useMemo(() => {
        const localDraft = getLocalDraft(storageKey);
        if (localDraft) return localDraft;

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

    // Word count calculation
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

    // Update editor content when submission changes
    useEffect(() => {
        if (!submission?.content) return;

        const localDraft = getLocalDraft(storageKey);
        if (localDraft) {
            writingEditor.replaceBlocks(writingEditor.document, localDraft);
            updateWordCount();
            return;
        }

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
                if (storageKey) {
                    removeLocalStorageValue(storageKey);
                }
            }
        });
    }, [writing.id, writingEditor, spentTime, timeLeft, isInProgress, storageKey]);

    // Editor change handler
    const handleEditorChange = useCallback(() => {
        updateWordCount();
        markDirty();
        if (storageKey) {
            setLocalStorageValue(storageKey, writingEditor.document);
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

    // Shared props for EditorPanel
    const editorPanelProps = {
        isAuthenticated,
        hasStarted,
        isEvaluated,
        isInProgress,
        timeLeft,
        wordCount,
        editor: writingEditor,
        submissionId: submission?.id,
        submissionStatus: submission?.status,
        onEditorChange: handleEditorChange,
        feedback: submission?.feedback,
        feedbackAnnotations,
        submissionPlainText,
        commentsDrawerOpen,
        onCommentsDrawerOpenChange: setCommentsDrawerOpen,
        emptyState: <EmptyState onStart={handleStart} />,
    };

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <Head>
                <title>Writing Task</title>
                <meta property="og:title" content={writing.title || "Writing Task"} />
                <meta property="og:description" content="Complete your writing task on Mareef." />
                <meta property="og:image" content={ogImages.writingTask} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={ogImages.writingTask} />
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
                    <div className="h-full flex flex-col">
                        <div className="h-[40%] overflow-y-auto bg-muted/30">
                            <TaskPanel title={writing.title} content={writing.content} />
                        </div>
                        <div className="h-px bg-border shrink-0" />
                        <div className="flex-1 overflow-hidden">
                            <EditorPanel {...editorPanelProps} variant="mobile" />
                        </div>
                    </div>
                ) : (
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={50} minSize={20} maxSize={50} className="bg-muted/30">
                            <TaskPanel title={writing.title} content={writing.content} />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50} minSize={30}>
                            <EditorPanel {...editorPanelProps} variant="desktop" />
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
                        <Button variant="outline" onClick={() => setIsFinishDialogOpen(false)}>
                            Continue Writing
                        </Button>
                        <Button onClick={handleFinish}>
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <FlashToaster />
            <Toaster position="bottom-center" />
        </div>
    );
}
