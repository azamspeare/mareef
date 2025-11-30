import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import EditWritingForm from '@/components/Writing/EditWritingForm';

interface Writing {
    id: number;
    title: string;
    content: any;
    allocated_time: string | null;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
}

interface EditProps {
    writing: Writing;
}

export default function Edit({ writing }: EditProps) {
    return (
        <DashboardLayout title="Edit Writing">
            <Head title={`Edit: ${writing.title} - Mareff`} />
            <EditWritingForm writing={writing} />
        </DashboardLayout>
    );
}
