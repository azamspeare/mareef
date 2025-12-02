import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Calendar, RotateCcw, Archive } from 'lucide-react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/mantine/style.css";
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useState } from 'react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { calculateTime } from '@/utils';

interface Submission {
    id: number;
    student_id: number;
    student: {
        name: string;
        avatar: string;
    };
}

interface Writing {
    id: number;
    title: string;
    content: any;
    allocated_time: string;
    archived_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    submissions: Submission[];
    status: string;
}

interface ShowProps {
    writing: Writing;
}

export default function Show({ writing }: ShowProps) {
    const isArchived = writing.deleted_at !== null;

    // Dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        description: string;
        actionLabel: string;
        variant: 'default' | 'destructive';
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        description: '',
        actionLabel: '',
        variant: 'default',
        onConfirm: () => { },
    });

    const handleArchive = () => {
        setConfirmDialog({
            open: true,
            title: 'Archive Writing',
            description: 'Are you sure you want to archive this writing? You can restore it later.',
            actionLabel: 'Archive',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('writings.archive', writing.id));
            },
        });
    };

    const handleRestore = () => {
        setConfirmDialog({
            open: true,
            title: 'Restore Writing',
            description: 'Are you sure you want to restore this writing? It will be moved back to active writings.',
            actionLabel: 'Restore',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('writings.restore', writing.id));
            },
        });
    };

    const handleDelete = () => {
        setConfirmDialog({
            open: true,
            title: 'Delete Writing',
            description: 'Are you sure you want to permanently delete this writing? This action cannot be undone.',
            actionLabel: 'Delete',
            variant: 'destructive',
            onConfirm: () => {
                router.delete(route('writings.delete', writing.id));
            },
        });
    };

    const editor = useCreateBlockNote({
        initialContent: writing.content ? (Array.isArray(writing.content) ? writing.content : JSON.parse(writing.content as string)) : undefined,
    });


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
                                    <RotateCcw className="h-4 w-4" />
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
                <div>
                    {/* Meta Info */}
                    <div className="grid gap-6 mb-8">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                <Badge
                                    variant={isArchived ? "secondary" : "outline"}
                                    className={`px-2.5 py-0.5 text-sm font-normal ${!isArchived ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400" : ""
                                        }`}
                                >
                                    {isArchived ? 'Archived' : 'Active'}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(writing.created_at), 'dd MMM yyyy')}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Allocated Time</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                                    {calculateTime(writing.allocated_time)}
                                </span>
                            </div>
                        </div>

                        {writing.submissions && writing.submissions.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Submissions</span>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {writing.submissions.map((submission) => (
                                        <div
                                            key={submission.id}
                                            className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5"
                                        >
                                            <Avatar className="size-7">
                                                <AvatarImage src={submission.student.avatar} alt={submission.student.name} />
                                                <AvatarFallback className="text-[10px]">
                                                    {submission.student.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-medium">{submission.student.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='w-20 mx-auto py-8'>
                        <Separator />
                    </div>

                    {/* Title & Content */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {writing.title}
                        </h1>

                        <div className="prose prose-stone dark:prose-invert max-w-none">
                            <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 pointer-events-none writing-details">
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

            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                title={confirmDialog.title}
                description={confirmDialog.description}
                actionLabel={confirmDialog.actionLabel}
                variant={confirmDialog.variant}
                onConfirm={confirmDialog.onConfirm}
            />
        </DashboardLayout>
    );
}
