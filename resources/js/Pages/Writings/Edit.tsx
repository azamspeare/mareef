import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import TipTapEditor from '@/components/editor/TipTapEditor';
import UnsavedChangesNotification from '@/components/UnsavedChangesNotification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Writing {
    id: number;
    title: string;
    content: string;
    allocated_time: string;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
}

interface EditProps {
    writing: Writing;
}

export default function Edit({ writing }: EditProps) {
    const { data, setData, put, processing, isDirty, reset } = useForm({
        title: writing.title,
        content: writing.content,
        allocated_time: writing.allocated_time,
    });

    const [editorTitle, setEditorTitle] = useState(writing.title);

    const handleEditorChange = (title: string, content: string) => {
        setEditorTitle(title);
        setData({
            ...data,
            title: title,
            content: content,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('writings.update', writing.id), {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title={`Edit: ${editorTitle} - Mareff`} />
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
                                    {editorTitle || 'Untitled Writing'}
                                </h1>
                                <p className="text-muted-foreground">
                                    Edit your writing assignment
                                </p>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={processing || !isDirty}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="allocated_time">Allocated Time (minutes)</Label>
                                    <Input
                                        id="allocated_time"
                                        type="number"
                                        placeholder="e.g., 60"
                                        value={data.allocated_time}
                                        onChange={(e) => setData('allocated_time', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg border bg-white dark:bg-gray-950 p-4">
                                <TipTapEditor
                                    content={data.content}
                                    onChange={handleEditorChange}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <UnsavedChangesNotification
                show={isDirty && !processing}
                onReset={reset}
                onSave={handleSubmit}
            />
        </DashboardLayout>
    );
}
