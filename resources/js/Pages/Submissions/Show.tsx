import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import {
    ArrowLeft, CheckCircle, Clock, User, Calendar, MessageSquare, Star, ClipboardList, ArrowUpRightIcon
} from 'lucide-react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import "@blocknote/mantine/style.css";

interface Writing {
    id: number;
    title: string;
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
    score: number;
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
}

export default function Show({ submission }: ShowProps) {
    const { theme } = useTheme();

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
    const submissionContent = useMemo(() => {
        if (!submission.content) return undefined;
        return Array.isArray(submission.content)
            ? submission.content
            : JSON.parse(submission.content as string);
    }, [submission.content]);

    // Parse writing content for BlockNote
    const writingContent = useMemo(() => {
        if (!submission.writing.content) return undefined;
        return Array.isArray(submission.writing.content)
            ? submission.writing.content
            : JSON.parse(submission.writing.content as string);
    }, [submission.writing.content]);

    const submissionEditor = useCreateBlockNote({
        initialContent: submissionContent,
    });

    const writingEditor = useCreateBlockNote({
        initialContent: writingContent,
    });

    return (
        <DashboardLayout title="Submission Review">
            <Head title={`Submission by ${submission.student.name} - Mareff`} />
            <div className="max-w-3xl lg:max-w-4xl 2xl:max-w-6xl mx-auto px-6 lg:px-8">
                <div className="flex items-center gap-4 py-6">
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
                            {submission.feedback ? (
                                <Badge variant="default" className="bg-green-500">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Evaluated
                                </Badge>
                            ) : (
                                <Badge variant="secondary">Not Evaluated</Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Submission by {submission.student.name}
                        </p>
                    </div>
                    <Button>Start Evaluation</Button>
                </div>

                <div className="space-y-6 pb-6">
                    <Tabs defaultValue="writing-assignment">
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
                                    {submission.feedback ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Star className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Score</p>
                                                    <p className="text-2xl font-bold">{submission.feedback.score}/100</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Feedback</p>
                                                    <p className="font-medium whitespace-pre-wrap">
                                                        {submission.feedback.feedback || 'No feedback provided'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Evaluated At</p>
                                                    <p className="font-medium">{formatDateTime(submission.feedback.updated_at)}</p>
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
                                                <Button>Start Evaluation</Button>
                                                <Button
                                                    variant="link"
                                                    asChild
                                                    className="text-muted-foreground"
                                                    size="sm"
                                                >
                                                    <a href="#">
                                                        Learn More <ArrowUpRightIcon />
                                                    </a>
                                                </Button>
                                            </EmptyContent>
                                        </Empty>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Card>
                        <CardHeader>
                            <CardTitle>Student Response</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-stone dark:prose-invert max-w-none">
                                <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 pointer-events-none writing-details">
                                    <BlockNoteView
                                        editor={submissionEditor}
                                        theme={theme === "dark" ? "dark" : "light"}
                                        editable={false}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
