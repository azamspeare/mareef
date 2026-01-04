import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import {
    IconEdit,
    IconTrash,
    IconArchive,
    IconSearch,
    IconDotsVertical,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconX,
} from '@tabler/icons-react';
import { ArchiveRestore, ClipboardList, ArrowUpRightIcon, Share } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getStudentUrl, calculateTime } from '@/lib/utils.ts';
import {
    getLocalStorageValue as getStoredFilter,
    setLocalStorageValue as setStoredFilter,
} from '@/hooks/use-local-storage.ts';
import type { SharedPageProps } from '@/types';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ConfirmDialog } from '@/components/confirm-dialog.tsx';

const STORAGE_KEYS = {
    TRASHED: 'quizzes.filter.trashed',
    SEARCH: 'quizzes.filter.search',
    PAGE: 'quizzes.filter.page',
    PER_PAGE: 'quizzes.filter.per_page',
};

interface Quiz {
    id: number;
    title: string;
    slug: string;
    allocated_time: string | null;
    deleted_at: string | null;
    created_at: string;
    submissions_count?: number;
    questions_count?: number;
}

interface PaginatedQuizzes {
    data: Quiz[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface QuizzesProps {
    quizzes: PaginatedQuizzes;
}

export default function Quizzes({ quizzes }: QuizzesProps) {
    const { auth } = usePage<SharedPageProps>().props;
    const [rowSelection, setRowSelection] = useState({});

    const handleShare = useCallback(async (slug: string) => {
        const url = getStudentUrl(`/tasks/${auth.user!.username}/quiz/${slug}`);

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
    }, [auth.user]);

    const [currentTrashed, setCurrentTrashed] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlTrashed = urlParams.get('trashed');
        if (urlTrashed) {
            setStoredFilter(STORAGE_KEYS.TRASHED, urlTrashed);
            return urlTrashed;
        }
        return getStoredFilter(STORAGE_KEYS.TRASHED, 'active');
    });

    const [search, setSearch] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSearch = urlParams.get('search');
        if (urlSearch) {
            setStoredFilter(STORAGE_KEYS.SEARCH, urlSearch);
            return urlSearch;
        }
        return getStoredFilter(STORAGE_KEYS.SEARCH, '');
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

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hasParams = urlParams.has('trashed') || urlParams.has('search') || urlParams.has('page') || urlParams.has('per_page');

