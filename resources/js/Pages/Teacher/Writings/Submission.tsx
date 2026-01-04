import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx';
import { EvaluationForm } from '@/forms/teacher/submission/evaluation-form.tsx';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    User,
    Calendar,
    MessageSquare,
    Star,
    ClipboardList,
    X,
    AlertCircle,
    Share,
} from 'lucide-react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from 'next-themes';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getStudentUrl } from '@/lib/utils.ts';
import "@blocknote/mantine/style.css";

import {
    AnnotationEditor,
    useAnnotationDraft,
    extractPlainText,
    type Annotation,
} from '@/components/annotation';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import type { SubmissionDetail, SharedPageProps } from "@/types/index.ts";

interface ShowProps {
    submission: SubmissionDetail;
}

export default function Submission({ submission }: ShowProps) {
    const { auth } = usePage<SharedPageProps>().props;
    const { theme } = useTheme();

    const [isEvaluating, setIsEvaluating] = useState(false);
    const [finishDialogOpen, setFinishDialogOpen] = useState(false);
    const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Parse submission content for BlockNote
    const submissionBlocks = useMemo(() => {
        if (!submission.content) return [];
        return Array.isArray(submission.content)
            ? submission.content
            : JSON.parse(submission.content as string);
    }, [submission.content]);

    // Extract plain text for annotation editor
    const submissionPlainText = useMemo(
        () => extractPlainText(submissionBlocks),
        [submissionBlocks]
    );

    // Calculate word count
    const wordCount = useMemo(() => {
        const words = submissionPlainText.trim().split(/\s+/).filter(word => word.length > 0);
        return words.length;
    }, [submissionPlainText]);

    // Parse writing content for BlockNote
    const writingContent = useMemo(() => {
        if (!submission.writing.content) return undefined;
        return Array.isArray(submission.writing.content)
            ? submission.writing.content
            : JSON.parse(submission.writing.content as string);
    }, [submission.writing.content]);

    const writingEditor = useCreateBlockNote({
        initialContent: writingContent,
    });

    // Parse existing annotations from feedback
    const existingAnnotations = useMemo((): Annotation[] => {
        if (!submission.feedback?.content) return [];
        const content = submission.feedback.content;
        if (typeof content === 'string') {
            try {
                const parsed = JSON.parse(content);
                return parsed.annotations || [];
            } catch {
                return [];
            }
        }
        return content.annotations || [];
    }, [submission.feedback?.content]);

    // Annotation draft management
    const {
        annotations,
        addAnnotation,
        updateAnnotation,
        removeAnnotation,
        clearDraft,
        hasDraft,
    } = useAnnotationDraft({
        submissionId: submission.id,
        originalText: submissionPlainText,
        existingAnnotations,
    });

    const handleShare = useCallback(async () => {
        const url = getStudentUrl(`/tasks/${auth.user!.username}/writing/${submission.writing.slug}`);

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied!', {
                description: 'You can share this writing with your students.',
            });
        } catch {
            toast.error('Failed to copy link', {
                description: 'Please try again.',
            });
        }
    }, [auth.user, submission.writing.slug]);

    const handleStartEvaluation = useCallback(() => {
        setIsEvaluating(true);
    }, []);

    const handleCancelEvaluation = useCallback(() => {
        if (annotations.length > 0 && !submission.feedback) {
            // Keep the draft but exit evaluation mode
            toast.info('Draft saved', {
                description: 'Your annotations have been saved as a draft.',
            });
        }
        setIsEvaluating(false);
    }, [annotations.length, submission.feedback]);

    const handleFinishEvaluation = useCallback(() => {
        setFinishDialogOpen(true);
    }, []);

    const handleEvaluationSuccess = useCallback(() => {
        clearDraft();
        setIsEvaluating(false);
    }, [clearDraft]);

    const isEvaluated = !!submission.feedback;

    return (
        <DashboardLayout title="Submission Review">
            <Head title={`Submission by ${submission.student.name}`} />
            <div className="max-w-full lg:max-w-4xl 2xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 overflow-hidden">
                {/* Header */}
                <div className="flex items-start gap-3 py-6 md:gap-4">
                    {/* Back button */}
                    <Link href={route('dashboard')} className="shrink-0 mt-1">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    {/* Title + Student name */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl truncate">
                            {submission.writing.title}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Submission by {submission.student.name}
                        </p>
                    </div>

                    {/* Status badges - always on the right */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        {isEvaluated ? (
                            <Badge variant="default" className="bg-green-600 dark:text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Evaluated
                            </Badge>
                        ) : (
                            <Badge variant="secondary">Not Evaluated</Badge>
                        )}
                        {hasDraft && !isEvaluated && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                Draft Saved
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Evaluation mode banner */}
                {isEvaluating && (
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 p-3 md:p-4">
                        <div className="flex items-start gap-2 md:gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100 text-sm md:text-base">
                                    Evaluation Mode
                                </p>
                                <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300">
                                    Select text below to add comments. Progress is auto-saved.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4 md:space-y-6 pb-6">
                    {/* Tabs for writing assignment and details */}
                    <Tabs defaultValue={isEvaluated ? "evaluation-details" : "writing-assignment"}>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                            {/* Action buttons - above tabs on mobile, right side on desktop */}
                            <div className="flex items-center justify-end gap-2 md:order-2 shrink-0">
                                {isEvaluating ? (
                                    <>
                                        <Button variant="ghost" onClick={handleCancelEvaluation}>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button onClick={handleFinishEvaluation}>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Finish Assessment
                                        </Button>
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
                                                <p>Share Writing Task</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Button onClick={handleStartEvaluation}>
                                            {isEvaluated ? 'Edit Evaluation' : 'Start Evaluation'}
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:order-1">
                                <TabsList className="w-max md:w-auto">
                                    <TabsTrigger value="writing-assignment">
                                        <span className="hidden md:inline">Writing Assignment</span>
                                        <span className="md:hidden">Assignment</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="submission-details">
                                        <span className="hidden md:inline">Submission Details</span>
                                        <span className="md:hidden">Details</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="evaluation-details">
                                        <span className="hidden md:inline">Evaluation Details</span>
                                        <span className="md:hidden">Evaluation</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </div>
                        <TabsContent value="writing-assignment">
                            <Card>
                                <CardContent>
                                    <div className="prose prose-stone dark:prose-invert max-w-none">
                                        <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 pointer-events-none writing-details">
                                            <BlockNoteView
                                                editor={writingEditor}
                                                theme={theme === "dark" ? "dark" : "light"}
                                                editable={false}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="submission-details">
                            <Card>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Student</p>
                                            <p className="font-medium">{submission.student.name}</p>
                                            <p className="text-sm text-muted-foreground">{submission.student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Time Spent</p>
                                            <p className="font-medium">{submission.spent_time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Allocated Time</p>
                                            <p className="font-medium">{submission.writing.allocated_time}</p>
                                        </div>
                                    </div>
                                    {submission.submitted_at && (
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Submitted At</p>
                                                <p className="font-medium">{formatDateTime(submission.submitted_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="evaluation-details">
                            <Card>
                                <CardContent>
                                    {isEvaluated ? (
                                        <div className="space-y-4">
                                            {submission.feedback?.score !== null && (
                                                <div className="flex items-center gap-3">
                                                    <Star className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Score</p>
                                                        <p className="font-medium">{submission.feedback?.score}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {submission.feedback?.feedback && (
                                                <div className="flex items-center gap-3">
                                                    <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Overall Feedback</p>
                                                        <p className="font-medium whitespace-pre-wrap">
                                                            {submission.feedback.feedback}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Inline Comments</p>
                                                    <p className="font-medium">{existingAnnotations.length} comment(s)</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Evaluated At</p>
                                                    <p className="font-medium">{formatDateTime(submission.feedback!.updated_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Empty className="py-8">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <ClipboardList className="h-6 w-6" />
                                                </EmptyMedia>
                                                <EmptyTitle>No Assessment Yet</EmptyTitle>
                                                <EmptyDescription>
                                                    You haven't evaluated this submission yet. Start the evaluation to provide feedback and score.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                            <EmptyContent>
                                                <Button onClick={handleStartEvaluation}>
                                                    Start Evaluation
                                                </Button>
                                            </EmptyContent>
                                        </Empty>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Student Response with Annotation Editor */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Student Response</CardTitle>
                            {annotations.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCommentsDrawerOpen(true)}
                                    className="gap-2"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Comments ({annotations.length})
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <AnnotationEditor
                                text={submissionPlainText}
                                annotations={annotations}
                                isEditable={isEvaluating}
                                onAddAnnotation={addAnnotation}
                                onUpdateAnnotation={updateAnnotation}
                                onRemoveAnnotation={removeAnnotation}
                                drawerOpen={commentsDrawerOpen}
                                onDrawerOpenChange={setCommentsDrawerOpen}
                            />
                            <div className="mt-4 text-right text-sm text-muted-foreground">
                                Words: {wordCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <EvaluationForm
                submissionId={submission.id}
                annotations={annotations}
                originalText={submissionPlainText}
                existingScore={submission.feedback?.score}
                existingFeedback={submission.feedback?.feedback}
                isOpen={finishDialogOpen}
                onOpenChange={setFinishDialogOpen}
                onSuccess={handleEvaluationSuccess}
            />
        </DashboardLayout>
    );
}
