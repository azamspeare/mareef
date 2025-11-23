import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Students() {
    return (
        <DashboardLayout>
            <Head title="Students" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                    <h1 className="text-2xl font-bold mb-4">Students</h1>
                    <p className="text-muted-foreground">This page will manage student lists and classes.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
