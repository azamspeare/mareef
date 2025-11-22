# Mareff – Frontend Specification (MVP)

This document describes the **frontend architecture and conventions** for Mareff’s MVP.

The frontend is built with:

- **Framework:** React (via Inertia.js + Laravel)
- **Styling:** Tailwind CSS
- **UI library:** shadcn/ui
- **Build tool:** Vite (default with Laravel 12)
- **Interaction with backend:** Inertia.js (no REST/JSON API layer in MVP)

The goal is to make the frontend:

- predictable and easy to extend,
- clean for AI agents to work on,
- minimal but solid for real teachers and students.

---

## 1. High-Level Frontend Design

### 1.1 SPA-like via Inertia

Mareff uses **Inertia.js** to bridge Laravel and React:

- Laravel defines routes and returns **Inertia responses**.
- Each route corresponds to a **React page component**.
- Navigation feels like a SPA, but SSR and routing are still controlled by Laravel.

**Key idea:** There is **no client-side router** like React Router in MVP.
Routing is handled by Laravel; React pages map to server routes.

---

## 2. Project Structure

Expected structure under `resources/js` (or similar):

```txt
resources/js/
  ├─ Pages/
  │   ├─ Auth/
  │   │   └─ Login.jsx
  │   ├─ Dashboard/
  │   │   └─ Index.jsx
  │   ├─ Writings/
  │   │   ├─ Index.jsx
  │   │   ├─ Create.jsx
  │   │   ├─ Edit.jsx
  │   │   ├─ Show.jsx
  │   │   └─ SubmissionsIndex.jsx
  │   ├─ Submissions/
  │   │   └─ Show.jsx
  │   ├─ PublicWriting/
  │   │   └─ Show.jsx
  │   └─ Admin/
  │       └─ UsersIndex.jsx (optional MVP)
  │
  ├─ Components/
  │   ├─ layouts/
  │   │   ├─ AuthenticatedLayout.jsx
  │   │   └─ GuestLayout.jsx
  │   ├─ ui/        (shadcn wrappers / re-exports)
  │   ├─ navigation/
  │   │   ├─ Sidebar.jsx
  │   │   └─ Topbar.jsx
  │   ├─ writings/
  │   │   ├─ WritingEditor.jsx
  │   │   ├─ WritingCard.jsx
  │   │   ├─ WritingStatusBadge.jsx
  │   │   └─ ShareLinkBox.jsx
  │   ├─ submissions/
  │   │   ├─ SubmissionRow.jsx
  │   │   ├─ SubmissionViewer.jsx
  │   │   └─ FeedbackPanel.jsx
  │   └─ common/
  │       ├─ PageHeader.jsx
  │       ├─ EmptyState.jsx
  │       ├─ LoadingState.jsx
  │       └─ ErrorAlert.jsx
  │
  ├─ hooks/
  │   └─ useRole.js (helper to check user role)
  │
  ├─ lib/
  │   ├─ inertiaHelpers.js
  │   ├─ editorConfig.js
  │   └─ formatters.js
  │
  └─ app.jsx (Inertia setup, layouts, etc.)
```

Paths and filenames can be adjusted, but the **conceptual structure** should remain.

---

## 3. Styling & UI

### 3.1 Tailwind CSS

Tailwind is the primary styling engine:

- Utility classes for layout, spacing, typography.
- Use **consistent spacing and typography scale** across pages.
- Prefer reusable components over massive class strings repeated everywhere.

Example patterns:

- Layout containers: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- Section spacing: `py-6` / `pb-8`
- Cards: `rounded-xl border bg-background shadow-sm p-4 sm:p-6`

### 3.2 shadcn/ui Usage

shadcn/ui provides headless + styled components. Use it for:

- Buttons (`<Button />`)
- Inputs (`<Input />`, `<Textarea />`)
- Selects, Combobox
- Dialogs/Modals
- Tabs, Badges
- Table / Data Table patterns
- Alerts, Toasts

**Conventions:**

- Wrap shadcn components in `Components/ui` if we need custom variants.
- Use `variant` prop (e.g., `variant="outline"`, `variant="destructive"`) for semantic styling.
- Use consistent button types:
  - Primary actions → `variant="default"`
  - Secondary → `variant="outline"`
  - Destructive → `variant="destructive"`

