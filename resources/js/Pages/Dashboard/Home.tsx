
import { Head } from '@inertiajs/react';
import { DataTable, Counts, Submission } from "@/components/data-table.tsx"
import { SectionCards } from "@/components/section-cards.tsx"
import DashboardLayout from '@/Layouts/DashboardLayout';

import { Metrics } from "@/components/section-cards";

interface HomeProps {
  metrics: Metrics;
  counts: Counts;
  submissions: Submission[];
}

export default function Home({ metrics, counts, submissions }: HomeProps) {

  return (
    <DashboardLayout>
      <Head title="Home - Mareff" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards metrics={metrics} />
          <DataTable data={submissions} counts={counts} />
        </div>
      </div>
    </DashboardLayout>
  )
}
