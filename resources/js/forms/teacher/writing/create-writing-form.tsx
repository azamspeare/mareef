import { useForm } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { useDraft } from "@/hooks/use-draft";
import { useBlockNoteUpload } from "@/hooks/use-block-note-upload";
import { autoResizeTextarea } from "@/lib/block-note";
import { WritingFormLayout } from "@/components/writing/writing-form-layout";
import { WritingEditor } from "@/components/writing/writing-editor";
import { PublishModal } from "@/components/writing/publish-modal";

const DRAFT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

interface WritingDraft {
    title: string;
    content: PartialBlock[];
}

export default function CreateWritingForm() {
    const { getInitialValue, saveDraft, clearDraft } = useDraft<WritingDraft>({
        key: 'writing_draft',
        expiryMs: DRAFT_EXPIRY_MS,
    });

    const savedDraft = getInitialValue({ title: '', content: [] });

    const { data, setData, post, processing, transform } = useForm({
        title: savedDraft.title,
        content: savedDraft.content as PartialBlock[],
        allocated_time: null as string | null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const isInitialMount = useRef(true);
    const titleRef = useRef<HTMLTextAreaElement | null>(null);

    const uploadFile = useBlockNoteUpload();

    const editor = useCreateBlockNote({
        initialContent: savedDraft.content?.length
            ? savedDraft.content
            : [{ type: "paragraph" }],
        uploadFile,
    });

    // Auto-save draft when title changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (savedDraft.title) {
                setTimeout(() => autoResizeTextarea(titleRef.current), 0);
            }
            return;
        }
        saveDraft({ title: data.title, content: editor.document });
    }, [data.title, saveDraft, editor]);

    // Handle editor content change - save draft
    const handleEditorChange = useCallback(() => {
        saveDraft({ title: data.title, content: editor.document });
    }, [data.title, editor, saveDraft]);

    const handlePublish = (timeLimit: string | null) => {
        transform((data) => ({
            ...data,
            content: editor.document,
            allocated_time: timeLimit,
        }));

        post(route("writings.store"), {
            onSuccess: clearDraft,
        });
    };

    return (
        <WritingFormLayout
            backHref={route("writings.index")}
            subtitle="Create a writing assignment for your students"
            actionLabel="Publish"
            onAction={() => setIsModalOpen(true)}
            actionDisabled={!data.title || processing}
            title={data.title}
            onTitleChange={(title) => setData("title", title)}
            autoFocus
        >
            <WritingEditor editor={editor} onChange={handleEditorChange} />

            <PublishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPublish={handlePublish}
                isSubmitting={processing}
            />
        </WritingFormLayout>
    );
}
