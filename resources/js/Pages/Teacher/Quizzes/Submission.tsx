import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Label } from '@/components/ui/label.tsx';
import { ConfirmDialog } from '@/components/confirm-dialog.tsx';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    User,
    Calendar,
    Star,
    Circle,
    Square,
    Check,
    X,
    Type,
    AlignLeft,
    Loader2,
    Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, useState, useCallback } from 'react';
import { calculateTime } from '@/lib/utils.ts';
import {
    QuizQuestionType,
    QuizQuestionTypeLabels,
    type QuizSubmissionDetail,
    type QuizQuestionDB,
    type QuizAnswer,
} from '@/types';

interface SubmissionProps {
    submission: QuizSubmissionDetail;
}

export default function Submission({ submission }: SubmissionProps) {
    const [feedback, setFeedback] = useState(submission.feedback || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const isEvaluated = !!submission.evaluated_at;

    // Sort questions by order
    const sortedQuestions = useMemo(() =>
        [...(submission.quiz.questions || [])].sort((a, b) => a.order - b.order),
        [submission.quiz.questions]
    );

    // Create a map of answers by question_id
    const answersByQuestion = useMemo(() => {
        const map: Record<number, QuizAnswer> = {};
        submission.answers.forEach(answer => {
            map[answer.question_id] = answer;
        });
        return map;
    }, [submission.answers]);

    // Calculate total points
    const totalPoints = useMemo(() =>
        sortedQuestions.reduce((sum, q) => sum + q.point, 0),
        [sortedQuestions]
    );

    // Calculate correct answers count
    const correctCount = useMemo(() =>
        submission.answers.filter(a => a.is_correct).length,
        [submission.answers]
    );

    const handleSubmitFeedback = useCallback(() => {
        if (!feedback.trim()) return;
        setIsSubmitting(true);
        router.post(
            route('quizzes.submissions.evaluate', submission.id),
            {
                submission_id: submission.id,
                feedback: feedback,
            },
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    }, [feedback, submission.id]);

    const handleDelete = useCallback(() => {
        router.patch(route('quizzes.submissions.archive', submission.id), {}, {
            onSuccess: () => {
                router.visit(route('quizzes.show', submission.quiz.id));
            }
        });
    }, [submission.id, submission.quiz.id]);

    const getTypeIcon = useCallback((type: string) => {
        switch (type) {
            case QuizQuestionType.SINGLE_CHOICE:
            case QuizQuestionType.TRUE_FALSE:
                return <Circle className="w-3.5 h-3.5" />;
            case QuizQuestionType.MULTIPLE_CHOICE:
                return <Square className="w-3.5 h-3.5" />;
            case QuizQuestionType.SHORT_ANSWER:
                return <Type className="w-3.5 h-3.5" />;
            case QuizQuestionType.LONG_ANSWER:
                return <AlignLeft className="w-3.5 h-3.5" />;
            default:
                return null;
        }
    }, []);

    const renderQuestionResult = useCallback((question: QuizQuestionDB, index: number) => {
        const answer = answersByQuestion[question.id];
        const selectedOptionIds = answer?.options || [];
        const isSingleChoice = question.type === QuizQuestionType.SINGLE_CHOICE || question.type === QuizQuestionType.TRUE_FALSE;

        return (
            <div key={question.id} className="bg-card border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                    <span className="text-sm font-semibold text-muted-foreground">
                        Q{index + 1}
                    </span>
                    <Badge variant="outline" className="text-xs gap-1.5">
                        {getTypeIcon(question.type)}
                        {QuizQuestionTypeLabels[question.type as keyof typeof QuizQuestionTypeLabels]}
                    </Badge>
                    <div className="flex-1" />
                    {answer && (
                        <Badge
                            variant="outline"
                            className={answer.is_correct
                                ? "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950"
                                : "text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950"
                            }
                        >
                            {answer.is_correct ? (
                                <><Check className="w-3 h-3 mr-1" /> Correct</>
                            ) : (
                                <><X className="w-3 h-3 mr-1" /> Incorrect</>
                            )}
                        </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                        {question.point} {question.point === 1 ? 'point' : 'points'}
                    </Badge>
                </div>

                {/* Question Content */}
                <div className="p-4 space-y-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {question.content}
                    </p>

                    {/* Options */}
                    {question.options && question.options.length > 0 && (
                        <div className="space-y-2">
                            {[...question.options]
                                .sort((a, b) => a.order - b.order)
                                .map((option) => {
                                    const isSelected = selectedOptionIds.includes(option.id);
                                    const isCorrect = option.is_correct;

                                    let optionStyle = "border-transparent bg-muted/30";
                                    if (isSelected && isCorrect) {
                                        optionStyle = "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/50";
                                    } else if (isSelected && !isCorrect) {
                                        optionStyle = "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/50";
                                    } else if (isCorrect) {
                                        optionStyle = "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30";
                                    }

                                    return (
                                        <div
                                            key={option.id}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-md border ${optionStyle}`}
                                        >
                                            {isSingleChoice ? (
                                                <Circle className={`w-4 h-4 shrink-0 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                                            ) : (
                                                <Square className={`w-4 h-4 shrink-0 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                                            )}
                                            <span className="text-sm flex-1">{option.content}</span>
                                            <div className="flex items-center gap-2">
                                                {isSelected && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Selected
                                                    </Badge>
                                                )}
                                                {isCorrect && (
                                                    <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950">
                                                        Correct
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {/* Answer placeholder for text questions */}
                    {(!question.options || question.options.length === 0) && (
                        <div className="px-3 py-2 rounded-md border border-dashed bg-muted/20">
                            <span className="text-sm text-muted-foreground italic">
                                {question.type === QuizQuestionType.SHORT_ANSWER
                                    ? 'Short text answer'
                                    : 'Long text answer'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [answersByQuestion, getTypeIcon]);

    return (
        <DashboardLayout title="Quiz Submission">
            <Head title={`Submission by ${submission.student.name}`} />
            <div className="max-w-full lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 overflow-hidden">
                {/* Header */}
                <div className="flex items-start gap-3 py-6 md:gap-4">
                    <Link href={route('quizzes.show', submission.quiz.id)} className="shrink-0 mt-1">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl truncate">
                            {submission.quiz.title}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Submission by {submission.student.name}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            {submission.score}/{totalPoints}
                        </Badge>
                        {isEvaluated && (
                            <Badge variant="default" className="bg-green-600 dark:text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Reviewed
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6 pb-6">
                    {/* Tabs */}
                    <Tabs defaultValue="results">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                            <div className="flex items-center justify-end gap-2 md:order-2 shrink-0">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setDeleteDialogOpen(true)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:order-1">
                                <TabsList className="w-max md:w-auto">
                                    <TabsTrigger value="results">Results</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        <TabsContent value="results">
                            <div className="space-y-4">
                                {/* Summary Card */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {submission.score}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Score</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">
                                                    {totalPoints}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Total Points</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {correctCount}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Correct</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                    {sortedQuestions.length - correctCount}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Incorrect</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Questions */}
                                <div className="space-y-4">
                                    {sortedQuestions.map((question, index) =>
                                        renderQuestionResult(question, index)
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="details">
                            <Card>
                                <CardContent className="space-y-4 pt-6">
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
                                            <p className="font-medium">{submission.spent_time || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Allocated Time</p>
                                            <p className="font-medium">
                                                {submission.quiz.allocated_time
                                                    ? calculateTime(submission.quiz.allocated_time)
                                                    : 'No limit'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Submitted At</p>
                                            <p className="font-medium">
                                                {submission.submitted_at
                                                    ? format(new Date(submission.submitted_at), 'MMM d, yyyy HH:mm')
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    {submission.evaluated_at && (
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Reviewed At</p>
                                                <p className="font-medium">
                                                    {format(new Date(submission.evaluated_at), 'MMM d, yyyy HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="feedback">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Teacher Feedback</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="feedback">Feedback</Label>
                                        <Textarea
                                            id="feedback"
                                            placeholder="Add feedback for this submission..."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSubmitFeedback}
                                        disabled={isSubmitting || !feedback.trim()}
                                    >
                                        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                        {isEvaluated ? 'Update Feedback' : 'Submit Feedback'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Submission"
                description="Are you sure you want to delete this submission? This action cannot be undone."
                actionLabel="Delete"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </DashboardLayout>
    );
}