        if (!hasParams) {
            const needsFetch =
                currentTrashed !== 'active' ||
                search !== '' ||
                currentPage !== 1 ||
                currentPerPage !== 10;

            if (needsFetch) {
                router.get(route('quizzes.index'), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['quizzes'],
                    onSuccess: () => {
                        window.history.replaceState({}, '', route('quizzes.index'));
                    },
                });
            }
        } else {
            window.history.replaceState({}, '', route('quizzes.index'));
        }
    }, []);

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
        onConfirm: () => {},
    });

    const handleTabChange = useCallback((value: string) => {
        setCurrentTrashed(value);
        setCurrentPage(1);
        setStoredFilter(STORAGE_KEYS.TRASHED, value);
        setStoredFilter(STORAGE_KEYS.PAGE, 1);

        router.get(route('quizzes.index'), {
            trashed: value,
            search: search || undefined,
            page: 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['quizzes'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('quizzes.index'));
            },
        });
    }, [search, currentPerPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const storedSearch = getStoredFilter(STORAGE_KEYS.SEARCH, '');
            if (search !== storedSearch) {
                setCurrentPage(1);
                setStoredFilter(STORAGE_KEYS.SEARCH, search);
                setStoredFilter(STORAGE_KEYS.PAGE, 1);

                router.get(route('quizzes.index'), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: 1,
                    per_page: currentPerPage,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['quizzes'],
                    onSuccess: () => {
                        window.history.replaceState({}, '', route('quizzes.index'));
                    },
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleArchive = useCallback((id: number) => {
        setConfirmDialog({
            open: true,
            title: 'Archive Quiz',
            description: 'Are you sure you want to archive this quiz? You can restore it later.',
            actionLabel: 'Archive',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('quizzes.archive', id), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['quizzes', 'flash'],
                });
            },
        });
    }, [currentTrashed, search, currentPage, currentPerPage]);

    const handleRestore = useCallback((id: number) => {
        setConfirmDialog({
            open: true,
            title: 'Restore Quiz',
            description: 'Are you sure you want to restore this quiz? It will be moved back to active quizzes.',
            actionLabel: 'Restore',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('quizzes.restore', id), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['quizzes', 'flash'],
                });
            },
        });
    }, [currentTrashed, search, currentPage, currentPerPage]);

    const handleDelete = useCallback((id: number) => {
        setConfirmDialog({
            open: true,
            title: 'Delete Quiz',
            description: 'Are you sure you want to permanently delete this quiz? This action cannot be undone.',
            actionLabel: 'Delete',
            variant: 'destructive',
            onConfirm: () => {
                router.delete(route('quizzes.delete', id), {
                    data: {
                        trashed: currentTrashed,
                        search: search || undefined,
                        page: currentPage,
                        per_page: currentPerPage,
                    },
                    preserveScroll: true,
                    preserveState: true,
                    only: ['quizzes', 'flash'],
                });
            },
        });
    }, [currentTrashed, search, currentPage, currentPerPage]);

    const getSelectedIds = () => {
        return table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
    };

    const handleBulkArchive = () => {
        const ids = getSelectedIds();
        if (ids.length === 0) return;

        setConfirmDialog({
            open: true,
            title: 'Archive Quizzes',
            description: `Are you sure you want to archive ${ids.length} quiz${ids.length > 1 ? 'zes' : ''}? You can restore them later.`,
            actionLabel: 'Archive',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('quizzes.archive.bulk'), {
                    ids,
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['quizzes', 'flash'],
                    onSuccess: () => {
                        setRowSelection({});
                    },
                });
            },
        });
    };

    const handleBulkRestore = () => {
        const ids = getSelectedIds();
        if (ids.length === 0) return;

        setConfirmDialog({
            open: true,
            title: 'Restore Quizzes',
            description: `Are you sure you want to restore ${ids.length} quiz${ids.length > 1 ? 'zes' : ''}? They will be moved back to active quizzes.`,
            actionLabel: 'Restore',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('quizzes.restore.bulk'), {
                    ids,
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['quizzes', 'flash'],
                    onSuccess: () => {
                        setRowSelection({});
                    },
                });
            },
        });
    };

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page + 1);
        setStoredFilter(STORAGE_KEYS.PAGE, page + 1);

        router.get(route('quizzes.index'), {
            trashed: currentTrashed,
            search: search || undefined,
            page: page + 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['quizzes'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('quizzes.index'));
            },
        });
    }, [currentTrashed, search, currentPerPage]);

    const handlePageSizeChange = useCallback((pageSize: number) => {
        setCurrentPerPage(pageSize);
        setCurrentPage(1);
        setStoredFilter(STORAGE_KEYS.PER_PAGE, pageSize);
        setStoredFilter(STORAGE_KEYS.PAGE, 1);

        router.get(route('quizzes.index'), {
            trashed: currentTrashed,
            search: search || undefined,
            page: 1,
            per_page: pageSize,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['quizzes'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('quizzes.index'));
            },
        });
    }, [currentTrashed, search]);

    const columns: ColumnDef<Quiz>[] = useMemo(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <Link
                    href={route('quizzes.show', row.original.id)}
                    className="font-medium hover:text-primary transition-colors"
                >
                    {row.original.title.length > 50 ? row.original.title.slice(0, 50) + '...' : row.original.title}
                </Link>
            ),
        },
        {
            accessorKey: 'questions_count',
            header: 'Questions',
            cell: ({ row }) => (
                <div>{row.original.questions_count || 0}</div>
            ),
        },
        {
            accessorKey: 'allocated_time',
            header: 'Time Limit',
            cell: ({ row }) => {
                const time = row.original.allocated_time;
                return <div>{time ? calculateTime(time) : 'No limit'}</div>;
            }
        },
        {
            accessorKey: 'submissions_count',
            header: 'Submissions',
            cell: ({ row }) => (
                <div>{row.original.submissions_count || 0}</div>
            ),
        },
        {
            accessorKey: 'deleted_at',
            header: 'Status',
            cell: ({ row }) => (
                row.original.deleted_at ? (
                    <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">Archived</Badge>
                ) : (
                    <Badge className="bg-green-700 text-white hover:bg-green-800">Active</Badge>
                )
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => (
                <div>{format(new Date(row.original.created_at), 'MMM d, yyyy')}</div>
            ),
        },
        {
            id: 'actions',
            header: () => <></>,
            cell: ({ row }) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <IconDotsVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('quizzes.edit', row.original.id)}>
                                    <IconEdit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            {!row.original.deleted_at && (
                                <DropdownMenuItem onClick={() => handleShare(row.original.slug)}>
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                </DropdownMenuItem>
                            )}
                            {row.original.deleted_at ? (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => handleRestore(row.original.id)}
                                        className="hover:bg-sky-500/30 focus:bg-sky-500/30"
                                    >
                                        <ArchiveRestore className="h-4 w-4 mr-2" />
                                        Restore
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(row.original.id)}
                                        className="hover:bg-red-500/30 focus:bg-red-500/30"
                                    >
                                        <IconTrash className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleArchive(row.original.id)}
                                        className="hover:bg-yellow-500/30 focus:bg-yellow-500/30"
                                    >
                                        <IconArchive className="h-4 w-4 mr-2" />
                                        Archive
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ], [handleShare, handleRestore, handleDelete, handleArchive]);

    const table = useReactTable({
        data: quizzes.data,
        columns,
        pageCount: quizzes.last_page,
        state: {
            rowSelection,
            pagination: {
                pageIndex: quizzes.current_page - 1,
                pageSize: quizzes.per_page,
            },
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DashboardLayout title="Quizzes">
            <Head title="Quizzes - Mareef" />
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="mb-6">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
                                <p className="text-muted-foreground">
                                    Manage your quiz assignments
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            <div className="relative md:hidden">
                                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search quizzes..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-9 w-full"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        <IconX className="h-4 w-4" />
                                        <span className="sr-only">Clear search</span>
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between md:hidden">
                                <Select value={currentTrashed} onValueChange={handleTabChange}>
                                    <SelectTrigger className="w-fit">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                        <SelectItem value="all">All</SelectItem>
                                    </SelectContent>
                                </Select>

                                {quizzes.total > 0 && (
                                    <Button asChild>
                                        <Link href={route('quizzes.create')}>
                                            Create Quiz
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-64">
                                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Search quizzes..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9 pr-9"
                                        />
                                        {search && (
                                            <button
                                                onClick={() => setSearch('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                            >
                                                <IconX className="h-4 w-4" />
                                                <span className="sr-only">Clear search</span>
                                            </button>
                                        )}
                                    </div>

                                    <Tabs value={currentTrashed} onValueChange={handleTabChange}>
                                        <TabsList>
                                            <TabsTrigger value="active">Active</TabsTrigger>
                                            <TabsTrigger value="archived">Archived</TabsTrigger>
                                            <TabsTrigger value="all">All</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                {quizzes.total > 0 && (
                                    <Button asChild>
                                        <Link href={route('quizzes.create')}>
                                            Create Quiz
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <Tabs value={currentTrashed}>
                            <TabsContent value={currentTrashed} className="mt-0">
                                {quizzes.data.length === 0 ? (
                                    currentTrashed === 'archived' ? (
                                        <Card>
                                            <CardContent className="flex flex-col items-center justify-center py-12">
                                                <p className="text-muted-foreground">
                                                    No archived quizzes
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Empty>
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <ClipboardList />
                                                </EmptyMedia>
                                                <EmptyTitle>
                                                    No Quizzes Yet
                                                </EmptyTitle>
                                                <EmptyDescription>
                                                    You haven&apos;t created any quizzes yet. Get started by creating
                                                    your first quiz.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                            <EmptyContent>
                                                <div className="flex items-center gap-2">
                                                    <Button asChild>
                                                        <Link href={route('quizzes.create')}>
                                                            Create Quiz
                                                        </Link>
                                                    </Button>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="inline-block">
                                                                    <Button variant="outline" disabled>
                                                                        Import Quiz
                                                                    </Button>
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Coming soon..</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
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
                                    )
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    {table.getHeaderGroups().map((headerGroup) => (
                                                        <TableRow key={headerGroup.id}>
                                                            {headerGroup.headers.map((header, index) => (
                                                                <TableHead key={header.id} className={index === 0 ? 'pl-6 w-12' : ''}>
                                                                    {header.isPlaceholder
                                                                        ? null
                                                                        : flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                </TableHead>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableHeader>
                                                <TableBody>
                                                    {table.getRowModel().rows?.length ? (
                                                        table.getRowModel().rows.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                data-state={row.getIsSelected() && 'selected'}
                                                            >
                                                                {row.getVisibleCells().map((cell, index) => (
                                                                    <TableCell key={cell.id} className={index === 0 ? 'pl-6 w-12' : ''}>
                                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                                No results.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        <div className="flex flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between">
                                            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                                                <div className="flex items-center justify-between lg:flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground hidden lg:inline">
                                                            {table.getFilteredSelectedRowModel().rows.length} of{' '}
                                                            {table.getFilteredRowModel().rows.length} row(s) selected
                                                        </span>
                                                        <span className="text-sm text-muted-foreground lg:hidden">
                                                            {table.getFilteredSelectedRowModel().rows.length} selected
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        {currentTrashed === 'active' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={handleBulkArchive}
                                                                className="h-8 bg-yellow-600 text-white hover:bg-yellow-700"
                                                            >
                                                                <IconArchive className="h-3.5 w-3.5 mr-1.5" />
                                                                Archive
                                                            </Button>
                                                        )}
                                                        {currentTrashed === 'archived' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={handleBulkRestore}
                                                                className="h-8 bg-sky-600 text-white hover:bg-sky-700"
                                                            >
                                                                <ArchiveRestore className="h-3.5 w-3.5 mr-1.5" />
                                                                Restore
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {table.getFilteredSelectedRowModel().rows.length === 0 && (
                                                <span className="text-sm text-muted-foreground hidden lg:inline">
                                                    {table.getFilteredRowModel().rows.length} row(s) total
                                                </span>
                                            )}

                                            <div className="flex items-center justify-between gap-4 lg:gap-8">
                                                <div className="hidden items-center gap-2 lg:flex">
                                                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                                        Rows per page
                                                    </Label>
                                                    <Select
                                                        value={`${quizzes.per_page}`}
                                                        onValueChange={(value) => {
                                                            handlePageSizeChange(Number(value));
                                                        }}
                                                    >
                                                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                                            <SelectValue placeholder={quizzes.per_page} />
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
                                                <div className="flex items-center text-sm font-medium">
                                                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                                                    {table.getPageCount()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="hidden h-8 w-8 p-0 lg:flex"
                                                        onClick={() => handlePageChange(0)}
                                                        disabled={quizzes.current_page === 1}
                                                    >
                                                        <span className="sr-only">Go to first page</span>
                                                        <IconChevronsLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => handlePageChange(quizzes.current_page - 2)}
                                                        disabled={quizzes.current_page === 1}
                                                    >
                                                        <span className="sr-only">Go to previous page</span>
                                                        <IconChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => handlePageChange(quizzes.current_page)}
                                                        disabled={quizzes.current_page === quizzes.last_page}
                                                    >
                                                        <span className="sr-only">Go to next page</span>
                                                        <IconChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="hidden size-8 lg:flex"
                                                        size="icon"
                                                        onClick={() => handlePageChange(quizzes.last_page - 1)}
                                                        disabled={quizzes.current_page === quizzes.last_page}
                                                    >
                                                        <span className="sr-only">Go to last page</span>
                                                        <IconChevronsRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
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
