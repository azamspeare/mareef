import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { Clock, UserCheck, GraduationCap, PenLine, ArrowUpRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
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

// Types
interface Writing {
    id: number;
    title: string;
    content: any;
    allocated_time: string;
    slug: string;
}

interface Submission {
    id: number;
    writing_id: number;
    student_id: number;
    content: any;
    spent_time: string;
    submitted_at: string;
    status: 'in_progress' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
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
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                    <span className="font-bold text-sm">M</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">Writing Task</h1>
            </div>
            <div className="flex items-center gap-4">
                {isSaving && (
                    <span className="text-sm text-muted-foreground">Saving...</span>
                )}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm ${isInProgress ? timeColorClass : 'bg-muted'}`}>
                    <Clock className="w-4 h-4" />
                    <span>{formattedTime}</span>
                </div>
                <ThemeToggle />
                {isInProgress && (
                    <Button
                        variant="default"
                        onClick={onFinishClick}
                        disabled={timeLeft <= 0}
                        className="relative overflow-hidden group"
                    >
                        <span className="relative z-10">Finish</span>
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 dark:via-black/20 to-transparent animate-shine" />
                    </Button>
                )}
                {isCompleted && (
                    <Button variant="outline" disabled>
                        Completed {completedSpentTime && `· ${completedSpentTime}`}
                    </Button>
                )}
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
        window.location.href = route('auth.google.redirect');
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
                    <div className="max-w-sm mx-auto">
                        <Button
                            className="w-full"
                            size="default"
                            onClick={handleLogin}
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Log In with Google
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

    const [wordCount, setWordCount] = useState(0);
    const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(!isAuthenticated);
    const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

    const { theme } = useTheme();

    // Memoize OG image URL to avoid recalculating on every render
    const ogImageUrl = useMemo(() => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/images/writing-task-og.png`;
    }, []);

    // Storage key uses submission.id to be student-specific
    const storageKey = submission?.id ? `writing_draft_${submission.id}` : null;

    // Create writing editor
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
    });

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

    // Use custom auto-save hook
    const { isSaving } = useAutoSave({
        isActive: isInProgress,
        interval: 60000,
        routeName: 'tasks.submissions.save',
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
        router.post(route('tasks.submissions.start'), {
            writing_id: writing.id,
        });
    }, [writing.id]);

    // Open finish confirmation dialog
    const handleFinishClick = useCallback(() => {
        setIsFinishDialogOpen(true);
    }, []);

    // Finish the task
    const handleFinish = useCallback(() => {
        if (timeLeft <= 0 && !isInProgress) return;

        setIsFinishDialogOpen(false);
        router.post(route('tasks.submissions.finish'), {
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
        if (typeof window !== "undefined" && storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(writingEditor.document));
        }
    }, [updateWordCount, writingEditor, storageKey]);

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
                <meta property="og:description" content="Complete your writing task on Mareff." />
                <meta property="og:image" content={ogImageUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={ogImageUrl} />
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

                    {/* Right Panel - Editor */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="h-full flex flex-col px-8 pt-8">
                            <div className="flex-1 overflow-y-auto">
                                {!hasStarted && isAuthenticated && (
                                    <EmptyState onStart={handleStart} />
                                )}
                                {!hasStarted && !isAuthenticated && (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <p>Please log in to start writing</p>
                                    </div>
                                )}
                                {hasStarted && (
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
                            </div>
                            {hasStarted && (
                                <div className="my-4 text-right text-sm text-muted-foreground">
                                    Words: {wordCount}
                                </div>
                            )}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
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
                    <div className="flex items-center gap-4 py-2 text-sm text-muted-foreground">
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
