import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface Metrics {
  submissions: {
    last_week_submissions: number;
    this_week_submissions: number;
    ctr: number;
  };
  students: {
    total_students: number;
    new_students: number;
    ctr: number;
  };
  writings: {
    total_writings: number;
    submitted_writings: number;
    ctr: number;
  };
}

interface SectionCardsProps {
  metrics: Metrics;
}

export function SectionCards({ metrics }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {/* Card 1: Submissions */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Submissions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.submissions.this_week_submissions}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{metrics.submissions.ctr}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Last 7 days vs previous 7 days
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Students */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Students</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.students.total_students}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{metrics.students.ctr}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total active students
          </div>
          <div className="text-muted-foreground">
            {metrics.students.new_students} new students in last 7 days
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Writings */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Writings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.writings.total_writings}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{metrics.writings.ctr}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active writings in last 7 days
          </div>
          <div className="text-muted-foreground">
            {metrics.writings.submitted_writings} writings with submissions
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
