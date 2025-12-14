# Mareef - Frontend Specification

Frontend architecture and conventions for Mareef.

---

## 1. Technology Stack

- **Framework:** React 18 + TypeScript
- **Routing:** Inertia.js (server-driven)
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI + shadcn/ui
- **Editor:** BlockNote
- **Charts:** Recharts
- **Build:** Vite 7

---

## 2. Project Structure

```
resources/js/
├── Pages/                    # Page components (route-mapped)
│   ├── Auth/
│   │   └── Login.tsx
│   ├── Dashboard/
│   │   └── Home.tsx
│   ├── Landing/
│   │   ├── Welcome.tsx
│   │   ├── Pricing.tsx
│   │   ├── Listening.tsx
│   │   ├── Reading.tsx
│   │   ├── Writing.tsx
│   │   └── Speaking.tsx
│   ├── Students/
│   │   ├── Index.tsx
│   │   └── Show.tsx
│   ├── Submissions/
│   │   ├── Index.tsx
│   │   └── Show.tsx
│   ├── Writings/
│   │   ├── Index.tsx
│   │   ├── Create.tsx
│   │   ├── Edit.tsx
│   │   └── Show.tsx
│   └── WritingTask.tsx       # Student writing interface
│
├── Layouts/
│   └── DashboardLayout.tsx   # Teacher portal layout
│
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── annotation/           # Text annotation system
│   │   ├── annotated-content.tsx
│   │   └── highlight-popover.tsx
│   ├── app-sidebar.tsx
│   ├── data-table.tsx
│   ├── empty.tsx
│   ├── metrics-card.tsx
│   └── ...
│
├── hooks/
│   ├── use-auto-save.ts      # Auto-save with dirty tracking
│   └── use-timer.ts          # Countdown timer for writing tasks
│
├── lib/
│   └── utils.ts              # Utility functions (cn, formatters)
│
├── types/
│   └── index.d.ts            # TypeScript type definitions
│
├── app.tsx                   # Inertia app setup
└── bootstrap.js              # Axios configuration
```

---

## 3. Inertia.js Integration

### 3.1 App Setup

**Location:** `resources/js/app.tsx`

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

### 3.2 Shared Props

Available on all pages via `usePage()`:

```tsx
interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar: string | null;
            role: 'teacher' | 'student';
        } | null;
    };
    flash: {
        success?: string;
        error?: string;
        message?: string;
    };
    ziggy: {
        url: string;
        port: number | null;
        defaults: Record<string, any>;
        routes: Record<string, any>;
        location: string;
    };
}
```

### 3.3 Navigation

```tsx
import { Link, router } from '@inertiajs/react';

// Link navigation
<Link href={route('dashboard')}>Dashboard</Link>

// Programmatic navigation
router.visit(route('writings.show', { id: 1 }));

// Form submission
router.post(route('writings.store'), data, {
    onSuccess: () => toast.success('Writing created'),
});
```

---

## 4. Layouts

### 4.1 DashboardLayout

**Location:** `resources/js/Layouts/DashboardLayout.tsx`

Used for all authenticated teacher pages.

```tsx
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header>{/* Breadcrumb, user menu */}</header>
                <main>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
```

**Features:**
- Collapsible sidebar with navigation
- Breadcrumb navigation
- User dropdown menu
- Toast notifications

---

## 5. Pages

### 5.1 Dashboard/Home

**Route:** `/dashboard`

Teacher dashboard with metrics and recent submissions.

```tsx
interface HomeProps {
    metrics: {
        submissions: { this_week_submissions: number; ctr: number };
        students: { total_students: number; new_students: number };
        writings: { total_writings: number; submitted_writings: number };
    };
    counts: {
        total: number;
        not_reviewed: number;
        evaluated: number;
    };
    submissions: PaginatedData<Submission>;
}
```

**Components:**
- `MetricsCard` - Displays metric with trend indicator
- `DataTable` - Submissions list with tabs
- `SubmissionsChart` - Weekly submissions chart

### 5.2 Writings/Index

**Route:** `/writings`

List of teacher's writing tasks.

```tsx
interface WritingsIndexProps {
    writings: PaginatedData<Writing>;
}
```

**Features:**
- Data table with sorting/filtering
- Search by title
- Quick actions (edit, delete, view submissions)
- Create new writing button

### 5.3 Writings/Create & Edit

