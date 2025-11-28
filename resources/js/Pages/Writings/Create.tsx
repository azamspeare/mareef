import { Head, useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import TipTapEditor from '@/components/editor/TipTapEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    const [title, setTitle] = useState('');

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setData('title', newTitle);
    };

    const handleContentChange = (content: string) => {
        setData('content', content);
    };

    const handlePublish = () => {
        post(route('writings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect handled by backend
            },
        });
    };

    const isPublishDisabled = processing || !title.trim() || !data.content.trim();

    return (
        <DashboardLayout>
            <Head title="Create Writing - Mareff" />

            <div className="flex flex-col h-full">
                {/* Top Navigation Bar */}
                <div className="border-b bg-background sticky top-0 z-50">
                    <div className="max-w-5xl mx-auto px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Back Navigation */}
                            <div className="flex items-center gap-3">
                                <Link href={route('writings.index')}>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <span className="text-sm text-muted-foreground">
                                    Create a writing assignment for your students
                                </span>
                            </div>

                            {/* Publish Button */}
                            <Button
                                onClick={handlePublish}
                                disabled={isPublishDisabled}
                                size="lg"
                                className="px-8"
                            >
                                {processing ? 'Publishing...' : 'Publish'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 overflow-auto bg-background">
                    <div className="max-w-5xl mx-auto px-8 py-12">
                        {/* Title Input Field */}
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full text-5xl font-bold border-none outline-none focus:ring-0 placeholder:text-muted-foreground/20 bg-transparent mb-2 p-0"
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 mb-8">{errors.title}</p>
                        )}

                        {/* Rich Text Content Editor */}
                        <TipTapEditor
                            content={data.content}
                            onChange={handleContentChange}
                        />
                        {errors.content && (
                            <p className="text-sm text-red-500 mt-2">{errors.content}</p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
