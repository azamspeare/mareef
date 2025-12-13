# Mareef – Dashboard Page Specification

This document defines the behaviour, layout, and data requirements for the **Dashboard** page in Mareef.
Any AI agent implementing or modifying the dashboard must follow this specification.

---

## 1. Purpose of the Dashboard

The dashboard is the **home screen for logged‑in users**, primarily teachers.

Goals:

- Give teachers an immediate sense of:
  - What requires their attention now
  - How active their students have been recently
  - How many students are engaged overall
- Provide a fast way to:
  - Open recent submissions
  - Filter by review status
  - Create new writings

The dashboard is **not** a full analytics page.
It is a **working surface** focused on current activity and next actions.

---

## 2. Layout Overview

High‑level layout:

1. **Global layout**: Uses the shared `AuthenticatedLayout`
   - Left sidebar:
     - Mareef logo/name
     - Navigation (Dashboard, My Writings, Students, Create Task, etc.)
   - Top bar:
     - Page title: `Dashboard`
     - Optional user avatar / settings icon

2. **Dashboard content area**:
   - Row of **three analytics cards** at the top
   - Below that, a **submissions table** with:
     - Left filter badges (status filter)
     - Right‑side controls (`Customize Columns`, `+ Add Writing`)
     - Paginated table of recent submissions

---

## 3. Analytics Cards

These three cards appear in a single row at the top of the dashboard.
They are **teacher‑centric metrics**, based only on data related to the logged‑in teacher.

### 3.1 Card 1 – "Submissions"

**Purpose:** show submission activity with week-over-week comparison.

- **Title:** `Submissions`
- **Main number:** `metrics.submissions.this_week_submissions`
  - Count of submissions in the last 7 days where writing belongs to current teacher
- **Comparison:** `metrics.submissions.ctr`
  - Change rate compared to previous 7 days (14-7 days ago)
  - Formula: `((this_week - last_week) / last_week) × 100`
  - Always non-negative (minimum 0)
  - Displayed as percentage: e.g., `+25%` or `0%`
- **Subtitle:** `Last 7 days vs previous 7 days`

**Data source:**
- `metrics.submissions.this_week_submissions` → submissions in last 7 days
- `metrics.submissions.last_week_submissions` → submissions in previous 7 days
- `metrics.submissions.ctr` → change rate percentage (rounded to 2 decimals)

**Behavior:**
- Optional: Clicking shows breakdown or applies time filter

---

### 3.2 Card 2 – "Students"

**Purpose:** show student engagement with new student tracking.

- **Title:** `Students`
- **Main number:** `metrics.students.total_students`
  - Count of unique students who have ever submitted to this teacher's writings
- **Comparison:** `metrics.students.ctr`
  - Percentage of students who submitted for first time in last 7 days
  - Formula: `(new_students / total_students) × 100`
  - Always non-negative (minimum 0)
- **Secondary info:** `metrics.students.new_students`
  - Count of students who made their first submission in last 7 days
- **Subtitle:** `Total active students`

**Data source:**
- `metrics.students.total_students` → all-time unique student count
- `metrics.students.new_students` → students who first submitted in last 7 days
- `metrics.students.ctr` → percentage of new students (rounded to 2 decimals)

**Behavior:**
- Optional: Clicking shows student list or filters for new students

---

### 3.3 Card 3 – "Writings"

**Purpose:** show writing activity and engagement rate.

- **Title:** `Writings`
- **Main number:** `metrics.writings.total_writings`
  - Count of all non-deleted writings created by current teacher
- **Comparison:** `metrics.writings.ctr`
  - Percentage of writings that received submissions in last 7 days
  - Formula: `(submitted_writings / total_writings) × 100`
  - Always non-negative (minimum 0)
- **Secondary info:** `metrics.writings.submitted_writings`
  - Count of writings that received at least one submission in last 7 days
- **Subtitle:** `Active writings in last 7 days`

**Data source:**
- `metrics.writings.total_writings` → all non-deleted writings by teacher
- `metrics.writings.submitted_writings` → writings with submissions in last 7 days
- `metrics.writings.ctr` → engagement rate percentage (rounded to 2 decimals)

**Behavior:**
- Optional: Clicking navigates to writings list

---

## 4. Submissions Table

Below the cards, there is a **single main table** listing **recent submissions**.

### 4.1 Purpose

- Give teacher a quick view of **what students have submitted**, ordered by time.
- Provide direct access to **open a submission for evaluation**.
- Allow filtering by review status (`All / Not Reviewed / Evaluated`).

### 4.2 Data Source

Rows come from `writing_submissions` joined with:

- `writings` (for writing title)
- `users` (for student name)
- optionally `writing_feedbacks` (for score, if needed)

Only submissions for writings where `writings.teacher_id = current_user.id` should be included.

---

### 4.3 Filters – Status Pills (Left Side)

At the **top left above the table**, show three pill‑style filters with counts:

- `ALL` – shows `counts.total`
- `NOT REVIEWED` – shows `counts.not_reviewed`
- `EVALUATED` – shows `counts.evaluated`