**Route:** `/writings/create`, `/writings/{id}/edit`

Writing task editor with BlockNote.

```tsx
interface WritingFormProps {
    writing?: Writing; // Undefined for create, defined for edit
}
```

**Form Fields:**
- Title (input)
- Content (BlockNote editor)
- Allocated time (time picker)
- Publish date (date picker, optional)

### 5.4 Submissions/Show

**Route:** `/submissions/{id}`

Teacher view for evaluating a submission.

```tsx
interface SubmissionShowProps {
    submission: Submission & {
        writing: Writing;
        student: User;
        feedback?: Feedback;
    };
}
```

**Layout:**
- Left: Student's writing with annotation support
- Right: Evaluation form (score, feedback)

### 5.5 WritingTask

**Route:** `student.{domain}/tasks/{handle}/writing/{slug}`

Student interface for completing a writing task.

```tsx
interface WritingTaskProps {
    writing: Writing;
    submission?: Submission;
    teacher: { username: string };
}
```

**Features:**
- Timer countdown
- Auto-save with dirty tracking
- Word count
- Submit confirmation dialog

---

## 6. Components

### 6.1 UI Components (shadcn/ui)

Pre-styled components from shadcn/ui:

| Component | Usage |
|-----------|-------|
| `Button` | Actions, form submission |
| `Card` | Content containers |
| `Dialog` | Modal dialogs |
| `Input` | Text inputs |
| `Select` | Dropdowns |
| `Table` | Data tables |
| `Tabs` | Tab navigation |
| `Badge` | Status indicators |
| `Tooltip` | Help text |
| `Sheet` | Side panels |
| `Accordion` | Collapsible content |

### 6.2 Custom Components

**MetricsCard**
```tsx
interface MetricsCardProps {
    title: string;
    value: number;
    change?: number;
    icon: React.ReactNode;
}
```

**DataTable**
```tsx
interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    searchKey?: string;
    pagination?: PaginationInfo;
}
```

**Empty**
```tsx
interface EmptyProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}
```

### 6.3 Annotation Components

**AnnotatedContent**
```tsx
interface AnnotatedContentProps {
    content: BlockNoteDocument;
    annotations: Annotation[];
    onAnnotationClick?: (annotation: Annotation) => void;
}
```

**HighlightPopover**
```tsx
interface HighlightPopoverProps {
    selectedText: string;
    position: { x: number; y: number };
    onAddAnnotation: (note: string) => void;
}
```

---

## 7. Hooks

### 7.1 useAutoSave

**Location:** `resources/js/hooks/use-auto-save.ts`

Auto-saves content at intervals with dirty tracking.

```tsx
interface UseAutoSaveOptions {
    isActive: boolean;
    interval?: number;        // Default: 60000ms (1 min)
    routeName: string;
    getPayload: () => Record<string, any>;
    debounceMs?: number;      // Default: 2000ms
}

interface UseAutoSaveReturn {
    isSaving: boolean;
    saveNow: () => void;
    markDirty: () => void;
}

// Usage
const { isSaving, saveNow, markDirty } = useAutoSave({
    isActive: isInProgress,
    routeName: 'tasks.submissions.save',
    getPayload: () => ({
        writing_id: writing.id,
        content: JSON.stringify(editor.document),
    }),
});

// Mark dirty on content change
const handleEditorChange = () => {
    markDirty();
};
```

**Features:**
- Only saves when content has changed
- Debounces rapid save requests
- Prevents duplicate saves in flight
- Compares content to skip unchanged saves

### 7.2 useTimer

**Location:** `resources/js/hooks/use-timer.ts`

Countdown timer for timed writing tasks.

```tsx
interface UseTimerOptions {
    allocatedTime: string;      // "HH:MM:SS" format
    spentTime?: string;
    onTimeUp?: () => void;
    isActive: boolean;
}

interface UseTimerReturn {
    timeLeft: number;           // Seconds remaining
    spentTime: string;          // "HH:MM:SS" format
    formattedTimeLeft: string;  // "MM:SS" display format
    isExpired: boolean;
}

// Usage
const { timeLeft, spentTime, formattedTimeLeft, isExpired } = useTimer({
    allocatedTime: writing.allocated_time,
    spentTime: submission?.spent_time,
    onTimeUp: handleAutoSubmit,
    isActive: isInProgress,
});
```

---

## 8. BlockNote Editor

