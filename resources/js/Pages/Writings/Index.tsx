import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { IconPlus, IconEdit, IconTrash, IconArchive, IconArchiveOff, IconSearch, IconDotsVertical } from '@tabler/icons-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';

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
        if (confirm('Are you sure you want to archive this writing?')) {
            router.patch(route('writings.archive', id), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleRestore = (id: number) => {
        router.patch(route('writings.restore', id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this writing? This action cannot be undone.')) {
            router.delete(route('writings.delete', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <DashboardLayout>
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
                                        className="pl-9"
                                    />
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
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Created At</TableHead>
                                                    <TableHead>Time Limit</TableHead>
                                                    <TableHead>Submissions</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {writings.data.map((writing) => (
                                                    <TableRow key={writing.id}>
                                                        <TableCell className="font-medium">
                                                            <Link
                                                                href={route('writings.show', writing.id)}
                                                                className="hover:text-primary transition-colors"
                                                            >
                                                                {writing.title}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(writing.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            {writing.allocated_time} min
                                                        </TableCell>
                                                        <TableCell>
                                                            {writing.submissions_count || 0}
                                                        </TableCell>
                                                        <TableCell>
                                                            {writing.deleted_at ? (
                                                                <Badge variant="secondary">Archived</Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                        <IconDotsVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={route('writings.edit', writing.id)}>
                                                                            <IconEdit className="h-4 w-4 mr-2" />
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    {writing.deleted_at ? (
                                                                        <DropdownMenuItem onClick={() => handleRestore(writing.id)}>
                                                                            <IconArchiveOff className="h-4 w-4 mr-2" />
                                                                            Restore
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem onClick={() => handleArchive(writing.id)}>
                                                                            <IconArchive className="h-4 w-4 mr-2" />
                                                                            Archive
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDelete(writing.id)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <IconTrash className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
