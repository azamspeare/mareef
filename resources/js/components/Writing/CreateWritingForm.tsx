import { Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PartialBlock } from "@blocknote/core";
import {
    filterSuggestionItems,
} from "@blocknote/core/extensions";
import { Button } from "@/components/ui/button";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote,
} from "@blocknote/react";
import {
    DragHandleButton,
    SideMenu,
    SideMenuController,
    AddBlockButton,
    DragHandleMenu,
    RemoveBlockItem,
} from "@blocknote/react";
import { ArrowLeft } from "lucide-react";
import { PublishModal } from "./PublishModal";
import { useTheme } from "next-themes";

const DRAFT_STORAGE_KEY = "writing_draft";
const DRAFT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

interface WritingDraft {
    title: string;
    content: PartialBlock[];
    savedAt: number;
}

function getSavedDraft(): WritingDraft | null {
    try {
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!saved) return null;

        const draft: WritingDraft = JSON.parse(saved);
        const now = Date.now();

        // Check if draft has expired (30 minutes)
        if (now - draft.savedAt > DRAFT_EXPIRY_MS) {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            return null;
        }

        return draft;
    } catch {
        return null;
    }
}

function clearDraft(): void {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
}

export default function CreateWritingForm() {
    const savedDraft = getSavedDraft();

    const { data, setData, post, processing, transform } = useForm({
        title: savedDraft?.title ?? "",
        content: (savedDraft?.content ?? []) as PartialBlock[],
        allocated_time: null as string | null,
    });

    const theme = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const isInitialMount = useRef(true);

    // Upload file to our server's temporary storage
    async function uploadFile(file: File): Promise<string> {
        const body = new FormData();
        body.append("file", file);

        const response = await fetch(route("images.store"), {
            method: "POST",
            body: body,
            headers: {
                "X-CSRF-TOKEN": document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || "",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return data.url;
    }

    const editor = useCreateBlockNote({
        initialContent: savedDraft?.content?.length
            ? savedDraft.content
            : [{ type: "paragraph" }],
        uploadFile,
    });

    // Save draft to localStorage
    const saveDraft = useCallback((title: string, content: PartialBlock[]) => {
        const draft: WritingDraft = {
            title,
            content,
            savedAt: Date.now(),
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }, []);

    // Auto-save draft when title changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // Auto-resize title if there's saved content
            if (savedDraft?.title) {
                setTimeout(autoResizeTitle, 0);
            }
            return;
        }
        saveDraft(data.title, editor.document);
    }, [data.title, saveDraft]);

    // Filter slash menu items - remove Check List, Video, File, Emoji, Audio
    const getFilteredSlashMenuItems = () => {
        const defaultItems = getDefaultReactSlashMenuItems(editor);
        const excludeItems = ["Check List", "Video", "File", "Emoji", "Audio"];
        return defaultItems.filter(item => !excludeItems.includes(item.title));
    };

    // Handle editor content change - save draft
    const handleEditorChange = useCallback(() => {
        saveDraft(data.title, editor.document);
    }, [data.title, editor, saveDraft]);


    const handlePublish = (timeLimit: string | null) => {
        transform((data) => ({
            ...data,
            content: editor.document,
            allocated_time: timeLimit,
        }));

        post(route("writings.store"), {
            onSuccess: () => {
                clearDraft();
            },
        });
    };

    const autoResizeTitle = () => {
        const el = titleRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };


    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="max-w-3xl lg:max-w-4xl 2xl:max-w-6xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <header className="flex items-center justify-between py-6">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Link href={route("dashboard")} className="hover:text-foreground transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-sm">
                            Create a writing assignment for your students
                        </span>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-full px-6"
                        disabled={!data.title || processing}
                    >
                        Publish
                    </Button>
                </header>

                {/* Main Content */}
                <main className="pb-16">
                    {/* Title Input */}
                    <textarea
                        ref={titleRef}
                        placeholder="Title..."
                        rows={1}
                        autoFocus
                        className="w-full overflow-hidden resize-none border-0 bg-transparent text-2xl font-bold leading-tight placeholder:text-muted-foreground focus:outline-none focus:ring-0 md:text-3xl"
                        value={data.title}
                        onInput={autoResizeTitle}
                        onChange={(e) => setData("title", e.target.value)}
                    />

                    {/* Editor */}
                    <div className="mt-6 [&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 lg:-ml-12 create-writing-details">
                        <BlockNoteView
                            editor={editor}
                            theme={theme.theme === "dark" ? "dark" : "light"}
                            slashMenu={false}
                            sideMenu={false}
                            onChange={handleEditorChange}
                        >
                            {/* Custom Side Menu - Remove Colors option */}
                            <SideMenuController
                                sideMenu={(props) => (
                                    <SideMenu {...props}>
                                        <AddBlockButton key="addBlockButton" {...props} />
                                        <DragHandleButton {...props} dragHandleMenu={(props) => (
                                            <DragHandleMenu {...props}>
                                                <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
                                            </DragHandleMenu>
                                        )} />
                                    </SideMenu>
                                )}
                            />

                            {/* Custom Slash Menu - Filter out unwanted items */}
                            <SuggestionMenuController
                                triggerCharacter="/"
                                getItems={async (query) =>
                                    filterSuggestionItems(getFilteredSlashMenuItems(), query)
                                }
                            />

                        </BlockNoteView>
                    </div>
                </main>
            </div>

            <PublishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPublish={handlePublish}
                isSubmitting={processing}
            />
        </div>
    );
}
