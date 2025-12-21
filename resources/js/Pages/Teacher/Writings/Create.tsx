import CreateWritingForm from "@/forms/teacher/writing/create-writing-form.tsx";
import DashboardLayout from "@/Layouts/DashboardLayout.tsx";
import { Head } from "@inertiajs/react";

export default function Create() {
    return (
        <DashboardLayout title="Create Writing">
            <Head title="Create Writing - Mareef" />
            <CreateWritingForm />
        </DashboardLayout>
    );
}
