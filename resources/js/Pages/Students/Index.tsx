import { Head } from '@inertiajs/react';
import { StudentsTable, Student } from "@/components/students-table"
import DashboardLayout from '@/Layouts/DashboardLayout';

interface PaginatedStudents {
  data: Student[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface StudentsProps {
  students: PaginatedStudents;
}

export default function Students({ students }: StudentsProps) {
  return (
    <DashboardLayout title="Students">
      <Head title="Students - Mareef" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage and view all students who have submitted to your writings.
            </p>
          </div>
          <StudentsTable students={students} />
        </div>
      </div>
    </DashboardLayout>
  )
}