**Data source:** `counts` object from `SubmissionsRepository.getAllCounts()`

**Behavior:**

- `ALL` (status: `all`)
  - Show all submissions for this teacher.
  - Count: Total submissions across all statuses

- `NOT REVIEWED` (status: `not_reviewed`)
  - Only show submissions where `evaluted_at IS NULL`.
  - Count: Submissions awaiting teacher review

- `EVALUATED` (status: `evaluated`)
  - Only show submissions where `evaluted_at IS NOT NULL`.
  - Count: Submissions already reviewed

One filter is always active. Default on page load: `NOT REVIEWED` (shows "things to do").

Filter state is reflected via `status` query parameter handled by `SubmissionFilter`.

---

### 4.4 Controls – Right Side Buttons

On the **top right above the table**, two controls:

1. `Search` (input field)
   - Search submissions by student name or writing title
   - Searches using: `?search=query`
   - Real-time or on-enter search (implementation choice)
   - Placeholder: "Search by student or writing..."

2. `+ Add Writing`
   - Primary button
   - When clicked → redirect to `/writings/create` page
   - This reinforces the flow: from dashboard → add new task

**Note:** "Customize Columns" is not needed for MVP since all columns are standard and always visible.

---

### 4.5 Table Columns

The table displays submissions with the following columns (from left to right):

#### Visual Example:

```
┌─────────────────────┬──────────────┬────────────┬──────────────┬───────┬──────────────┬─────────┐
│ Writing             │ Student      │ Spent Time │ Evaluated At │ Score │ Submitted At │ Actions │
├─────────────────────┼──────────────┼────────────┼──────────────┼───────┼──────────────┼─────────┤
│ Essay on Democracy  │ John Doe     │ 25:30      │ Nov 24 10:00 │ 95    │ Nov 23 15:45 │    ⋮    │
│ Creative Writing    │ Jane Smith   │ 18:45      │      —       │   —   │ Nov 24 08:30 │    ⋮    │
│ Book Analysis       │ Mike Johnson │ 42:15      │ Nov 23 14:20 │ 88    │ Nov 22 20:10 │    ⋮    │
└─────────────────────┴──────────────┴────────────┴──────────────┴───────┴──────────────┴─────────┘
```

#### Column Specifications:

1. **Writing**
   - Title of the writing task
   - Source: `writing.title`
   - Display: Plain text, clickable to open submission

2. **Student**
   - Student's display name
   - Source: `student.name`
   - Display: Plain text

3. **Spent Time**
   - Time spent by student on the writing
   - Source: `writing_submissions.spent_time` (TIME format)
   - Display: Formatted as `mm:ss` or `hh:mm:ss`

4. **Evaluated At**
   - When the submission was evaluated
   - Source: `writing_submissions.evaluated_at`
   - Display: Human-friendly format (e.g., `Nov 24, 22:15`) or `—` if NULL

5. **Score**
   - Teacher's score for the submission
   - Source: `feedback.score` (if exists)
   - Display: Numeric score or `—` if not evaluated

6. **Submitted At**
   - When the submission was made
   - Source: `writing_submissions.submitted_at`
   - Display: Human-friendly format (e.g., `Nov 24, 22:15` or "2 hours ago")

7. **Actions**
   - Three-dot menu icon (`⋮`)
   - Opens dropdown with options:
     - `Open` → navigate to `/submissions/{id}`
     - `View Student` → navigate to student profile
     - `Delete` → delete submission (with confirmation)

**Important notes:**
- **No drag-and-drop** functionality needed
- **No checkbox selection** column
- All columns are visible by default
- Table should be clean and focused on viewing/accessing submissions

---

### 4.6 Sorting & Pagination

**Sorting:**
- Default sort: `submitted_at` **descending** (newest first)
- Sortable columns:
  - `id` - Submission ID
  - `submitted_at` - When submitted
  - `spent_time` - Time spent on writing
  - `created_at` - Record creation time
  - `evaluated_at` - When evaluated
- Sort direction: `asc` or `desc`
- Implemented via query parameters: `?sort_by=submitted_at&sort_direction=desc`

**Pagination:**
- Default: 10 rows per page
- Configurable range: 5–100 rows per page
- Query parameter: `?per_page=10`
- Display standard Laravel pagination controls:
  - Page numbers
  - Previous/Next buttons
  - First/Last page buttons
  - Current page indicator: "Page X of Y"
  - Row count: "Showing X-Y of Z results"

---

### 4.7 Row Behavior

**Interaction:**
- Rows are **not clickable** by default
- Actions are accessed via the three-dot menu in the Actions column
- Hover state: subtle background highlight for better UX

**After Evaluation:**
When a teacher evaluates a submission and provides feedback:
- `writing_submissions.evaluated_at` is set to current timestamp
- On returning to the dashboard:
  - The submission moves from "Not Reviewed" to "Evaluated" status
  - If `NOT REVIEWED` filter is active, the row disappears from view
  - The `counts` object updates to reflect the change
  - Score appears in the Score column

