import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IconPlus, IconClock, IconUsers, IconEdit, IconTrash, IconArchive, IconArchiveOff, IconSearch } from '@tabler/icons-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
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

    const WritingCard = ({ writing }: { writing: Writing }) => (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                            <Link
                                href={route('writings.show', writing.id)}
                                className="hover:text-primary transition-colors"
                            >
                                {writing.title}
                            </Link>
                        </CardTitle>
                        <CardDescription>
                            Created {new Date(writing.created_at).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {writing.deleted_at && (
                            <Badge variant="secondary">Archived</Badge>
                        )}
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
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className="prose prose-sm max-w-none line-clamp-3 dark:prose-invert text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: writing.content }}
                />
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <IconClock className="h-4 w-4" />
                    <span>{writing.allocated_time} min</span>
                </div>
                <div className="flex items-center gap-1">
                    <IconUsers className="h-4 w-4" />
                    <span>{writing.submissions_count || 0} submissions</span>
                </div>
            </CardFooter>
        </Card>
    );

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
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {writings.data.map((writing) => (
                                            <WritingCard key={writing.id} writing={writing} />
                                        ))}
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
