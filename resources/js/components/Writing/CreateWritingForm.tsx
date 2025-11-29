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


export default function CreateWritingForm() {
    const { data, setData, post, processing, transform } = useForm({
        title: "",
        content: [] as PartialBlock[],

        allocated_time: null as string | null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const titleRef = useRef<HTMLTextAreaElement | null>(null);



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
        initialContent: [
            {
                type: "paragraph",
                content: "Enter text or type '/' for commands",
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


    const handlePublish = (timeLimit: string | null) => {
        setData("allocated_time", timeLimit);
        // We need to set the content right before submitting because setData is async/batched
        // and we want the latest state. However, with Inertia useForm, we usually bind values.
        // For BlockNote, we can get the blocks directly from the editor instance.

        // Actually, let's update the data state first, then submit in a useEffect or
        // just pass the data directly to post if possible? No, post uses the internal data.
        // So we should update data.content on change or right here.
        // Let's update it here to be safe, although onEditorChange is better for keeping it in sync.

        // But wait, setData is not immediate.
        // A better approach with Inertia's useForm for complex objects is to update it on change.
        // Let's rely on the onChange handler of the editor to keep data.content updated.

        // We'll trigger the post in a way that ensures allocated_time is set.
        // Since setData is not a promise, we might have a race condition if we try to post immediately.
        // Instead, let's use the transform callback of post, or just manually construct the payload if needed.
        // But Inertia's post doesn't take a payload argument for data, it uses the internal state.

        // Workaround: Use the transform option in post to merge the time limit.
        transform((data) => ({
            ...data,
            content: editor.document, // Get latest blocks directly from editor
            allocated_time: timeLimit,
        }));

        post(route("writings.store"));


    };

    const autoResizeTitle = () => {
        const el = titleRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };


    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
                    <div className="mt-6 [&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 lg:-ml-12">
                        <BlockNoteView
                            editor={editor}
                            theme="light"
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
                onPublish={handlePublish}
                isSubmitting={processing}
            />
        </div>
    );
}