---

## 5. Empty & Edge States

### 5.1 No Submissions Yet

If there are **no submissions** for the current teacher:

- Show an empty state instead of the table:

  - Title: `No submissions yet`
  - Subtitle: `Create a writing task and share the link with your students to see submissions here.`
  - Button: `Create your first writing` (same as `+ Add Writing`)

Cards may still show zeros.

### 5.2 No Not‑Reviewed Submissions

If filter = `NOT REVIEWED` and no rows:

- Show an empty state inside the table:

  - Title: `You’re all caught up`
  - Subtitle: `There are no submissions waiting for review.`
  - Optional link: `View all submissions` (switches to `ALL` filter)

---

## 6. Data Dependencies Summary

To render the dashboard, backend must provide:

### 6.1 **metrics** object

Contains three sub-objects with weekly analytics:

**metrics.submissions:**
```typescript
{
  last_week_submissions: number,      // Count 14-7 days ago
  this_week_submissions: number,      // Count last 7 days
  ctr: number                         // Change rate % (min: 0)
}
```

**metrics.students:**
```typescript
{
  total_students: number,             // All-time unique students
  new_students: number,               // New in last 7 days
  ctr: number                         // New/total % (min: 0)
}
```

**metrics.writings:**
```typescript
{
  total_writings: number,             // All non-deleted writings
  submitted_writings: number,         // With submissions in last 7 days
  ctr: number                         // Active/total % (min: 0)
}
```

### 6.2 **counts** object

Submission counts for status badges:

```typescript
{
  total: number,                      // All submissions
  not_reviewed: number,               // evaluated_at IS NULL
  evaluated: number                   // evaluated_at IS NOT NULL
}
```

### 6.3 **submissions** (paginated list)

Filtered and paginated list from `SubmissionFindForListQuery`:

```typescript
{
  data: [
    {
      id: number,
      writing_id: number,
      student_id: number,
      spent_time: string,             // TIME format
      submitted_at: datetime,
      evaluated_at: datetime | null,
      created_at: datetime,

      // Relations (eager loaded)
      writing: {
        id: number,
        title: string,
        allocated_time: string | null
      },
      student: {
        id: number,
        name: string
      },
      feedback: {
        id: number,
        submission_id: number,
        score: number
      } | null
    }
  ],
  current_page: number,
  per_page: number,
  total: number,
  last_page: number
}
```

### 6.4 **Filter parameters** (from SubmissionFilter)

Supports query parameters:
- `search` (string) – searches in student name and writing title
- `sort_by` (enum) – `id`, `submitted_at`, `spent_time`, `created_at`, `evaluated_at`
- `sort_direction` (enum) – `asc`, `desc`
- `per_page` (int) – range: 5-100, default: 10
- `status` (enum) – `all`, `not_reviewed`, `evaluated`

This data is passed via Inertia to `Dashboard/Home` component.

---

## 7. Implementation Summary

### 7.1 Backend Implementation

**Controller:** `App\Http\Controllers\Dashboard\DashboardController`

**Dependencies:**
- `MetricsRepository` – provides weekly metrics with CTR calculations
- `SubmissionsRepository` – provides submission counts by status
- `SubmissionFindForListQuery` – provides filtered, paginated submission list
- `SubmissionFilter` – validates and sanitizes query parameters

**Key Principles:**
1. All queries are **optimized for performance** (single queries, proper JOINs)
2. All data is **teacher-scoped** (only their writings and submissions)
3. CTR values are **always non-negative** (min: 0)
4. Soft deletes are **respected** throughout
5. Type safety is **enforced** (strict types, validation)

### 7.2 Frontend Implementation

When implementing the dashboard UI:

- Display **three analytics cards** at the top:
  1. Submissions (with week-over-week CTR)
  2. Students (with new student percentage)
  3. Writings (with engagement rate)
- Show **status badges** with counts from `counts` object
- Implement **status filters**: `ALL`, `NOT REVIEWED`, `EVALUATED`
- Display **submissions table** with:
  - Search (student name / writing title)
  - Sorting (by multiple columns)
  - Pagination (5-100 per page)
- Add **action buttons**:
  - `Customize Columns` (toggle visibility)
  - `+ Add Writing` (links to create page)

### 7.3 Data Flow

```
Request → SubmissionFilter → MetricsRepository → DB queries
                           → SubmissionsRepository → DB queries
                           → SubmissionFindForListQuery → DB query
                           → DashboardController → Inertia response
```

### 7.4 Key Points for AI Agents

- Keep focus on **teacher clarity and actionability**
- All metrics use **7-day windows** for consistency
- CTR formulas are **clearly documented** in code
- Table must show **recent submissions** (default: `submitted_at DESC`)
- Everything is **scoped to logged-in teacher**
- Search is **case-insensitive** and searches across relations
- Filters are **validated and sanitized** before queries

This page is the main control center for teachers using Mareef.
It should feel calm, informative, and directly useful the moment they log in.
