import CreateWritingForm from "@/components/Writing/CreateWritingForm";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function Create() {
    return (
        <DashboardLayout title="Create Writing">
            <Head title="Create Writing - Mareef" />
            <CreateWritingForm />
        </DashboardLayout>
    );
}
