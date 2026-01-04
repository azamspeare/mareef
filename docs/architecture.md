# Mareef - Architecture Overview

Technical architecture documentation for Mareef - a platform for teachers to create writing tasks and evaluate student submissions.

---

## 1. High-Level System Design

Mareef is a **monolithic web application** built with:

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + TypeScript (via Inertia.js)
- **UI:** Tailwind CSS 4 + Radix UI + shadcn/ui
- **Editor:** BlockNote (rich text)
- **Database:** MySQL
- **Cache/Session:** Redis (recommended) or Database
- **Auth:** Google OAuth

### 1.1 Request Flow

```
User Request → Nginx → Laravel Router → Controller → Service/Action
                                              ↓
                              Inertia Response → React Page
```

1. User accesses the app via subdomain routing
2. Laravel handles routing and returns Inertia responses
3. React components render the UI with server-provided props
4. Form submissions use Inertia's form helpers (no separate API)

### 1.2 Subdomain Architecture

| Domain | Purpose | Users |
|--------|---------|-------|
| `app.{domain}` | Teacher portal | Teachers |
| `student.{domain}` | Student portal | Students |
| `{domain}` | Public landing pages | All |

---

## 2. Backend Architecture

### 2.1 Directory Structure

```
app/
├── Actions/              # Single-purpose domain actions
│   ├── Submission/       # CreateSubmissionAction, etc.
│   ├── User/             # RegisterAction, etc.
│   └── Writing/          # CreateWritingAction, etc.
│
├── Contracts/            # Interfaces and base classes
│   ├── Abstracts/        # AbstractDTO, AbstractFilter, AbstractQuery
│   ├── Enums/            # RoleEnum, StatusEnum, SubmissionProcessEnum
│   └── Interfaces/       # Serviceable, Filterable, Queryable
│
├── DTOs/                 # Data Transfer Objects
│   ├── Submission/       # SubmissionDTO
│   ├── User/             # RegisterDTO
│   └── Writing/          # WritingDTO
│
├── Filters/              # Query filter classes
│   ├── Student/          # StudentFilter
│   ├── Submission/       # SubmissionFilter
│   └── Writing/          # WritingFilter
│
├── Handlers/             # Service handlers with transactions
│   └── ServiceHandler.php
│
├── Http/
│   ├── Controllers/      # Route controllers
│   │   ├── Auth/         # Login, OAuth controllers
│   │   ├── Dashboard/    # Teacher dashboard controllers
│   │   ├── Landing/      # Public pages
│   │   └── Student/      # Student-facing controllers
│   ├── Middleware/       # HandleInertiaRequests, RoleValidation
│   └── Requests/         # Form request validation
│
├── Mail/                 # Email templates
│
├── Models/               # Eloquent models
│   ├── Feedback/         # WritingFeedback
│   ├── Submission/       # WritingSubmission
│   ├── User/             # User
│   └── Writing/          # Writing
│
├── Observers/            # Model event listeners
│   └── Submission/       # WritingSubmissionObserver
│
├── Providers/            # Service providers
│
├── Queries/              # Complex query builders
│   ├── Student/          # Student queries
│   ├── Submission/       # Submission queries
│   ├── User/             # User queries
│   └── Writing/          # Writing queries
│
├── Repositories/         # Data access layer
│   ├── MetricsRepository.php
│   └── SubmissionsRepository.php
│
├── Rules/                # Custom validation rules
│
└── Services/             # Business logic services
    ├── Writing/          # CreateWritingService, etc.
    └── Submission/       # EvaluateSubmissionService, etc.
```

### 2.2 Layer Responsibilities

| Layer | Purpose | Example |
|-------|---------|---------|
| **Controllers** | HTTP handling, request/response | `DashboardController` |
| **Actions** | Single-purpose operations | `CreateSubmissionAction` |
| **Services** | Complex business logic | `CreateWritingService` |
| **Repositories** | Aggregated data access | `MetricsRepository` |
| **Queries** | Complex query building | `SubmissionFindForListQuery` |
| **Filters** | Query parameter handling | `SubmissionFilter` |
| **DTOs** | Data transfer between layers | `WritingDTO` |
| **Observers** | Model event handling | `WritingSubmissionObserver` |

### 2.3 Data Flow Example

```
Controller
    ↓ (validates request)
FormRequest
    ↓ (creates DTO)
DTO::make()
    ↓ (executes action)
Action::run()
    ↓ (may use service for complex logic)
Service::handle()
    ↓ (persists data)
Model::create()
    ↓ (triggers observer)
Observer::created()
    ↓ (returns response)
Inertia::render()
```

---

## 3. Frontend Architecture

### 3.1 Directory Structure

