import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react"
import { z } from "zod"
import { Link, router, usePage } from "@inertiajs/react"
import { format } from "date-fns"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export const schema = z.object({
  id: z.number(),
  writing_id: z.number(),
  student_id: z.number(),
  spent_time: z.string(),
  submitted_at: z.string(),
  evaluated_at: z.string().nullable(),
  created_at: z.string(),
  writing: z.object({
    id: z.number(),
    title: z.string(),
    allocated_time: z.string(),
  }),
  student: z.object({
    id: z.number(),
    name: z.string(),
  }),
  feedback: z.object({
    id: z.number(),
    submission_id: z.number(),
    score: z.number(),
  }).nullable(),
})

export type Submission = z.infer<typeof schema>

export interface Counts {
  all: number;
  not_reviewed: number;
  evaluated: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

// LocalStorage keys for filter persistence
const STORAGE_KEYS = {
  STATUS: 'dashboard.filter.status',
  PAGE: 'dashboard.filter.page',
  PER_PAGE: 'dashboard.filter.per_page',
  SEARCH: 'dashboard.filter.search',
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

export function DataTable({
  data: initialData,
  counts,
  pagination: paginationMeta,
}: {
  data: Submission[]
  counts: Counts
  pagination: PaginationMeta
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [_, setIsLoadingFilters] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [submissionToDelete, setSubmissionToDelete] = React.useState<Submission | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props

  // Handle flash messages
  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  // Initialize filters from localStorage or URL params
  const [currentStatus, setCurrentStatus] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlStatus = urlParams.get('status');
    if (urlStatus) {
      setStoredFilter(STORAGE_KEYS.STATUS, urlStatus);
      return urlStatus;
    }
    return getStoredFilter(STORAGE_KEYS.STATUS, 'not_reviewed');
  });

  const [currentPage, setCurrentPage] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = urlParams.get('page');
    if (urlPage) {
      setStoredFilter(STORAGE_KEYS.PAGE, parseInt(urlPage));
      return parseInt(urlPage);
    }
    return getStoredFilter(STORAGE_KEYS.PAGE, 1);
  });

  const [currentPerPage, setCurrentPerPage] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPerPage = urlParams.get('per_page');
    if (urlPerPage) {
      setStoredFilter(STORAGE_KEYS.PER_PAGE, parseInt(urlPerPage));
      return parseInt(urlPerPage);
    }
    return getStoredFilter(STORAGE_KEYS.PER_PAGE, 10);
  });

  const [currentSearch, setCurrentSearch] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearch = urlParams.get('search');
    if (urlSearch) {
      setStoredFilter(STORAGE_KEYS.SEARCH, urlSearch);
      return urlSearch;
    }
    return getStoredFilter(STORAGE_KEYS.SEARCH, '');
  });

  const [searchInputValue, setSearchInputValue] = React.useState(currentSearch);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // On mount: load data with stored filters if no URL params
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasParams = urlParams.has('status') || urlParams.has('page') || urlParams.has('per_page') || urlParams.has('search');

    if (!hasParams) {
      // No URL params means fresh page load - fetch with localStorage values
      const needsFetch =
        currentStatus !== 'not_reviewed' ||
        currentPage !== 1 ||
        currentPerPage !== 10 ||
        currentSearch !== '';

      if (needsFetch) {
        setIsLoadingFilters(true);
        router.get(route('dashboard'), {
          status: currentStatus,
          page: currentPage,
          per_page: currentPerPage,
          search: currentSearch || undefined,
        }, {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['submissions', 'counts'],
          onSuccess: () => {
            window.history.replaceState({}, '', route('dashboard'));
            setIsLoadingFilters(false);
          },
          onError: () => {
            setIsLoadingFilters(false);
          },
        });
      }
    } else {
      // URL has params, just clear them after component mounts
      window.history.replaceState({}, '', route('dashboard'));
    }
  }, []); // Empty dependency array - only run once on mount

  const handleTabChange = (value: string) => {
    setCurrentStatus(value);
    setCurrentPage(1);
    setStoredFilter(STORAGE_KEYS.STATUS, value);
    setStoredFilter(STORAGE_KEYS.PAGE, 1);

    router.get(route('dashboard'), {
      status: value,
      page: 1,
      per_page: currentPerPage,
      search: currentSearch || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: ['submissions', 'counts'],
      onSuccess: () => {
        window.history.replaceState({}, '', route('dashboard'));
      },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page + 1);
    setStoredFilter(STORAGE_KEYS.PAGE, page + 1);

    router.get(route('dashboard'), {
      page: page + 1,
      status: currentStatus,
      per_page: currentPerPage,
      search: currentSearch || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: ['submissions', 'counts'],
      onSuccess: () => {
        window.history.replaceState({}, '', route('dashboard'));
      },
    });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setCurrentPerPage(pageSize);
    setCurrentPage(1);
    setStoredFilter(STORAGE_KEYS.PER_PAGE, pageSize);
    setStoredFilter(STORAGE_KEYS.PAGE, 1);

    router.get(route('dashboard'), {
      per_page: pageSize,
      page: 1,
      status: currentStatus,
      search: currentSearch || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: ['submissions', 'counts'],
      onSuccess: () => {
        window.history.replaceState({}, '', route('dashboard'));
      },
    });
  };

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce the search request
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentSearch(value);
      setCurrentPage(1);
      setStoredFilter(STORAGE_KEYS.SEARCH, value);
      setStoredFilter(STORAGE_KEYS.PAGE, 1);

      router.get(route('dashboard'), {
        search: value || undefined,
        page: 1,
        status: currentStatus,
        per_page: currentPerPage,
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['submissions', 'counts'],
        onSuccess: () => {
          window.history.replaceState({}, '', route('dashboard'));
        },
      });
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchInputValue('');
    setCurrentSearch('');
    setCurrentPage(1);
    setStoredFilter(STORAGE_KEYS.SEARCH, '');
    setStoredFilter(STORAGE_KEYS.PAGE, 1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    router.get(route('dashboard'), {
      page: 1,
      status: currentStatus,
      per_page: currentPerPage,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: ['submissions', 'counts'],
      onSuccess: () => {
        window.history.replaceState({}, '', route('dashboard'));
      },
    });
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteSubmission = () => {
    if (!submissionToDelete) return;

    setIsDeleting(true);
    router.patch(route('submissions.archive', submissionToDelete.id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSubmissionToDelete(null);
        setIsDeleting(false);
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  };

  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: "writing.title",
      header: "Writing",
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.writing.title.length > 40 ? row.original.writing.title.slice(0, 40) + "..." : row.original.writing.title}</div>
      },
      enableHiding: false,
    },
    {
      accessorKey: "student.name",
      header: "Student",
      cell: ({ row }) => {
        return <div>{row.original.student.name}</div>
      },
      enableHiding: false,
    },
    {
      accessorKey: "spent_time",
      header: "Spent Time",
      cell: ({ row }) => {
        return <div>{row.original.spent_time}</div>
      },
    },
    {
      accessorKey: "evaluated_at",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.evaluated_at ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {row.original.evaluated_at ? "Done" : "Not Reviewed"}
        </Badge>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "feedback.score",
      header: "Score",
      cell: ({ row }) => {
        return <div>{row.original.feedback?.score ?? "-"}</div>
      },
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted At",
      cell: ({ row }) => {
        return <div>{row.original.submitted_at ? format(new Date(row.original.submitted_at), "MMM d, yyyy hh:mm") : "-"}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem asChild>
              <Link href={route('submissions.show', row.original.id)}>Review</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setSubmissionToDelete(row.original);
                setDeleteDialogOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: initialData,
    columns,
    pageCount: paginationMeta.last_page,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: paginationMeta.current_page - 1,
        pageSize: paginationMeta.per_page,
      },
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Tabs
      value={currentStatus}
      onValueChange={handleTabChange}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title or student..."
              value={searchInputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 pr-8 w-48 lg:w-64 h-9"
            />
            {searchInputValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="size-4" />
              </button>
            )}
          </div>

          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select value={currentStatus} onValueChange={handleTabChange}>
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="not_reviewed">Not Reviewed</SelectItem>
              <SelectItem value="evaluated">Evaluated</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-3 @4xl/main:flex">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="not_reviewed">
              Not Reviewed <Badge variant="secondary">{counts.not_reviewed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="evaluated">
              Evaluated <Badge variant="secondary">{counts.evaluated}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" asChild>
            <Link href={route('writings.create')}>
              <IconPlus />
              <span className="hidden lg:inline">Add Writing</span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent
        value={currentStatus}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan} className={index === 0 ? "pl-6" : ""}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id} className={index === 0 ? "pl-6" : ""}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${paginationMeta.per_page}`}
                onValueChange={(value) => {
                  handlePageSizeChange(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={paginationMeta.per_page}
                  />
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(0)}
                disabled={paginationMeta.current_page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => handlePageChange(paginationMeta.current_page - 2)}
                disabled={paginationMeta.current_page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => handlePageChange(paginationMeta.current_page)}
                disabled={paginationMeta.current_page === paginationMeta.last_page}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => handlePageChange(paginationMeta.last_page - 1)}
                disabled={paginationMeta.current_page === paginationMeta.last_page}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the submission by{" "}
              <span className="font-medium">{submissionToDelete?.student.name}</span> for{" "}
              <span className="font-medium">{submissionToDelete?.writing.title}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmission}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}
