import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { PartialBlock } from "@blocknote/core";


interface Writing {
    id: number;
    title: string;
    content: any; // BlockNote content is JSON
    allocated_time: string;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
}

interface EditProps {
    writing: Writing;
}

export default function Edit({ writing }: EditProps) {
    const { data, setData, put, processing, isDirty, transform } = useForm({
        title: writing.title,

        content: writing.content,
        allocated_time: writing.allocated_time,
    });

    const editor = useCreateBlockNote({
        initialContent: writing.content ? (Array.isArray(writing.content) ? writing.content : undefined) : undefined,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            content: editor.document,
        }));
        put(route('writings.update', writing.id), {
            preserveScroll: true,
        });
    };


    return (
        <DashboardLayout>
            <Head title={`Edit: ${data.title} - Mareff`} />
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Link href={route('writings.show', writing.id)}>
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {data.title || 'Untitled Writing'}
                                </h1>
                                <p className="text-muted-foreground">
                                    Edit your writing assignment
                                </p>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="allocated_time">Allocated Time (minutes)</Label>
                                    <Input
                                        id="allocated_time"
                                        type="number"
                                        placeholder="e.g., 60"
                                        value={data.allocated_time}
                                        onChange={(e) => setData('allocated_time', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg border bg-white dark:bg-gray-950 p-4 min-h-[500px]">
                                <BlockNoteView editor={editor} theme="light" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
