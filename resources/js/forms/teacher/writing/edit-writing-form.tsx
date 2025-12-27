import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { useBlockNoteUpload } from "@/hooks/use-block-note-upload";
import { WritingFormLayout } from "@/components/writing/writing-form-layout";
import { WritingEditor } from "@/components/writing/writing-editor";
import { PublishModal } from "@/components/writing/publish-modal";

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

    const uploadFile = useBlockNoteUpload();

    const editor = useCreateBlockNote({
        initialContent: writing.content
            ? (Array.isArray(writing.content) ? writing.content : undefined)
            : [{ type: "paragraph" }],
        uploadFile,
    });

    const handleUpdate = (timeLimit: string | null) => {
        transform((data) => ({
            ...data,
            content: editor.document,
            allocated_time: timeLimit,
        }));

        put(route("writings.update", writing.id));
    };

    return (
        <WritingFormLayout
            backHref={route("writings.show", writing.id)}
            subtitle="Edit writing assignment"
            actionLabel="Save Changes"
            onAction={() => setIsModalOpen(true)}
            actionDisabled={!data.title || processing}
            title={data.title}
            onTitleChange={(title) => setData("title", title)}
        >
            <WritingEditor editor={editor} />

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
        </WritingFormLayout>
    );
}
