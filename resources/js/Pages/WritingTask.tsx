import { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/mantine/style.css";
import { Clock, UserCheck, GraduationCap, PenLine, ArrowUpRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
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

export default function WritingTask({ writing, submission }: WritingTaskProps) {
    const { props } = usePage<{
        auth?: { user?: any };
        flash?: { success?: string; error?: string; message?: string }
    }>();
    const isAuthenticated = !!props.auth?.user;

    // Calculate time remaining in seconds based on submission or use full allocated time
    const calculateInitialTime = () => {
        const parts = writing.allocated_time.split(':').map(Number);
        const hours = parts[0] || 0;
        const minutes = parts[1] || 0;
        const seconds = parts[2] || 0;
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        if (submission && submission.status === 'in_progress') {
            // Calculate time elapsed since submission was created
            const createdAt = new Date(submission.created_at).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - createdAt) / 1000);
            const remainingSeconds = totalSeconds - elapsedSeconds;

            return Math.max(0, remainingSeconds);
        }

        return totalSeconds;
    };

    // Format seconds to MM:SS or HH:MM:SS
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Get time color based on remaining time
    const getTimeColor = () => {
        if (timeLeft <= 300) { // 5 minutes or less
            return 'bg-destructive/20 text-destructive';
        }
        if (timeLeft <= 600) { // 10 minutes or less
            return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500';
        }
        return 'bg-muted';
    };

    const hasStarted = !!submission;
    const isCompleted = submission?.status === 'completed';
    const isInProgress = submission?.status === 'in_progress';

    const [timeLeft, setTimeLeft] = useState(calculateInitialTime());
    const [wordCount, setWordCount] = useState(0);
    const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(!isAuthenticated);
    const [isSaving, setIsSaving] = useState(false);

    const { theme } = useTheme();

    // Update drawer state when authentication changes
    useEffect(() => {
        setIsLoginDrawerOpen(!isAuthenticated);
    }, [isAuthenticated]);

    // Handle flash messages
    useEffect(() => {
        const flash = props.flash;

        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [props.flash]);

    // Create read-only editor for task content
    const taskEditor = useCreateBlockNote({
        initialContent: writing.content ? (Array.isArray(writing.content) ? writing.content : JSON.parse(writing.content as string)) : undefined,
    });

    // Create plain text editor for student writing (no formatting)
    // Load existing submission content if available
    const writingEditor = useCreateBlockNote({
        initialContent: submission?.content && Array.isArray(submission.content) && submission.content.length > 0
            ? submission.content
            : [
                {
                    type: "paragraph",
                    content: "",
                },
            ],
        domAttributes: {
            editor: {
                class: "bn-editor-plain",
            },
        },
    });

    // Update editor content when submission changes
    useEffect(() => {
        if (!submission?.content) return;

        try {
            let content = submission.content;

            // If content is a string, parse it
            if (typeof content === 'string') {
                content = JSON.parse(content);
            }

            // Ensure it's an array
            if (!Array.isArray(content)) return;

            // Replace editor blocks with submission content
            writingEditor.replaceBlocks(writingEditor.document, content);

            // Recalculate word count
            handleEditorChange();
        } catch (error) {
            console.error('Error loading submission content:', error);
        }
    }, [submission?.id, submission?.status, writingEditor]);

    // Force paste as plain text inside the writing editor
    useEffect(() => {
        const editorElement = document.querySelector(".bn-editor-plain") as HTMLElement | null;
        if (!editorElement) return;

        const handlePaste = (event: ClipboardEvent) => {
            event.preventDefault();
            const text = event.clipboardData?.getData("text/plain");
            if (text) {
                document.execCommand("insertText", false, text);
            }
        };

        editorElement.addEventListener("paste", handlePaste as any);
        return () => editorElement.removeEventListener("paste", handlePaste as any);
    }, [writingEditor]);

    // Timer countdown - only when in progress
    useEffect(() => {
        if (timeLeft <= 0 || !isInProgress) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000); // Decrease every second

        return () => clearInterval(timer);
    }, [timeLeft, isInProgress]);

    const handleEditorChange = () => {
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

        // Simple word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    };

    // Start the task
    const handleStart = () => {
        router.post(route('tasks.submissions.start'), {
            writing_id: writing.id,
        });
    };

    // Finish the task
    const handleFinish = () => {
        if (timeLeft <= 0 || !isInProgress) return;

        const parts = writing.allocated_time.split(':').map(Number);
        const allocHours = parts[0] || 0;
        const allocMinutes = parts[1] || 0;
        const allocSeconds = parts[2] || 0;
        const totalSeconds = (allocHours * 3600) + (allocMinutes * 60) + allocSeconds;

        const spentSeconds = totalSeconds - timeLeft;
        const spentHours = Math.floor(spentSeconds / 3600);
        const spentMins = Math.floor((spentSeconds % 3600) / 60);
        const spentSecs = spentSeconds % 60;
        const spentTime = `${String(spentHours).padStart(2, '0')}:${String(spentMins).padStart(2, '0')}:${String(spentSecs).padStart(2, '0')}`;

        router.post(route('tasks.submissions.finish'), {
            writing_id: writing.id,
            content: JSON.stringify(writingEditor.document),
            spent_time: spentTime,
        });
    };

    // Auto-save functionality
    useEffect(() => {
        if (!isInProgress) return;

        const autoSaveInterval = setInterval(() => {
            setIsSaving(true);
            router.post(route('tasks.submissions.save'), {
                writing_id: writing.id,
                content: JSON.stringify(writingEditor.document),
            }, {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            });
        }, 30000); // Auto-save every 30 seconds

        return () => clearInterval(autoSaveInterval);
    }, [isInProgress, writingEditor]);

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeLeft <= 0 && isInProgress) {
            toast.error("Time's up! Submitting your work automatically.");
            handleFinish();
        }
    }, [timeLeft, isInProgress]);

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <Head title="Writing Task" />

            {/* Navbar */}
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
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm ${isInProgress ? getTimeColor() : 'bg-muted'}`}>
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                    <ThemeToggle />
                    {isInProgress && (
                        <Button variant="default" onClick={handleFinish} disabled={timeLeft <= 0}>
                            Finish
                        </Button>
                    )}
                    {isCompleted && (
                        <Button variant="outline" disabled>
                            Completed
                        </Button>
                    )}
                </div>
            </header>

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
                        <div className="h-full overflow-y-auto p-8">
                            <div className="max-w-3xl mx-auto">
                                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                                    {writing.title}
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
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Panel - Editor */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="h-full flex flex-col px-8 pt-8">
                            <div className="flex-1 overflow-y-auto">
                                {!hasStarted && isAuthenticated && (
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
                                            <Button onClick={handleStart}>
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

            {/* Login/Register Drawer */}
            <Drawer open={isLoginDrawerOpen} dismissible={false}>
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
                                onClick={() => window.location.href = route('auth.google.redirect')}
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
        </div>
    );
}
