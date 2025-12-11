import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    Loader2,
    AlertCircle,
    Share,
} from 'lucide-react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import "@blocknote/mantine/style.css";

import {
    AnnotationEditor,
    useAnnotationDraft,
    extractPlainText,
    type Annotation,
    type AnnotationData,
} from '@/components/annotation';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

interface Writing {
    id: number;
    title: string;
    slug: string;
    content: any;
    allocated_time: string;
}

interface Student {
    id: number;
    name: string;
    email: string;
}

interface Feedback {
    id: number;
    submission_id: number;
    content: AnnotationData | null;
    score: number | null;
    feedback: string | null;
    created_at: string;
    updated_at: string;
}

interface Submission {
    id: number;
    writing_id: number;
    student_id: number;
    content: any;
    spent_time: string;
    submitted_at: string;
    evaluated_at: string | null;
    created_at: string;
    writing: Writing;
    student: Student;
    feedback: Feedback | null;
}

interface ShowProps {
    submission: Submission;
    auth: {
        user: {
            username: string;
        };
    };
}

export default function Show({ submission, auth }: ShowProps) {
    const { theme } = useTheme();
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [isEvaluating, setIsEvaluating] = useState(false);
    const [finishDialogOpen, setFinishDialogOpen] = useState(false);
    const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
    const [score, setScore] = useState<string>(
        submission.feedback?.score?.toString() ?? ''
    );
    const [overallFeedback, setOverallFeedback] = useState<string>(
        submission.feedback?.feedback ?? ''
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleShare = useCallback(async () => {
        const hostname = window.location.hostname;
        const mainDomain = hostname.split('.').slice(-2).join('.');
        const protocol = window.location.protocol;
        const url = `${protocol}//student.${mainDomain}/tasks/${auth.user.username}/writing/${submission.writing.slug}`;

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
    }, [auth.user.username, submission.writing.slug]);

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

    const handleSubmitEvaluation = useCallback(() => {
        setIsSubmitting(true);

        const annotationData: AnnotationData = {
            annotations,
            originalText: submissionPlainText,
        };

        router.post(
            route('submissions.evaluate', submission.id),
            {
                submission_id: submission.id,
                content: JSON.stringify(annotationData),
                score: score ? parseFloat(score) : null,
                feedback: overallFeedback || null,
            },
            {
                onSuccess: () => {
                    clearDraft();
                    setIsEvaluating(false);
                    setFinishDialogOpen(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    }, [
        annotations,
        submissionPlainText,
        submission.id,
        score,
        overallFeedback,
        clearDraft,
    ]);

    const isEvaluated = !!submission.feedback;

    return (
        <DashboardLayout title="Submission Review">
            <Head title={`Submission by ${submission.student.name} - Mareff`} />
            <div className="max-w-3xl lg:max-w-4xl 2xl:max-w-6xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 py-6">
                    <Link href={route('dashboard')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {submission.writing.title}
                            </h1>
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
                        <p className="text-muted-foreground mt-1">
                            Submission by {submission.student.name}
                        </p>
                    </div>

                    {/* Action buttons */}
                    {isEvaluating ? (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={handleCancelEvaluation}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleFinishEvaluation}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Finish Assessment
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
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
                        </div>
                    )}
                </div>

                {/* Evaluation mode banner */}
                {isEvaluating && (
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                    Evaluation Mode
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Select any text in the student response below to add a comment.
                                    Choose a highlight color to categorize your feedback.
                                    Your progress is automatically saved as a draft.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6 pb-6">
                    {/* Tabs for writing assignment and details */}
                    <Tabs defaultValue={isEvaluated ? "evaluation-details" : "writing-assignment"}>
                        <TabsList>
                            <TabsTrigger value="writing-assignment">Writing Assignment</TabsTrigger>
                            <TabsTrigger value="submission-details">Submission Details</TabsTrigger>
                            <TabsTrigger value="evaluation-details">Evaluation Details</TabsTrigger>
                        </TabsList>
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
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Submitted At</p>
                                            <p className="font-medium">{formatDateTime(submission.submitted_at)}</p>
                                        </div>
                                    </div>
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

            {/* Finish Assessment Dialog */}
            <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Finish Assessment</DialogTitle>
                        <DialogDescription>
                            Add an optional score and overall feedback for this submission.
                            You have added {annotations.length} inline comment(s).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="score">Score (optional)</Label>
                            <Input
                                id="score"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0-100"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overall-feedback">Overall Feedback (optional)</Label>
                            <Textarea
                                id="overall-feedback"
                                placeholder="Add any overall comments about this submission..."
                                value={overallFeedback}
                                onChange={(e) => setOverallFeedback(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setFinishDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitEvaluation} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Submit Evaluation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
