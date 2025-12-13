import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IconCircleCheckFilled, IconLoader, IconPlus } from '@tabler/icons-react';

interface Submission {
    id: number;
    writing_id: number;
    student_id: number;
    spent_time: string;
    submitted_at: string;
    evaluated_at: string | null;
    created_at: string;
    writing: {
        id: number;
        title: string;
        allocated_time: string;
    };
    student: {
        id: number;
        name: string;
    };
    feedback: {
        id: number;
        submission_id: number;
        score: number;
    } | null;
}

interface PaginatedSubmissions {
    data: Submission[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface SubmissionsProps {
    submissions: PaginatedSubmissions;
}

export default function Submissions({ submissions }: SubmissionsProps) {
    const currentStatus = new URLSearchParams(window.location.search).get('status') || 'not_reviewed';

    const handleTabChange = (value: string) => {
        router.get(route('submissions.index'), { status: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout title="Submissions">
            <Head title="Submissions - Mareef" />
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
                                <p className="text-muted-foreground">
                                    Review and evaluate student submissions
                                </p>
                            </div>
                            <Button asChild>
                                <Link href={route('writings.create')}>
                                    <IconPlus className="h-4 w-4 mr-2" />
                                    Add Writing
                                </Link>
                            </Button>
                        </div>

                        <Tabs value={currentStatus} onValueChange={handleTabChange}>
                            <TabsList className="mb-6">
                                <TabsTrigger value="not_reviewed">
                                    Not Reviewed
                                </TabsTrigger>
                                <TabsTrigger value="evaluated">
                                    Evaluated
                                </TabsTrigger>
                                <TabsTrigger value="all">
                                    All
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value={currentStatus} className="mt-0">
                                <div className="overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader className="bg-muted sticky top-0 z-10">
                                            <TableRow>
                                                <TableHead>Writing</TableHead>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Spent Time</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Score</TableHead>
                                                <TableHead>Submitted At</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {submissions.data.length > 0 ? (
                                                submissions.data.map((submission) => (
                                                    <TableRow
                                                        key={submission.id}
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            router.visit(route('submissions.show', submission.id));
                                                        }}
                                                    >
                                                        <TableCell className="font-medium">
                                                            {submission.writing.title}
                                                        </TableCell>
                                                        <TableCell>{submission.student.name}</TableCell>
                                                        <TableCell>{submission.spent_time}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="text-muted-foreground px-1.5">
                                                                {submission.evaluated_at ? (
                                                                    <>
                                                                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 mr-1" />
                                                                        Done
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <IconLoader className="mr-1" />
                                                                        Not Reviewed
                                                                    </>
                                                                )}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {submission.feedback?.score ?? '-'}
                                                        </TableCell>
                                                        <TableCell>{submission.submitted_at}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        No submissions found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