### 8.1 Configuration

```tsx
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';

const editor = useCreateBlockNote({
    initialContent: writing.content,
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axios.post(route('images.store'), formData);
        return response.data.url;
    },
});
```

### 8.2 Read-Only Mode

For viewing submissions:

```tsx
<BlockNoteView
    editor={editor}
    editable={false}
    theme="light"
/>
```

### 8.3 Content Structure

BlockNote stores content as JSON:

```json
[
    {
        "id": "1",
        "type": "paragraph",
        "props": {},
        "content": [{ "type": "text", "text": "Hello world" }],
        "children": []
    },
    {
        "id": "2",
        "type": "image",
        "props": { "url": "/images/abc123.jpg" },
        "children": []
    }
]
```

---

## 9. Forms

### 9.1 Inertia Form Hook

```tsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    content: [],
    allocated_time: null,
});

const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('writings.store'), {
        onSuccess: () => {
            reset();
            toast.success('Writing created');
        },
    });
};
```

### 9.2 Validation Errors

```tsx
<Input
    value={data.title}
    onChange={(e) => setData('title', e.target.value)}
    className={errors.title ? 'border-red-500' : ''}
/>
{errors.title && (
    <p className="text-sm text-red-500">{errors.title}</p>
)}
```

---

## 10. State Management

### 10.1 Server State

All data comes from server via Inertia props:

```tsx
import { usePage } from '@inertiajs/react';

const { auth, flash } = usePage<PageProps>().props;
```

### 10.2 Local State

Use React state for UI-only concerns:

```tsx
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('all');
```

### 10.3 Form State

Use Inertia's `useForm` for form handling:

```tsx
const { data, setData, post, processing } = useForm(initialData);
```

---

## 11. Styling Conventions

### 11.1 Tailwind Classes

```tsx
// Layout containers
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Cards
<div className="rounded-xl border bg-card p-6 shadow-sm">

// Spacing
<div className="space-y-4">  // Vertical spacing
<div className="gap-4">      // Grid/flex gap

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 11.2 Component Variants

Using `class-variance-authority`:

```tsx
const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md font-medium',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground',
                outline: 'border border-input bg-background',
                destructive: 'bg-destructive text-destructive-foreground',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 px-3',
                lg: 'h-11 px-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
```

---

## 12. Build Configuration

### 12.1 Vite Config

**Location:** `vite.config.js`

```js
export default defineConfig({
    plugins: [laravel(), react(), tailwindcss()],
    build: {
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-blocknote': ['@blocknote/core', '@blocknote/react'],
                    'vendor-radix': ['@radix-ui/react-*'],
                    'vendor-charts': ['recharts'],
                    'vendor-inertia': ['@inertiajs/react'],
                },
            },
        },
    },
});
```

### 12.2 Code Splitting

Heavy dependencies are split into separate chunks:

| Chunk | Size (gzip) | Loaded On |
|-------|-------------|-----------|
| vendor-react | ~45 KB | All pages |
| vendor-blocknote | ~412 KB | Writing pages |
| vendor-radix | ~27 KB | All pages |
| vendor-charts | ~15 KB | Dashboard |

---

## 13. Type Definitions

### 13.1 Core Types

```tsx
interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    avatar: string | null;
    role: 'teacher' | 'student';
}

interface Writing {
    id: number;
    teacher_id: number;
    title: string;
    slug: string;
    content: BlockNoteDocument;
    allocated_time: string | null;
    public_at: string | null;
    created_at: string;
}

interface Submission {
    id: number;
    writing_id: number;
    student_id: number;
    content: BlockNoteDocument;
    spent_time: string | null;
    submitted_at: string | null;
    evaluated_at: string | null;
    status: 'in_progress' | 'completed';
}

interface Feedback {
    id: number;
    submission_id: number;
    teacher_id: number;
    content: Annotation[];
    score: number;
    feedback: string;
}
```

### 13.2 Pagination

```tsx
interface PaginatedData<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}
```

---

## 14. Testing

### 14.1 Component Testing

```tsx
import { render, screen } from '@testing-library/react';

test('renders metrics card', () => {
    render(<MetricsCard title="Students" value={42} icon={<Users />} />);
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
});
```

### 14.2 E2E Testing (Future)

Playwright tests for critical flows:
- Teacher creates writing
- Student submits writing
- Teacher evaluates submission
- Student views feedback