---

## 4. Layouts & Navigation

### 4.1 AuthenticatedLayout

Used by any page that requires login (teacher, student, admin).

Contains:

- **Topbar**
  - App name / logo
  - User avatar + name
  - Dropdown with “Profile” (future) and “Logout”
- **Sidebar**
  - Navigation items depending on role:
    - All roles:
      - Dashboard
    - Teachers:
      - Writings
    - Admin:
      - Admin → Users (and future admin pages)
- **Main content**
  - Scrollable area for the current page
  - Uses `<main className="flex-1 ...">` pattern

### 4.2 GuestLayout

Used for unauthenticated pages (e.g. landing, login prompt for public writing page).

- Centered container
- Simple branding + “Login with Google” button

---

## 5. Pages (Detailed)

### 5.1 Dashboard Page

**Path:** `/dashboard`
**Component:** `Pages/Dashboard/Index.jsx`

**Purpose:**
- Provide teachers/students/admin a quick overview.
- MVP layout:

For **teachers**:
- “Recent submissions to your writings”
  - Table:
    - Student name
    - Writing title
    - Status (submitted / evaluated)
    - Submitted_at
    - Action: View

For **students**:
- “Recent submissions you’ve made”
  - Table:
    - Writing title
    - Status
    - Score (if evaluated)
    - Action: Open writing

For **admin**:
- Same as teacher + a simple metrics block (future).

### 5.2 Writings – Index

**Path:** `/writings`
**Component:** `Pages/Writings/Index.jsx`
**Role:** Teacher / Admin only

**Features:**
- List all writings created by the logged-in teacher.
- Table columns:
  - Title
  - Created_at (formatted)
  - Status (with badge)
  - Submissions count
  - Actions:
    - View
    - Edit
    - Archive/Restore
    - Delete (optional in UI for MVP)

- Primary button: “Create Writing Task”

### 5.3 Writings – Create

**Path:** `/writings/create`
**Component:** `Pages/Writings/Create.jsx`

**Form fields:**
- Title (input)
- Instructions (WritingEditor)
- Max score (optional, number input)

**Behavior:**
- Use Inertia `useForm` to handle form state.
- On submit:
  - POST to `/writings`
  - Show validation errors under fields
  - On success, redirect to Writings/Show with success toast.

### 5.4 Writings – Edit

**Path:** `/writings/{id}/edit`
**Component:** `Pages/Writings/Edit.jsx`

Same UI as Create, but prefilled with existing data.

### 5.5 Writings – Show

**Path:** `/writings/{id}`
**Component:** `Pages/Writings/Show.jsx`

Displays:

- Title
- Instructions (rendered view)
- Status
- Submissions count
- **Share link box**:
  - Readonly input with URL: `https://app.mareff.com/w/{slug}`
  - “Copy link” button
- Button: “View submissions”

### 5.6 Writings – Submissions List

**Path:** `/writings/{id}/submissions`
**Component:** `Pages/Writings/SubmissionsIndex.jsx`

Features:

- Filter dropdown:
  - Default: `Not evaluated`
  - Option: `All`
- Submissions table:
  - Student name
  - Submitted_at (formatted)
  - Status
  - Action: “Open”

### 5.7 Submission – Show (Teacher Marking View)

**Path:** `/submissions/{id}`
**Component:** `Pages/Submissions/Show.jsx`

Layout:

- Left column: `SubmissionViewer`
  - Shows student’s writing content
  - Read-only
- Right column: `FeedbackPanel`
  - Score input
  - Overall comment textarea
  - (Optional) inline feedback controls / list
  - Button: “Send feedback”

On submit:

- POST to `/submissions/{id}/feedback` with:
  - score
  - overall_comment
  - inline_feedback (JSON, if used)
- On success:
  - Show toast “Feedback sent”
  - Possibly redirect back to submissions list
  - Submissions list shows updated status (`evaluated`)

---

## 6. Public Writing Page (Student View)

### 6.1 PublicWriting – Show

**Path (server):** `/w/{slug}`
**Component:** `Pages/PublicWriting/Show.jsx`

**Behavior:**

- If user is **not authenticated**:
  - Show GuestLayout.
  - Display writing title + instructions (read-only).
  - Big CTA: “Login with Google to start writing”.
  - After login, redirect back to the same slug.

