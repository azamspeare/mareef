import { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/mantine/style.css";
import { Clock, UserCheck, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
interface Writing {
    id: number;
    title: string;
    content: any;
    allocated_time: string;
    slug: string;
}

interface WritingTaskProps {
    writing: Writing;
}

export default function WritingTask({ writing }: WritingTaskProps) {
    const { props } = usePage<{
        auth?: { user?: any };
        flash?: { success?: string; error?: string; message?: string }
    }>();
    const isAuthenticated = !!props.auth?.user;

    // Convert allocated_time (HH:MM:SS) to minutes
    const [hours, minutes] = writing.allocated_time.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes;

    const [timeLeft, setTimeLeft] = useState(totalMinutes);
    const [wordCount, setWordCount] = useState(0);
    const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(!isAuthenticated);

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
    const writingEditor = useCreateBlockNote({
        initialContent: [
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

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 60000); // Decrease every minute

        return () => clearInterval(timer);
    }, [timeLeft]);

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

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <Head title="Writing Task" />

            {/* Navbar */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold tracking-tight">Writing Task</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm ${timeLeft <= 5 ? 'bg-destructive/20 text-destructive' : 'bg-muted'
                        }`}>
                        <Clock className="w-4 h-4" />
                        <span>{timeLeft} minute{timeLeft !== 1 ? 's' : ''} left</span>
                    </div>
                    <ThemeToggle />
                    <Button variant="default">
                        Finish
                    </Button>
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
                                <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 writing-details">
                                    <BlockNoteView
                                        editor={writingEditor}
                                        theme={theme === "dark" ? "dark" : "light"}
                                        slashMenu={false}
                                        sideMenu={false}
                                        formattingToolbar={false}
                                        onChange={handleEditorChange}
                                    />
                                </div>
                            </div>
                            <div className="my-4 text-right text-sm text-muted-foreground">
                                Words: {wordCount}
                            </div>
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
                                onClick={() => window.location.href = route('student.google.redirect')}
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
