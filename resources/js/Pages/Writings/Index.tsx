import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { ArchiveRestore, FileText, ArrowUpRightIcon, Share } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ConfirmDialog } from '@/components/ConfirmDialog';

// LocalStorage keys for filter persistence
const STORAGE_KEYS = {
    TRASHED: 'writings.filter.trashed',
    SEARCH: 'writings.filter.search',
    PAGE: 'writings.filter.page',
    PER_PAGE: 'writings.filter.per_page',
};

// Helper functions for localStorage
const getStoredFilter = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
};

const setStoredFilter = (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

// Format time to minutes and seconds
const formatTime = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (seconds > 0) {
        return `${totalMinutes}m ${seconds}s`;
    }
    return `${totalMinutes}m`;
};

interface Writing {
    id: number;
    title: string;
    slug: string;
    content: string;
    allocated_time: string;
    deleted_at: string | null;
    created_at: string;
    submissions_count?: number;
}

interface PaginatedWritings {
    data: Writing[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface WritingsProps {
    writings: PaginatedWritings;
}

export default function Writings({ writings }: WritingsProps) {
    const { flash, auth } = usePage().props as any;
    const [rowSelection, setRowSelection] = useState({});

    const handleShare = async (slug: string) => {
        const hostname = window.location.hostname;
        const mainDomain = hostname.split('.').slice(-2).join('.');
        const protocol = window.location.protocol;
        const url = `${protocol}//student.${mainDomain}/tasks/${auth.user.username}/writing/${slug}`;

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied!', {
                description: 'You can share this writing with your students.',
            });
        } catch (err) {
            toast.error('Failed to copy link', {
                description: 'Please try again.',
            });
        }
    };

    // Initialize filters from localStorage or URL params
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

    // Clear URL params on mount and load data with stored filters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hasParams = urlParams.has('trashed') || urlParams.has('search') || urlParams.has('page') || urlParams.has('per_page');

        if (!hasParams) {
            // No URL params means fresh page load - fetch with localStorage values
            const needsFetch =
                currentTrashed !== 'active' ||
                search !== '' ||
                currentPage !== 1 ||
                currentPerPage !== 10;

            if (needsFetch) {
                router.get(route('writings.index'), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['writings'],
                    onSuccess: () => {
                        window.history.replaceState({}, '', route('writings.index'));
                    },
                });
            }
        } else {
            // URL has params, just clear them
            window.history.replaceState({}, '', route('writings.index'));
        }
    }, []);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

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
        onConfirm: () => {},
    });

    const handleTabChange = (value: string) => {
        setCurrentTrashed(value);
        setCurrentPage(1);
        setStoredFilter(STORAGE_KEYS.TRASHED, value);
        setStoredFilter(STORAGE_KEYS.PAGE, 1);

        router.get(route('writings.index'), {
            trashed: value,
            search: search || undefined,
            page: 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['writings'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('writings.index'));
            },
        });
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            const storedSearch = getStoredFilter(STORAGE_KEYS.SEARCH, '');
            if (search !== storedSearch) {
                setCurrentPage(1);
                setStoredFilter(STORAGE_KEYS.SEARCH, search);
                setStoredFilter(STORAGE_KEYS.PAGE, 1);

                router.get(route('writings.index'), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: 1,
                    per_page: currentPerPage,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['writings'],
                    onSuccess: () => {
                        window.history.replaceState({}, '', route('writings.index'));
                    },
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleArchive = (id: number) => {
        setConfirmDialog({
            open: true,
            title: 'Archive Writing',
            description: 'Are you sure you want to archive this writing? You can restore it later.',
            actionLabel: 'Archive',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('writings.archive', id), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['writings', 'flash'],
                });
            },
        });
    };

    const handleRestore = (id: number) => {
        setConfirmDialog({
            open: true,
            title: 'Restore Writing',
            description: 'Are you sure you want to restore this writing? It will be moved back to active writings.',
            actionLabel: 'Restore',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('writings.restore', id), {
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['writings', 'flash'],
                });
            },
        });
    };

    const handleDelete = (id: number) => {
        setConfirmDialog({
            open: true,
            title: 'Delete Writing',
            description: 'Are you sure you want to permanently delete this writing? This action cannot be undone.',
            actionLabel: 'Delete',
            variant: 'destructive',
            onConfirm: () => {
                router.delete(route('writings.delete', id), {
                    data: {
                        trashed: currentTrashed,
                        search: search || undefined,
                        page: currentPage,
                        per_page: currentPerPage,
                    },
                    preserveScroll: true,
                    preserveState: true,
                    only: ['writings', 'flash'],
                });
            },
        });
    };

    // Bulk action handlers
    const getSelectedIds = () => {
        return table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
    };

    const handleBulkArchive = () => {
        const ids = getSelectedIds();
        if (ids.length === 0) return;

        setConfirmDialog({
            open: true,
            title: 'Archive Writings',
            description: `Are you sure you want to archive ${ids.length} writing${ids.length > 1 ? 's' : ''}? You can restore them later.`,
            actionLabel: 'Archive',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('writings.archive.bulk'), {
                    ids,
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['writings', 'flash'],
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
            title: 'Restore Writings',
            description: `Are you sure you want to restore ${ids.length} writing${ids.length > 1 ? 's' : ''}? They will be moved back to active writings.`,
            actionLabel: 'Restore',
            variant: 'default',
            onConfirm: () => {
                router.patch(route('writings.restore.bulk'), {
                    ids,
                    trashed: currentTrashed,
                    search: search || undefined,
                    page: currentPage,
                    per_page: currentPerPage,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['writings', 'flash'],
                    onSuccess: () => {
                        setRowSelection({});
                    },
                });
            },
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page + 1);
        setStoredFilter(STORAGE_KEYS.PAGE, page + 1);

        router.get(route('writings.index'), {
            trashed: currentTrashed,
            search: search || undefined,
            page: page + 1,
            per_page: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['writings'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('writings.index'));
            },
        });
    };

    const handlePageSizeChange = (pageSize: number) => {
        setCurrentPerPage(pageSize);
        setCurrentPage(1);
        setStoredFilter(STORAGE_KEYS.PER_PAGE, pageSize);
        setStoredFilter(STORAGE_KEYS.PAGE, 1);

        router.get(route('writings.index'), {
            trashed: currentTrashed,
            search: search || undefined,
            page: 1,
            per_page: pageSize,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['writings'],
            onSuccess: () => {
                window.history.replaceState({}, '', route('writings.index'));
            },
        });
    };

    const columns: ColumnDef<Writing>[] = [
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
                    href={route('writings.show', row.original.id)}
                    className="font-medium hover:text-primary transition-colors"
                >
                    {row.original.title.length > 50 ? row.original.title.slice(0, 50) + '...' : row.original.title}
                </Link>
            ),
        },
        {
            accessorKey: 'allocated_time',
            header: 'Time Limit',
            cell: ({ row }) => {
                const time = row.original.allocated_time;
                return <div>{formatTime(time)}</div>;
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
                                <Link href={route('writings.edit', row.original.id)}>
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
    ];

    const table = useReactTable({
        data: writings.data,
        columns,
        pageCount: writings.last_page,
        state: {
            rowSelection,
            pagination: {
                pageIndex: writings.current_page - 1,
                pageSize: writings.per_page,
            },
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DashboardLayout title="Writings">
            <Head title="Writings - Mareff" />
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="mb-6">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Writings</h1>
                                <p className="text-muted-foreground">
                                    Manage your writing assignments
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6 gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative w-64">
                                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search writings..."
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
                                        <TabsTrigger value="active">
                                            Active
                                        </TabsTrigger>
                                        <TabsTrigger value="archived">
                                            Archived
                                        </TabsTrigger>
                                        <TabsTrigger value="all">
                                            All
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {writings.total > 0 && (
                                <Button asChild size="sm">
                                    <Link href={route('writings.create')}>
                                        Create Writing
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <Tabs value={currentTrashed}>
                            <TabsContent value={currentTrashed} className="mt-0">
                                {writings.data.length === 0 ? (
                                    currentTrashed === 'archived' ? (
                                        <Card>
                                            <CardContent className="flex flex-col items-center justify-center py-12">
                                                <p className="text-muted-foreground">
                                                    No archived writings
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Empty>
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <FileText />
                                                </EmptyMedia>
                                                <EmptyTitle>
                                                    No Writings Yet
                                                </EmptyTitle>
                                                <EmptyDescription>
                                                    You haven&apos;t created any writings yet. Get started by creating
                                                    your first writing.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                            <EmptyContent>
                                                <div className="flex items-center gap-2">
                                                    <Button asChild>
                                                        <Link href={route('writings.create')}>
                                                            Create Writing
                                                        </Link>
                                                    </Button>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="inline-block">
                                                                    <Button variant="outline" disabled>
                                                                        Import Writing
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

                                        {/* Pagination */}
                                        <div className="flex items-center justify-between px-4">
                                            <div className="hidden flex-1 lg:flex">
                                                {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            {table.getFilteredSelectedRowModel().rows.length} of{' '}
                                                            {table.getFilteredRowModel().rows.length} row(s) selected
                                                        </span>
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
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        {table.getFilteredRowModel().rows.length} row(s) total
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex w-full items-center gap-8 lg:w-fit">
                                                <div className="hidden items-center gap-2 lg:flex">
                                                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                                        Rows per page
                                                    </Label>
                                                    <Select
                                                        value={`${writings.per_page}`}
                                                        onValueChange={(value) => {
                                                            handlePageSizeChange(Number(value));
                                                        }}
                                                    >
                                                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                                            <SelectValue placeholder={writings.per_page} />
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
                                                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                                                    {table.getPageCount()}
                                                </div>
                                                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                                    <Button
                                                        variant="outline"
                                                        className="hidden h-8 w-8 p-0 lg:flex"
                                                        onClick={() => handlePageChange(0)}
                                                        disabled={writings.current_page === 1}
                                                    >
                                                        <span className="sr-only">Go to first page</span>
                                                        <IconChevronsLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => handlePageChange(writings.current_page - 2)}
                                                        disabled={writings.current_page === 1}
                                                    >
                                                        <span className="sr-only">Go to previous page</span>
                                                        <IconChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => handlePageChange(writings.current_page)}
                                                        disabled={writings.current_page === writings.last_page}
                                                    >
                                                        <span className="sr-only">Go to next page</span>
                                                        <IconChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="hidden size-8 lg:flex"
                                                        size="icon"
                                                        onClick={() => handlePageChange(writings.last_page - 1)}
                                                        disabled={writings.current_page === writings.last_page}
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