- If user is **authenticated as student**:
  - Check if student has already submitted this writing.
  - If not:
    - Show WritingEditor for student answer.
    - Button: “Submit”.
  - If yes and status = `submitted` but not evaluated:
    - Show message: “You’ve already submitted this writing. Await feedback from your teacher.”
    - Show their own submitted content read-only.
  - If status = `evaluated` with feedback:
    - Show banner: “Your task has been evaluated.”
    - Show:
      - Their own writing
      - Score
      - Overall feedback
      - Inline feedback (if implemented)

---

## 7. State Management & Inertia Patterns

### 7.1 Inertia `usePage` & `useForm`

- Use `usePage()` to access:
  - Authenticated user (`page.props.auth.user`)
  - Shared props (e.g., flash messages)

- Use `useForm()` for form handling:
  - Example:

    ```js
    const { data, setData, post, processing, errors } = useForm({
      title: '',
      instructions: '',
      max_score: '',
    });

    const submit = (e) => {
      e.preventDefault();
      post(route('writings.store'));
    };
    ```

### 7.2 Global Flash Messages

- Backend sets flash via `session()->flash('success', '...')`.
- Inertia shares `flash` props globally (via Inertia middleware).
- Frontend listens to `flash.success`, `flash.error` and displays:
  - Toast or `<Alert />`.

### 7.3 Role Helpers

`hooks/useRole.js`:

```js
import { usePage } from '@inertiajs/react';

export function useRole() {
  const { props } = usePage();
  const role = props.auth?.user?.role;
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';
  const isAdmin = role === 'admin';

  return { role, isTeacher, isStudent, isAdmin };
}
```

Use this hook in layouts and pages for role-based UI rendering.

---

## 8. Editor Implementation

### 8.1 MVP Strategy

For MVP v0:

- Use a **single editor component** `WritingEditor` that can be configured for:
  - Teacher instructions -> `mode="instructions"`
  - Student writing -> `mode="submission"`

- Start with:
  - Either a `<textarea>` with autosize
  - Or a minimal WYSIWYG with:
    - Bold, italic, underline
    - Lists
    - Paragraphs

### 8.2 Data Format

- Keep it simple:
  - Store editor content as **HTML** or **plain text** in MVP.
- For richer structures later (inline comments etc.), we can move to JSON with structure.

### 8.3 Inline Feedback (Future Consideration)

- MVP can:
  - Skip fully dynamic inline selections.
  - Instead allow teachers to add **comment blocks** referencing a line/paragraph.

- Later we can:
  - Implement true text-range comments.
  - Use IDs/offsets stored in `inline_feedback` JSON.

---

## 9. Error & Loading States

### 9.1 Loading

- On Inertia navigation, use:
  - A top progress bar (e.g., NProgress) or a minimal loading spinner.
- For long operations (e.g., submitting forms):
  - Disable button (`disabled={processing}`)
  - Change label to “Saving…” or “Submitting…”

### 9.2 Error Handling

- Validation errors:
  - Display under each input using `errors.fieldName`.
- Global errors:
  - Show an `<ErrorAlert>` at the top when `flash.error` exists.

---

## 10. Accessibility & UX Notes

- Ensure all interactive elements are keyboard accessible.
- Use ARIA labels where needed (modals, dialogs).
- Don’t rely **only** on color to convey status:
  - Use text + color (e.g., “Evaluated” label).
- Make share link and important actions easy to find visually.

---

## 11. Frontend Testing (Future)

MVP may not include heavy automated tests, but patterns to consider later:

- Unit tests for components (Jest + React Testing Library).
- Cypress or Playwright for end-to-end flows:
  - Teacher creates a writing
  - Student submits
  - Teacher evaluates
  - Student views feedback

---

## 12. Summary

The Mareff frontend is:

- **React + Inertia-based**, no separate SPA router.
- Structured around **pages + layouts + reusable components**.
- Styled with **Tailwind + shadcn/ui** for clean, modern UI.
- Designed for **fast iteration** and clarity so engineers and AI agents can easily extend it.

The most critical parts for UX are:

- Smooth teacher flow:
  - Create → share link → view submissions → evaluate
- Clear student flow:
  - Open link → login → write → submit → come back → view feedback

Everything else in the frontend should support and simplify these two flows.