```
resources/js/
├── Pages/                # Page components (mapped to routes)
│   ├── Auth/             # Login.tsx
│   ├── Dashboard/        # Home.tsx
│   ├── Landing/          # Welcome, Pricing, etc.
│   ├── Students/         # Index.tsx, Submission.tsx
│   ├── Submissions/      # Index.tsx, Submission.tsx
│   ├── Writings/         # Index, Create, Edit, Submission.tsx
│   └── WritingTask.tsx   # Student writing interface
│
├── Layouts/              # Layout components
│   └── DashboardLayout.tsx
│
├── components/           # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── annotation/       # Text annotation system
│   └── ...               # Feature components
│
├── hooks/                # Custom React hooks
│   ├── use-auto-save.ts  # Auto-save with dirty tracking
│   └── use-timer.ts      # Countdown timer
│
├── app.tsx               # Inertia app setup
└── bootstrap.js          # Axios configuration
```

### 3.2 Key Technologies

- **Inertia.js** - Server-driven SPA without API
- **BlockNote** - Rich text editor for writing tasks
- **Radix UI** - Accessible component primitives
- **Recharts** - Dashboard charts
- **React Table** - Data tables with sorting/filtering

### 3.3 State Management

- **Server State**: Inertia props (no client-side fetching)
- **Form State**: Inertia's `useForm` hook
- **UI State**: React local state
- **Shared Data**: Inertia middleware shares `auth`, `flash`, `ziggy`

---

## 4. Database Architecture

### 4.1 Core Tables

```
users
├── id, name, email, username (unique)
├── role (teacher/student)
├── avatar, password (nullable for OAuth)
└── timestamps, soft_deletes

writings
├── id, teacher_id (FK)
├── title, slug, content (JSON)
├── allocated_time, public_at, hash
└── timestamps, soft_deletes

writing_submissions
├── id, writing_id (FK), student_id (FK)
├── content (JSON), spent_time, status
├── submitted_at, evaluated_at
└── timestamps, soft_deletes

writing_feedbacks
├── id, submission_id (FK), teacher_id (FK)
├── content (JSON), score, feedback
└── timestamps, soft_deletes
```

### 4.2 Indexes

```sql
-- Unique constraints
UNIQUE (users.email)
UNIQUE (users.username)
UNIQUE (writings.teacher_id, writings.slug)
UNIQUE (writing_submissions.writing_id, writing_submissions.student_id)

-- Performance indexes
INDEX (writing_submissions.writing_id, writing_submissions.submitted_at)
INDEX (writing_submissions.evaluated_at)
INDEX (writing_submissions.status)
INDEX (writing_submissions.student_id)
INDEX (writings.teacher_id)
INDEX (users.role)
```

### 4.3 Relationships

```
User (teacher) ──1:N──> Writing
User (student) ──1:N──> WritingSubmission
Writing ──1:N──> WritingSubmission
WritingSubmission ──1:1──> WritingFeedback
```

---

## 5. Caching Strategy

### 5.1 Cached Data

| Cache Key | TTL | Purpose |
|-----------|-----|---------|
| `metrics:submissions:{teacher_id}` | 5 min | Dashboard submission metrics |
| `metrics:students:{teacher_id}` | 5 min | Dashboard student metrics |
| `metrics:writings:{teacher_id}` | 5 min | Dashboard writing metrics |
| `counts:submissions:{teacher_id}` | 5 min | Submission tab counts |
| `ziggy:routes` | 1 hour | Ziggy route definitions |

### 5.2 Cache Invalidation

Cache is invalidated via `WritingSubmissionObserver` when:
- Submission created
- Submission evaluated (status change)
- Submission deleted/restored

### 5.3 Production Configuration

```env
# Recommended for 500+ RPS
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

## 6. Security

### 6.1 Authentication

- Google OAuth only (no password authentication)
- Session-based with CSRF protection
- Role-based middleware (`is_role:teacher`, `is_role:student`)

### 6.2 Rate Limiting

| Limiter | Limit | Scope |
|---------|-------|-------|
| `web` | 60/min | Per IP |
| `auth` | 5/min | Per IP |
| `auto-save` | 10/min | Per user |
| `api` | 30/min | Per user |
| `uploads` | 20/min | Per user |

### 6.3 Authorization

- Teachers can only access their own writings/submissions
- Students can only access their own submissions
- Soft deletes prevent accidental data loss

---

## 7. Performance Optimizations

### 7.1 Backend

- Cached metrics and counts (5 min TTL)
- Eager loading with specific column selection
- Composite database indexes
- Ziggy routes cached in memory

### 7.2 Frontend

- Code splitting (BlockNote, Radix, Charts in separate chunks)
- Auto-save with dirty tracking (only saves on changes)
- Debounced saves prevent rapid requests
- esbuild minification

### 7.3 Deployment

```bash
# Production cache commands
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 8. Infrastructure

### 8.1 Requirements

- PHP 8.2+
- MySQL 8.0+ or PostgreSQL 14+
- Redis (recommended for production)
- Node.js 18+ (build only)

### 8.2 Deployment Flow

```
Push to main
    ↓
Run tests
    ↓
npm run build
    ↓
php artisan migrate
    ↓
Sync to server
    ↓
php artisan config:cache
php artisan route:cache
php artisan view:cache
    ↓
Restart queue workers
```

---

## 9. Future Considerations

- **Laravel Octane** for persistent workers
- **Database read replicas** for reporting
- **S3** for file storage at scale
- **Horizontal scaling** with load balancer
- **WebSockets** for real-time features
