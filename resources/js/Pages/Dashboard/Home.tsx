
import { Head } from '@inertiajs/react';
import { DataTable, Counts, Submission } from "@/components/data-table.tsx"
import { SectionCards } from "@/components/section-cards.tsx"
import DashboardLayout from '@/Layouts/DashboardLayout';

import { Metrics } from "@/components/section-cards";

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

interface HomeProps {
  metrics: Metrics;
  counts: Counts;
  submissions: PaginatedData<Submission>;
}

export default function Home({ metrics, counts, submissions }: HomeProps) {
  return (
    <DashboardLayout title="Dashboard">
      <Head title="Dashboard - Mareff" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards metrics={metrics} />
          <DataTable
            data={submissions.data}
            counts={counts}
            pagination={{
              current_page: submissions.current_page,
              last_page: submissions.last_page,
              per_page: submissions.per_page,
              total: submissions.total,
              from: submissions.from,
              to: submissions.to,
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
