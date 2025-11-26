import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function CreateWriting() {
    return (
        <DashboardLayout>
            <Head title="Create Writing" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                    <h1 className="text-2xl font-bold mb-4">Create New Writing Task</h1>
                    <p className="text-muted-foreground">Form to create a new writing assignment will go here.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
