import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trash2, Calendar, Clock, RotateCcw, Archive, Undo2 } from 'lucide-react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/mantine/style.css";

interface Writing {
    id: number;
    title: string;
    content: any;
    allocated_time: string;
    archived_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    submissions_count?: number;
    status: string;
}

interface ShowProps {
    writing: Writing;
}

export default function Show({ writing }: ShowProps) {
    const isArchived = writing.deleted_at !== null;

    const handleArchive = () => {
        if (confirm('Are you sure you want to archive this writing?')) {
            router.delete(route('writings.destroy', writing.id));
        }
    };

    const handleRestore = () => {
        router.patch(route('writings.restore', writing.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to permanently delete this writing? This action cannot be undone.')) {
            router.delete(route('writings.force-delete', writing.id));
        }
    };

    const editor = useCreateBlockNote({
        initialContent: writing.content ? (Array.isArray(writing.content) ? writing.content : JSON.parse(writing.content as string)) : undefined,
    });

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <DashboardLayout title="Writing Details">
            <Head title={`${writing.title} - Mareff`} />

            <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={route('writings.index')}
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to your writing list
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link href={route('writings.edit', writing.id)}>
                            <Button variant="outline" className="bg-background">
                                Edit
                            </Button>
                        </Link>

                        {isArchived ? (
                            <>
                                <Button variant="outline" size="icon" onClick={handleRestore} title="Restore" className="bg-background">
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={handleDelete} title="Delete Permanently" className="bg-background hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" size="icon" onClick={handleArchive} title="Archive" className="bg-background">
                                <Archive className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-background border rounded-xl shadow-sm p-8 md:p-12 min-h-[600px]">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground mb-12">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Status:</span>
                            <Badge variant="outline" className="font-normal">
                                {isArchived ? 'Archived' : 'Active'}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(writing.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Allocated Time: <span className="text-foreground font-medium">{writing.allocated_time || 'No limit'} minutes</span></span>
                        </div>

                        <div className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4" />
                            <span>Submissions: <span className="text-foreground font-medium">{writing.submissions_count || 0}</span></span>
                        </div>
                    </div>

                    {/* Title & Content */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Writing task: {writing.title}
                        </h1>

                        <div className="prose prose-stone dark:prose-invert max-w-none">
                             <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 pointer-events-none">
                                <BlockNoteView
                                    editor={editor}
                                    theme="light"
                                    editable={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
