import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    IconPlus,
    IconEdit,
    IconTrash,
    IconArchive,
    IconRestore,
    IconSearch,
    IconDotsVertical,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconX,
} from '@tabler/icons-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Writing {
    id: number;
    title: string;
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
    const urlParams = new URLSearchParams(window.location.search);
    const currentTrashed = urlParams.get('trashed') || 'active';
    const currentSearch = urlParams.get('search') || '';

    const [search, setSearch] = useState(currentSearch);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

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
        router.get(route('writings.index'), { trashed: value, search: search || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== currentSearch) {
                router.get(route('writings.index'), {
                    trashed: currentTrashed,
                    search: search || undefined
                }, {
                    preserveState: true,
                    preserveScroll: true,
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
                router.patch(route('writings.archive', id), {}, {
                    preserveScroll: true,
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
                router.patch(route('writings.restore', id), {}, {
                    preserveScroll: true,
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
                    preserveScroll: true,
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
                router.patch(route('writings.archive.bulk'), { ids }, {
                    preserveScroll: true,
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
                router.patch(route('writings.restore.bulk'), { ids }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setRowSelection({});
                    },
                });
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
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => (
                <div>{format(new Date(row.original.created_at), 'MMM d, yyyy')}</div>
            ),
        },
        {
            accessorKey: 'allocated_time',
            header: 'Time Limit',
            cell: ({ row }) => {
                const time = row.original.allocated_time;
                if (!time) return 'No limit';
                const [hours, minutes, seconds] = time.split(':').map(Number);
                if (hours === 0 && minutes === 0) return <div>{seconds}s</div>;
                if (hours === 0 && seconds === 0) return <div>{minutes}m</div>;
                if (minutes === 0 && seconds === 0) return <div>{hours}h</div>;
                if (minutes === 0) return <div>{hours}h {seconds}s</div>;
                return <div>{hours}h {minutes}m {seconds}s</div>;
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
                    <Badge variant="secondary">Archived</Badge>
                ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                )
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
                            {row.original.deleted_at ? (
                                <>
                                    <DropdownMenuItem onClick={() => handleRestore(row.original.id)}>
                                        <IconRestore className="h-4 w-4 mr-2" />
                                        Restore
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(row.original.id)}
                                        className="text-red-600"
                                    >
                                        <IconTrash className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem onClick={() => handleArchive(row.original.id)}>
                                    <IconArchive className="h-4 w-4 mr-2" />
                                    Archive
                                </DropdownMenuItem>
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
        state: {
            rowSelection,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                                <Button asChild>
                                    <Link href={route('writings.create')}>
                                        <IconPlus className="h-4 w-4 mr-2" />
                                        Create Writing
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <Tabs value={currentTrashed}>
                            <TabsContent value={currentTrashed} className="mt-0">
                                {writings.data.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12">
                                            <p className="text-muted-foreground mb-4">
                                                {currentTrashed === 'active' && 'No active writings yet'}
                                                {currentTrashed === 'archived' && 'No archived writings'}
                                                {currentTrashed === 'all' && 'No writings yet'}
                                            </p>
                                            {currentTrashed === 'active' && (
                                                <Button asChild>
                                                    <Link href={route('writings.create')}>
                                                        <IconPlus className="h-4 w-4 mr-2" />
                                                        Create Your First Writing
                                                    </Link>
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
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
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={handleBulkArchive}
                                                                    className="h-8"
                                                                >
                                                                    <IconArchive className="h-3.5 w-3.5 mr-1.5" />
                                                                    Archive
                                                                </Button>
                                                            )}
                                                            {currentTrashed === 'archived' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={handleBulkRestore}
                                                                    className="h-8"
                                                                >
                                                                    <IconRestore className="h-3.5 w-3.5 mr-1.5" />
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
                                                        value={`${table.getState().pagination.pageSize}`}
                                                        onValueChange={(value) => {
                                                            table.setPageSize(Number(value));
                                                        }}
                                                    >
                                                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                                            <SelectValue placeholder={table.getState().pagination.pageSize} />
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
                                                        onClick={() => table.setPageIndex(0)}
                                                        disabled={!table.getCanPreviousPage()}
                                                    >
                                                        <span className="sr-only">Go to first page</span>
                                                        <IconChevronsLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => table.previousPage()}
                                                        disabled={!table.getCanPreviousPage()}
                                                    >
                                                        <span className="sr-only">Go to previous page</span>
                                                        <IconChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="size-8"
                                                        size="icon"
                                                        onClick={() => table.nextPage()}
                                                        disabled={!table.getCanNextPage()}
                                                    >
                                                        <span className="sr-only">Go to next page</span>
                                                        <IconChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="hidden size-8 lg:flex"
                                                        size="icon"
                                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                                        disabled={!table.getCanNextPage()}
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
