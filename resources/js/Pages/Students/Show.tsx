import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { ActivityChart } from '@/components/activity-chart';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    IconArrowLeft,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconLoader,
    IconMail,
    IconUser,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface Student {
    id: number;
    name: string;
    email: string;
    username: string;
    created_at: string;
}

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

interface ActivityData {
    [date: string]: number;
}

interface StudentShowProps {
    student: Student;
    submissions: PaginatedSubmissions;
    activity: ActivityData;
}

// LocalStorage keys for filter persistence
const STORAGE_KEYS = {
    STATUS: 'student.submissions.filter.status',
    PAGE: 'student.submissions.filter.page',
    PER_PAGE: 'student.submissions.filter.per_page',
};

const getStoredFilter = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
};

const setStoredFilter = (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

export default function StudentShow({ student, submissions, activity }: StudentShowProps) {
    const [currentStatus, setCurrentStatus] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlStatus = urlParams.get('status');
        if (urlStatus) {
            setStoredFilter(STORAGE_KEYS.STATUS, urlStatus);
            return urlStatus;
        }
        return getStoredFilter(STORAGE_KEYS.STATUS, 'all');
    });

    const [currentPage, setCurrentPage] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPage = urlParams.get('page');
        if (urlPage) {
            setStoredFilter(STORAGE_KEYS.PAGE, parseInt(urlPage));
            return parseInt(urlPage);
        }
        return getStoredFilter(STORAGE_KEYS.PAGE, 1);
    });

    const [currentPerPage, setCurrentPerPage] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPerPage = urlParams.get('per_page');
        if (urlPerPage) {
            setStoredFilter(STORAGE_KEYS.PER_PAGE, parseInt(urlPerPage));
            return parseInt(urlPerPage);
        }
        return getStoredFilter(STORAGE_KEYS.PER_PAGE, 10);
    });

    // Clear URL params on mount and load data with stored filters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hasParams = urlParams.has('status') || urlParams.has('page') || urlParams.has('per_page');

        if (!hasParams) {
            const needsFetch =
                currentStatus !== 'all' ||
                currentPage !== 1 ||
                currentPerPage !== 10;

            if (needsFetch) {
                router.get(route('students.show', student.id), {
                    status: currentStatus,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['submissions'],
                    onSuccess: () => {
                        window.history.replaceState({}, '', route('students.show', student.id));
                    },
                });
            }
        } else {
            window.history.replaceState({}, '', route('students.show', student.id));
        }
    }, []);

    const handleTabChange = (value: string) => {
        setCurrentStatus(value);
        setCurrentPage(1);
        setStoredFilter(STORAGE_KEYS.STATUS, value);
        setStoredFilter(STORAGE_KEYS.PAGE, 1);

        router.get(route('students.show', student.id), {
            status: value,
            page: 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['submissions'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('students.show', student.id));
            },
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page + 1);
        setStoredFilter(STORAGE_KEYS.PAGE, page + 1);

        router.get(route('students.show', student.id), {
            status: currentStatus,
            page: page + 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['submissions'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('students.show', student.id));
            },
        });
    };

    const handlePageSizeChange = (pageSize: number) => {
        setCurrentPerPage(pageSize);
        setCurrentPage(1);
        setStoredFilter(STORAGE_KEYS.PER_PAGE, pageSize);
        setStoredFilter(STORAGE_KEYS.PAGE, 1);

        router.get(route('students.show', student.id), {
            status: currentStatus,
            page: 1,
            per_page: pageSize,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['submissions'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('students.show', student.id));
            },
        });
    };

    return (
        <DashboardLayout title={student.name}>
            <Head title={`${student.name} - Mareef`} />
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        {/* Back button */}
                        <Button variant="ghost" size="sm" asChild className="mb-4">
                            <Link href={route('students.index')}>
                                <IconArrowLeft className="h-4 w-4 mr-2" />
                                Back to Students
                            </Link>
                        </Button>

                        {/* Student Details Card */}
                        <div className="rounded-lg border bg-card p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                                    <IconUser className="text-muted-foreground size-8" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
                                    <p className="text-muted-foreground">@{student.username}</p>
                                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                        <IconMail className="size-4" />
                                        <span>{student.email}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Joined {format(new Date(student.created_at), 'MMMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <div className="text-3xl font-bold">{submissions.total}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Total Submissions
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Chart */}
                        <div className="mb-6">
                            <ActivityChart data={activity} />
                        </div>

                        {/* Submissions Section */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Submissions</h2>

                            <Tabs value={currentStatus} onValueChange={handleTabChange}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="all">
                                        All
                                    </TabsTrigger>
                                    <TabsTrigger value="not_reviewed">
                                        Not Reviewed
                                    </TabsTrigger>
                                    <TabsTrigger value="evaluated">
                                        Evaluated
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value={currentStatus} className="mt-0">
                                    <div className="overflow-hidden rounded-lg border">
                                        <Table>
                                            <TableHeader className="bg-muted sticky top-0 z-10">
                                                <TableRow>
                                                    <TableHead className="pl-6">Writing</TableHead>
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
                                                            <TableCell className="font-medium pl-6">
                                                                {submission.writing.title}
                                                            </TableCell>
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
                                                            <TableCell>
                                                                {format(new Date(submission.submitted_at), 'MMM d, yyyy HH:mm')}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-24 text-center">
                                                            No submissions found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    {submissions.total > 0 && (
                                        <div className="flex items-center justify-between px-4 mt-4">
                                            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                                                {submissions.total} submission{submissions.total !== 1 ? 's' : ''} total
                                            </div>
                                            <div className="flex w-full items-center gap-8 lg:w-fit">
                                                <div className="hidden items-center gap-2 lg:flex">
                                                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                                        Rows per page
                                                    </Label>
                                                    <Select
                                                        value={`${submissions.per_page}`}
                                                        onValueChange={(value) => {
                                                            handlePageSizeChange(Number(value));
                                                        }}
                                                    >
                                                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                                            <SelectValue placeholder={submissions.per_page} />
                                                        </SelectTrigger>
                                                        <SelectContent side="top">
                                                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                                    {pageSize}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex w-fit items-center justify-center text-sm font-medium">
                                                    Page {submissions.current_page} of{' '}
                                                    {submissions.last_page}
                                                </div>
                                                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                                    <Button
                                                        variant="outline"
                                                        className="hidden h-8 w-8 p-0 lg:flex"
                                                        onClick={() => handlePageChange(0)}
                                                        disabled={submissions.current_page === 1}
                                                    >
                                                        <span className="sr-only">Go to first page</span>
                                                        <IconChevronsLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => handlePageChange(submissions.current_page - 2)}
                                                        disabled={submissions.current_page === 1}
                                                    >
                                                        <span className="sr-only">Go to previous page</span>
                                                        <IconChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => handlePageChange(submissions.current_page)}
                                                        disabled={submissions.current_page === submissions.last_page}
                                                    >
                                                        <span className="sr-only">Go to next page</span>
                                                        <IconChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="hidden size-8 lg:flex"
                                                        size="icon"
                                                        onClick={() => handlePageChange(submissions.last_page - 1)}
                                                        disabled={submissions.current_page === submissions.last_page}
                                                    >
                                                        <span className="sr-only">Go to last page</span>
                                                        <IconChevronsRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
