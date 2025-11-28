import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { PublishModal } from "./PublishModal";
import { Link } from "@inertiajs/react";


export default function CreateWritingForm() {
    const { data, setData, post, processing, transform } = useForm({
        title: "",
        content: [] as PartialBlock[],

        allocated_time: null as string | null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const editor = useCreateBlockNote({
        initialContent: [
            {
                type: "paragraph",
                content: "Enter text or type '/' for commands",
            },
        ],
    });

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

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Link href={route("dashboard")} className="hover:text-foreground transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <span className="font-handwriting text-lg">
                        Create a writing assignment for your students
                    </span>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-full px-6 font-handwriting text-lg"
                    disabled={!data.title || processing}
                >
                    Publish
                </Button>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 mt-8">
                {/* Title Input */}
                <Input
                    type="text"
                    placeholder="Title..."
                    className="border-none shadow-none text-6xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0 py-8 h-auto font-handwriting bg-transparent"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                />

                {/* Editor */}
                <div className="mt-8 -ml-12">
                    {/* Negative margin to align text with title while keeping drag handles visible */}
                    <BlockNoteView
                        editor={editor}
                        theme="light"
                        className="min-h-[500px]"
                    />
                </div>
            </main>

            <PublishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPublish={handlePublish}
                isSubmitting={processing}
            />
        </div>
    );
}
