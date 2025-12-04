import { Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

import { filterSuggestionItems, PartialBlock } from "@blocknote/core";
import { Button } from "@/components/ui/button";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
    BasicTextStyleButton,
    BlockTypeSelect,
    FormattingToolbar,
    FormattingToolbarController,
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

interface Writing {
    id: number;
    title: string;
    content: any;
    allocated_time: string | null;
}

interface EditWritingFormProps {
    writing: Writing;
}

export default function EditWritingForm({ writing }: EditWritingFormProps) {
    const { data, setData, put, processing, transform } = useForm({
        title: writing.title,
        content: writing.content as PartialBlock[],
        allocated_time: writing.allocated_time,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const theme = useTheme();
    // Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
    async function uploadFile(file: File) {
        const body = new FormData();
        body.append("file", file);
        const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: body,
        });
        return (await ret.json()).data.url.replace(
            "tmpfiles.org/",
            "tmpfiles.org/dl/",
        );
    }

    const editor = useCreateBlockNote({
        initialContent: writing.content ? (Array.isArray(writing.content) ? writing.content : undefined) : [
            {
                type: "paragraph",
            },
        ],
        uploadFile,
    });

    // Filter slash menu items - remove Check List, Video, File, Emoji, Audio
    const getFilteredSlashMenuItems = () => {
        const defaultItems = getDefaultReactSlashMenuItems(editor);
        const excludeItems = ["Check List", "Video", "File", "Emoji", "Audio"];
        return defaultItems.filter(item => !excludeItems.includes(item.title));
    };


    const handleUpdate = (timeLimit: string | null) => {
        setData("allocated_time", timeLimit);

        transform((data) => ({
            ...data,
            content: editor.document, // Get latest blocks directly from editor
            allocated_time: timeLimit,
        }));

        put(route("writings.update", writing.id));
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
                        <Link href={route("writings.show", writing.id)} className="hover:text-foreground transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-sm">
                            Edit writing assignment
                        </span>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-full px-6"
                        disabled={!data.title || processing}
                    >
                        Save Changes
                    </Button>
                </header>

                {/* Main Content */}
                <main className="pb-16">
                    {/* Title Input */}
                    <textarea
                        ref={titleRef}
                        placeholder="Title..."
                        rows={1}
                        className="w-full overflow-hidden resize-none border-0 bg-transparent text-2xl font-bold leading-tight placeholder:text-muted-foreground focus:outline-none focus:ring-0 md:text-3xl"
                        value={data.title}
                        onInput={autoResizeTitle}
                        onChange={(e) => setData("title", e.target.value)}
                    />

                    {/* Editor */}
                    <div className="mt-6 [&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 lg:-ml-12">
                        <BlockNoteView
                            editor={editor}
                            theme={theme.theme === "dark" ? "dark" : "light"}
                            slashMenu={false}
                            sideMenu={false}
                            formattingToolbar={false}
                        >
                            {/* Custom Side Menu - Remove Colors option */}
                            <SideMenuController
                                sideMenu={(props) => (
                                    <SideMenu {...props}>
                                        <AddBlockButton {...props} />
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

                            {/* Custom Formatting Toolbar - Only show specific items */}
                            <FormattingToolbarController
                                formattingToolbar={() => (
                                    <FormattingToolbar>
                                        <BlockTypeSelect key="blockTypeSelect" />
                                        <BasicTextStyleButton basicTextStyle="bold" key="boldStyleButton" />
                                        <BasicTextStyleButton basicTextStyle="italic" key="italicStyleButton" />
                                        <BasicTextStyleButton basicTextStyle="underline" key="underlineStyleButton" />
                                        <BasicTextStyleButton basicTextStyle="strike" key="strikeStyleButton" />
                                    </FormattingToolbar>
                                )}
                            />
                        </BlockNoteView>
                    </div>
                </main>
            </div>

            <PublishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPublish={handleUpdate}
                isSubmitting={processing}
                initialTimeLimit={data.allocated_time}
                title="Update Writing"
                description="Update the allocated time for this writing assignment."
                actionLabel="Update"
            />
        </div>
    );
}
