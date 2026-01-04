import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { ArrowLeft, Trash2, Calendar, RotateCcw, Archive, Share } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog.tsx';
import { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { calculateTime, getStudentUrl } from '@/lib/utils.ts';
import { QuestionPreview } from '@/components/quiz';
import type { SharedPageProps, QuizQuestion } from '@/types';

interface Submission {
    id: number;
    student_id: number;
    student: {
        name: string;
        avatar: string;
    };
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    allocated_time: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    submissions: Submission[];
    questions: QuizQuestion[];
    slug: string;
}

interface ShowProps {
    quiz: Quiz;
}

export default function Show({ quiz }: ShowProps) {
    const { auth } = usePage<SharedPageProps>().props;
    const isArchived = quiz.deleted_at !== null;

    // Get last 3 submissions
    const recentSubmissions = useMemo(() =>
        quiz.submissions?.slice(-3) ?? [],
        [quiz.submissions]
    );

    // Sort questions by order
    const sortedQuestions = useMemo(() =>
        [...(quiz.questions || [])].sort((a, b) => a.order - b.order),
        [quiz.questions]
    );

    // Calculate total points
    const totalPoints = useMemo(() =>
        sortedQuestions.reduce((sum, q) => sum + q.point, 0),
        [sortedQuestions]
    );

    const handleShare = useCallback(async () => {
        const url = getStudentUrl(`/tasks/${auth.user!.username}/quiz/${quiz.slug}`);

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied!', {
                description: 'You can share this quiz with your students.',
            });
        } catch {
            toast.error('Failed to copy link', {
                description: 'Please try again.',
            });
        }
    }, [auth.user, quiz.slug]);

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

    const handleArchive = useCallback(() => {
        setConfirmDialog({
            open: true,
            title: 'Archive Quiz',
            description: 'Are you sure you want to archive this quiz? You can restore it later.',
            actionLabel: 'Archive',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('quizzes.archive', quiz.id));
            },
        });
    }, [quiz.id]);

    const handleRestore = useCallback(() => {
        setConfirmDialog({
            open: true,
            title: 'Restore Quiz',
            description: 'Are you sure you want to restore this quiz? It will be moved back to active quizzes.',
            actionLabel: 'Restore',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('quizzes.restore', quiz.id));
            },
        });
    }, [quiz.id]);

    const handleDelete = useCallback(() => {
        setConfirmDialog({
            open: true,
            title: 'Delete Quiz',
            description: 'Are you sure you want to permanently delete this quiz? This action cannot be undone.',
            actionLabel: 'Delete',
            variant: 'destructive',
            onConfirm: () => {
                router.delete(route('quizzes.delete', quiz.id));
            },
        });
    }, [quiz.id]);

    return (
        <DashboardLayout title="Quiz Details">
            <Head title={`${quiz.title} - Mareef`} />

            <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Link href={route("quizzes.index")} className="hover:text-foreground transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-sm">
                            Back to your quiz list
                        </span>
                    </div>

                    <TooltipProvider>
                        <div className="flex items-center gap-2">
                            <Link href={route('quizzes.edit', quiz.id)}>
                                <Button variant="outline" className="bg-background">
                                    Edit
                                </Button>
                            </Link>

                            {isArchived ? (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleRestore} className="bg-background">
                                                <RotateCcw className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Restore</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleDelete} className="bg-background hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleShare} className="bg-background">
                                                <Share className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Share</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleArchive} className="bg-background">
                                                <Archive className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Archive</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                    </TooltipProvider>
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
                                    {isArchived ? 'Archived' : 'Active'}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(quiz.created_at), 'dd MMM yyyy')}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Allocated Time</span>
                                <Badge variant="outline" className="rounded-md">
                                    {quiz.allocated_time ? calculateTime(quiz.allocated_time) : 'No limit'}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Questions</span>
                                <Badge variant="outline" className="rounded-md">
                                    {sortedQuestions.length}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Total Points</span>
                                <Badge variant="outline" className="rounded-md">
                                    {totalPoints}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-muted-foreground text-sm">Submissions</span>
                            {recentSubmissions.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {recentSubmissions.map((submission) => (
                                        <Link
                                            key={submission.id}
                                            href={route('quizzes.submissions.show', submission.id)}
                                            className="flex items-center gap-2 rounded-lg border bg-card py-1 px-1.5 hover:bg-accent transition-colors"
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
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Badge variant="outline" className="rounded-md w-fit">
                                    No Submissions Yet
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className='w-20 mx-auto py-6'>
                        <Separator />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {quiz.title}
                            </h1>
                            {quiz.description && (
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {quiz.description}
                                </p>
                            )}
                        </div>

                        {/* Questions List */}
                        {sortedQuestions.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Questions
                                </h2>
                                <div className="space-y-4">
                                    {sortedQuestions.map((question, index) => (
                                        <QuestionPreview
                                            key={question.id}
                                            question={question}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
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
