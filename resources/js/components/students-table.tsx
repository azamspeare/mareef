import { useState, useEffect } from "react"
import { router, Link } from "@inertiajs/react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconMail,
  IconUser,
  IconSearch,
  IconX,
} from "@tabler/icons-react"
import { z } from "zod"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

export const studentSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  username: z.string(),
  created_at: z.string(),
  submissions_count: z.number().optional().default(0),
})

export type Student = z.infer<typeof studentSchema>

interface PaginatedStudents {
  data: Student[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// LocalStorage keys for filter persistence
const STORAGE_KEYS = {
  SEARCH: 'students.filter.search',
  PAGE: 'students.filter.page',
  PER_PAGE: 'students.filter.per_page',
}

const getStoredFilter = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : defaultValue
}

const setStoredFilter = (key: string, value: any) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function StudentsTable({
  students,
}: {
  students: PaginatedStudents
}) {
  // Initialize filters from localStorage or URL params
  const [search, setSearch] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlSearch = urlParams.get('search')
    if (urlSearch) {
      setStoredFilter(STORAGE_KEYS.SEARCH, urlSearch)
      return urlSearch
    }
    return getStoredFilter(STORAGE_KEYS.SEARCH, '')
  })

  const [currentPage, setCurrentPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlPage = urlParams.get('page')
    if (urlPage) {
      setStoredFilter(STORAGE_KEYS.PAGE, parseInt(urlPage))
      return parseInt(urlPage)
    }
    return getStoredFilter(STORAGE_KEYS.PAGE, 1)
  })

  const [currentPerPage, setCurrentPerPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlPerPage = urlParams.get('per_page')
    if (urlPerPage) {
      setStoredFilter(STORAGE_KEYS.PER_PAGE, parseInt(urlPerPage))
      return parseInt(urlPerPage)
    }
    return getStoredFilter(STORAGE_KEYS.PER_PAGE, 10)
  })

  // Clear URL params on mount and load data with stored filters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const hasParams = urlParams.has('search') || urlParams.has('page') || urlParams.has('per_page')

    if (!hasParams) {
      const needsFetch =
        search !== '' ||
        currentPage !== 1 ||
        currentPerPage !== 10

      if (needsFetch) {
        router.get(route('students.index'), {
          search: search || undefined,
          page: currentPage,
          per_page: currentPerPage,
        }, {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['students'],
          onSuccess: () => {
            window.history.replaceState({}, '', route('students.index'))
          },
        })
      }
    } else {
      window.history.replaceState({}, '', route('students.index'))
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedSearch = getStoredFilter(STORAGE_KEYS.SEARCH, '')
      if (search !== storedSearch) {
        setCurrentPage(1)
        setStoredFilter(STORAGE_KEYS.SEARCH, search)
        setStoredFilter(STORAGE_KEYS.PAGE, 1)

        router.get(route('students.index'), {
          search: search || undefined,
          page: 1,
          per_page: currentPerPage,
        }, {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['students'],
          onSuccess: () => {
            window.history.replaceState({}, '', route('students.index'))
          },
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const handlePageChange = (page: number) => {
    setCurrentPage(page + 1)
    setStoredFilter(STORAGE_KEYS.PAGE, page + 1)

    router.get(route('students.index'), {
      search: search || undefined,
      page: page + 1,
      per_page: currentPerPage,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: ['students'],
      onSuccess: () => {
        window.history.replaceState({}, '', route('students.index'))
      },
    })
  }

  const handlePageSizeChange = (pageSize: number) => {
    setCurrentPerPage(pageSize)
    setCurrentPage(1)
    setStoredFilter(STORAGE_KEYS.PER_PAGE, pageSize)
    setStoredFilter(STORAGE_KEYS.PAGE, 1)

    router.get(route('students.index'), {
      search: search || undefined,
      page: 1,
      per_page: pageSize,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: ['students'],
      onSuccess: () => {
        window.history.replaceState({}, '', route('students.index'))
      },
    })
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-full">
              <IconUser className="text-muted-foreground size-5" />
            </div>
            <div className="flex flex-col">
              <div className="font-medium">{row.original.name}</div>
              <div className="text-muted-foreground text-sm">{row.original.username}</div>
            </div>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <IconMail className="text-muted-foreground size-4" />
            <span>{row.original.email}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "submissions_count",
      header: "Submissions",
      cell: ({ row }) => {
        const count = row.original.submissions_count || 0
        return (
          <Badge variant="secondary" className="font-mono">
            {count}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.original.created_at ? format(new Date(row.original.created_at), "MMM d, yyyy") : "-"}</div>
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={route('students.show', row.original.id)}>
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: students.data,
    columns,
    pageCount: students.last_page,
    state: {
      pagination: {
        pageIndex: students.current_page - 1,
        pageSize: students.per_page,
      },
    },
    getRowId: (row) => row.id.toString(),
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex w-full flex-col justify-start gap-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-64">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9 pr-9 max-w-sm"
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
          </div>
        </div>
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
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
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
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {students.total} student{students.total !== 1 ? 's' : ''} total
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${students.per_page}`}
                onValueChange={(value) => {
                  handlePageSizeChange(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={students.per_page}
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
              Page {students.current_page} of{" "}
              {students.last_page}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(0)}
                disabled={students.current_page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => handlePageChange(students.current_page - 2)}
                disabled={students.current_page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => handlePageChange(students.current_page)}
                disabled={students.current_page === students.last_page}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => handlePageChange(students.last_page - 1)}
                disabled={students.current_page === students.last_page}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
