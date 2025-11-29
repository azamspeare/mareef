import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, User, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

interface Writing {
    id: number;
    title: string;
    content: string;
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
    score: number;
    comments: string | null;
    created_at: string;
    updated_at: string;
}

interface Submission {
    id: number;
    writing_id: number;
    student_id: number;
    content: string;
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
}

export default function Show({ submission }: ShowProps) {
    const [isEvaluating, setIsEvaluating] = useState(!submission.feedback);

    const { data, setData, post, processing, errors } = useForm({
        score: submission.feedback?.score?.toString() || '',
        comments: submission.feedback?.comments || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('submissions.feedback.evaluate', submission.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEvaluating(false);
            },
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <DashboardLayout title="Submission Review">
            <Head title={`Submission by ${submission.student.name} - Mareff`} />
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href={route('submissions.index')}>
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        {submission.writing.title}
                                    </h1>
                                    {submission.evaluated_at ? (
                                        <Badge variant="default" className="bg-green-500">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Evaluated
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">Pending Review</Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground mt-1">
                                    Submission by {submission.student.name}
                                </p>
                            </div>
                            {submission.feedback && !isEvaluating && (
                                <Button onClick={() => setIsEvaluating(true)} variant="outline">
                                    Edit Evaluation
                                </Button>
                            )}
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Student Response</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="prose prose-lg max-w-none dark:prose-invert"
                                            dangerouslySetInnerHTML={{ __html: submission.content }}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Writing Assignment</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="prose max-w-none dark:prose-invert text-muted-foreground"
                                            dangerouslySetInnerHTML={{ __html: submission.writing.content }}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Submission Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{submission.student.name}</p>
                                                <p className="text-muted-foreground">{submission.student.email}</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-muted-foreground">Time Spent</p>
                                                <p className="font-medium">{submission.spent_time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-muted-foreground">Allocated Time</p>
                                                <p className="font-medium">{submission.writing.allocated_time}</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-muted-foreground">Submitted</p>
                                                <p className="font-medium">{formatDateTime(submission.submitted_at)}</p>
                                            </div>
                                        </div>
                                        {submission.evaluated_at && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-muted-foreground">Evaluated</p>
                                                    <p className="font-medium">{formatDateTime(submission.evaluated_at)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {isEvaluating ? (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Evaluation</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="score">Score *</Label>
                                                    <Input
                                                        id="score"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        placeholder="e.g., 85"
                                                        value={data.score}
                                                        onChange={(e) => setData('score', e.target.value)}
                                                        required
                                                    />
                                                    {errors.score && (
                                                        <p className="text-sm text-red-500">{errors.score}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="comments">Comments</Label>
                                                    <Textarea
                                                        id="comments"
                                                        placeholder="Provide feedback to the student..."
                                                        rows={6}
                                                        value={data.comments}
                                                        onChange={(e) => setData('comments', e.target.value)}
                                                    />
                                                    {errors.comments && (
                                                        <p className="text-sm text-red-500">{errors.comments}</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="flex-1"
                                                    >
                                                        {processing ? 'Saving...' : submission.feedback ? 'Update Evaluation' : 'Submit Evaluation'}
                                                    </Button>
                                                    {submission.feedback && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setIsEvaluating(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                ) : submission.feedback && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Evaluation</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">Score</Label>
                                                <p className="text-3xl font-bold">{submission.feedback.score}/100</p>
                                            </div>
                                            {submission.feedback.comments && (
                                                <>
                                                    <Separator />
                                                    <div>
                                                        <Label className="text-muted-foreground">Comments</Label>
                                                        <p className="mt-2 text-sm whitespace-pre-wrap">
                                                            {submission.feedback.comments}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
