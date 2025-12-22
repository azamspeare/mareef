import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.tsx';
import { ActivityChart } from '@/components/activity-chart.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { socialIcons } from '@/lib/images.ts';
import { format } from 'date-fns';

interface TelegramUser {
    id: number;
    chat_id: number;
    username: string | null;
}

interface Student {
    id: number;
    name: string;
    email: string;
    username: string;
    created_at: string;
    telegram_user: TelegramUser | null;
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

interface Filters {
    status: string;
    page: number;
    per_page: number;
}

interface StudentShowProps {
    student: Student;
    submissions: PaginatedSubmissions;
    activity: ActivityData;
    filters: Filters;
}

export default function StudentShow({ student, submissions, activity, filters }: StudentShowProps) {
    const currentStatus = filters.status || 'all';
    const currentPerPage = filters.per_page || 10;

    const handleTabChange = (value: string) => {
        router.get(route('students.show', student.id), {
            status: value,
            page: 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['submissions', 'filters'],
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('students.show', student.id), {
            status: currentStatus,
            page: page + 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['submissions', 'filters'],
        });
    };

    const handlePageSizeChange = (pageSize: number) => {
        router.get(route('students.show', student.id), {
            status: currentStatus,
            page: 1,
            per_page: pageSize,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['submissions', 'filters'],
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
                            <div className="flex items-stretch gap-4">
                                <div className="bg-muted flex size-16 items-center justify-center rounded-full shrink-0">
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
                                    {/* Mobile: Social accounts */}
                                    {student.telegram_user && (
                                        <div className="mt-3 sm:hidden">
                                            {student.telegram_user.username ? (
                                                <a
                                                    href={`https://t.me/${student.telegram_user.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <img src={socialIcons.telegram} alt="Telegram" className="size-5" />
                                                </a>
                                            ) : (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-default">
                                                            <img src={socialIcons.telegram} alt="Telegram" className="size-5" />
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        User's Telegram profile is not public
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Desktop: Submissions count and social accounts */}
                                <div className="text-right hidden sm:flex flex-col justify-between">
                                    <div id="submissions-count">
                                        <div className="text-3xl font-bold">{submissions.total}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Total Submissions
                                        </div>
                                    </div>
                                    {student.telegram_user && (
                                        <div id="social-accounts">
                                            {student.telegram_user.username ? (
                                                <a
                                                    href={`https://t.me/${student.telegram_user.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <img src={socialIcons.telegram} alt="Telegram" className="size-5" />
                                                </a>
                                            ) : (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-default">
                                                            <img src={socialIcons.telegram} alt="Telegram" className="size-5" />
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        User's Telegram profile is not public
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    )}
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
