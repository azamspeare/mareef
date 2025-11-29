import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Archive, ArchiveRestore, Trash2, Clock } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { PartialBlock } from '@blocknote/core';

interface Writing {
    id: number;
    title: string;
    content: string;
    allocated_time: string;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    submissions_count?: number;
}

interface ShowProps {
    writing: Writing;
}

export default function Show({ writing }: ShowProps) {
    const handleArchive = () => {
        if (confirm('Are you sure you want to archive this writing?')) {
            router.patch(route('writings.archive', writing.id));
        }
    };

    const handleRestore = () => {
        router.patch(route('writings.restore', writing.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this writing? This action cannot be undone.')) {
            router.delete(route('writings.delete', writing.id));
        }
    };

    return (
        <DashboardLayout title="Writing Details">
            <Head title={`${writing.title} - Mareff`} />
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href={route('writings.index')}>
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        {writing.title}
                                    </h1>
                                    {writing.archived_at && (
                                        <Badge variant="secondary">Archived</Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground mt-1">
                                    Created {new Date(writing.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Link href={route('writings.edit', writing.id)}>
                                <Button>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <IconDotsVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {writing.archived_at ? (
                                        <DropdownMenuItem onClick={handleRestore}>
                                            <ArchiveRestore className="h-4 w-4 mr-2" />
                                            Restore
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={handleArchive}>
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archive
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4 mb-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Allocated Time
                                    </CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{writing.allocated_time}</div>
                                    <p className="text-xs text-muted-foreground">minutes</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Submissions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{writing.submissions_count || 0}</div>
                                    <p className="text-xs text-muted-foreground">total submissions</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* <BlockNoteView editor={useCreateBlockNote({
                                    initialContent: writing.content as unknown as PartialBlock[],
                                })} /> */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
