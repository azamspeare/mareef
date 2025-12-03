import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Calendar, RotateCcw, Archive, Share2 } from 'lucide-react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/mantine/style.css";
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    slug: string;
}

interface ShowProps {
    writing: Writing;
}

const sampleSubmissions = [
    {
        id: 1,
        student: {
            name: 'John Doe',
            avatar: 'https://github.com/shadcn.png',
        },
    },
    {
        id: 2,
        student: {
            name: 'Jane Doe',
            avatar: 'https://github.com/shadcn.png',
        },
    },
    {
        id: 3,
        student: {
            name: 'Jim Beam',
            avatar: 'https://github.com/shadcn.png',
        },
    },
];

export default function Show({ writing }: ShowProps) {
    const { auth } = usePage().props as any;
    const isArchived = writing.deleted_at !== null;

    const handleShare = async () => {
        // Get the main domain without subdomain (mareff.test instead of app.mareff.test)
        const hostname = window.location.hostname;
        const mainDomain = hostname.split('.').slice(-2).join('.');
        const protocol = window.location.protocol;
        const url = `${protocol}//${mainDomain}/${auth.user.username}/writing/${writing.slug}`;

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied!', {
                description: 'You can share this writing with your students.',
            });
        } catch (err) {
            toast.error('Failed to copy link', {
                description: 'Please try again.',
            });
        }
    };

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

            <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Link href={route("writings.index")} className="hover:text-foreground transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-sm">
                            Back to your writing list
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route('writings.edit', writing.id)}>
                            <Button variant="outline" className="bg-background">
                                Edit
                            </Button>
                        </Link>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={handleShare} className="bg-background">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Share with students!</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {isArchived ? (
                            <>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleRestore} className="bg-background">
                                                <RotateCcw className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Restore Writing?!</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleDelete} className="bg-background hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete Writing?!</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={handleArchive} className="bg-background">
                                            <Archive className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Archive Writing?!</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>

                {/* Main Content Card */}
                <div>
                    {/* Meta Info */}
                    <div className="space-y-5 mb-8">
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <Badge
                                    variant="outline"
                                    className="rounded-md"
                                >
                                    {isArchived ? 'Archived' : 'In Progress'}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(writing.created_at), 'dd MMM yyyy')}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Allocated Time</span>
                            <Badge variant="outline" className="rounded-md">
                                {calculateTime(writing.allocated_time)}
                            </Badge>
                        </div>

                        {sampleSubmissions && sampleSubmissions.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-muted-foreground text-sm">Submissions</span>
                                <div className="flex flex-wrap gap-3">
                                    {sampleSubmissions.map((submission) => (
                                        <div
                                            key={submission.id}
                                            className="flex items-center gap-2 rounded-lg border bg-card py-1 px-1.5"
                                        >
                                            <Avatar className="size-7 rounded-md">
                                                <AvatarImage
                                                    alt={submission.student.name}
                                                    src={submission.student.avatar}
                                                />
                                                <AvatarFallback className="text-sm rounded-md">
                                                    {submission.student.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{submission.student.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='w-20 mx-auto py-6'>
                        <Separator />
                    </div>

                    {/* Title & Content */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-semibold tracking-tight">
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
