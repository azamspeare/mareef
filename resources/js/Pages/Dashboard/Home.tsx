import { Head } from '@inertiajs/react';
import { DataTable } from "@/components/data-table.tsx"
import { SectionCards } from "@/components/section-cards.tsx"
import DashboardLayout from '@/Layouts/DashboardLayout';

import data from "../data.json"

export default function Home() {
  return (
    <DashboardLayout>
      <Head title="Home - Mareff" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <DataTable data={data} />
        </div>
      </div>
    </DashboardLayout>
  )
}
