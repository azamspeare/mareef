# Mareff – Architecture Overview (MVP)

This document describes the **technical architecture** of Mareff’s MVP:

- Overall system design
- Backend architecture (Laravel 12)
- Frontend architecture (React + Inertia)
- Database model
- Infrastructure & deployment
- Security & compliance considerations
- Observability & future scalability

The goal is to give engineers and AI agents a clear, implementation-oriented picture of how the system is structured and how pieces interact.

---

## 1. High-Level System Design

Mareff MVP is a **monolithic web application** built with:

- **Backend:** Laravel 12 (PHP)
- **Frontend:** React (via Inertia.js)
- **UI:** Tailwind CSS + shadcn/ui components
- **Database:** MySQL
- **Auth:** Google OAuth (no password-based login)
- **Hosting:** Single web app server + MySQL DB (VPS / managed platform)

### 1.1 High-Level Flow

1. User (teacher/student/admin) accesses the Mareff web app over HTTPS.
2. Frontend is rendered via **Inertia.js** – Laravel returns React pages as SPA-like responses.
3. Authentication uses **Google OAuth**:
   - User is redirected to Google
   - On callback, Laravel creates/updates the user record and sets session
4. After login:
   - Teachers can create writing tasks and review submissions
   - Students access writing task links, submit their writing, and later view feedback
   - Admin manages the platform via a minimal admin interface
5. All data is persisted in MySQL.

The monolith architecture is chosen for simplicity and speed in the MVP phase.

---

## 2. Backend Architecture (Laravel 12)

### 2.1 Layers & Structure

Backend is built using standard Laravel conventions:

- `routes/web.php` – Web routes handled via Inertia
- `app/Http/Controllers` – Controllers for HTTP endpoints
- `app/Models` – Eloquent models representing DB tables
- `app/Http/Requests` – Form request validation
- `app/Policies` – Authorization rules (optional MVP, can start with simple gates/middleware)
- `app/Services` – (Optional) Service classes for business logic if controllers become heavy
- `database/migrations` – Schema migrations
- `database/factories` – Factories for testing and seeding

### 2.2 Key Backend Modules

**1. Authentication Module**
- Uses Google OAuth (Laravel Socialite or similar)
- Responsibilities:
  - Redirect to Google
  - Handle callback and retrieve user data
  - Upsert user (`users` table) based on `google_id` or `email`
  - Assign a role (`student`, `teacher`, `admin`) – at MVP:
    - Default new users to `student`
    - Promote to `teacher` / `admin` manually or via simple logic

**2. Role & Authorization Module**
- Role stored as a column on `users.role`
- Middleware such as `role:teacher`, `role:admin`, `role:student,admin`
- Guards:
  - Teachers can only see and manage their own `writings` and related `submissions`
  - Students can only see and manage their own `submissions`
  - Admin can access everything (read/write)

**3. Writing Management Module**
- Controllers:
  - `WritingController` for CRUD of writing tasks (teacher/admin)
- Core operations:
  - Create / edit / archive writing tasks
  - Generate shareable slug/URL
  - List writings for the logged-in teacher
  - Show details for a single writing
- Business rules:
  - `teacher_id` always equals current logged-in teacher
  - `status` can be `active` or `archived`

**4. Submission & Evaluation Module**
- Controllers:
  - `SubmissionController` for handling submissions and views
  - `FeedbackController` for teacher evaluation
- Student operations:
  - Submit writing content for a specific `writing_id`
  - One submission per `(writing_id, student_id)`
- Teacher operations:
  - List submissions for a writing
  - View individual submission
  - Evaluate submission (score + comments)
- Evaluation:
  - Stored in `writing_feedbacks` table
  - Updates `writing_submissions.status` from `submitted` → `evaluated`

**5. Admin Module**
- Minimal, but can include:
  - `AdminUserController` to list/search users
  - Ability to change roles in UI (optional) or done via DB in MVP
- Admin sees a simple dashboard with counts:
  - Total users, teachers, students
  - Total writings
  - Total submissions

### 2.3 Request Handling

- All web requests are handled through `web.php` routes.
- Controllers return Inertia responses:
  - Example: `Inertia::render('Home/Index', [...])`
- Validation:
  - Done via `FormRequest` classes
- Error handling:
  - Uses default Laravel exceptions + validation error bags returned to frontend

---

## 3. Frontend Architecture (React + Inertia + Tailwind + shadcn/ui)

### 3.1 Inertia & Routing

- Laravel generates routes and passes data to React via Inertia.
- React pages are organized under `resources/js/Pages` (or similar).
- Navigation uses Inertia’s `<Link>` and form helpers for SPA-like UX.

### 3.2 Layouts

- `AuthenticatedLayout`:
  - Used for logged-in users (teachers, students, admin)
  - Contains:
    - Top navigation (user info, logout)
    - Sidebar (Home, Writings, Admin if applicable)
    - Main content area
- `GuestLayout`:
  - Used for login / landing pages

### 3.3 Pages

Likely React pages:

- `Home/Index.jsx`
- `Writings/Index.jsx`
- `Writings/Create.jsx`
- `Writings/Edit.jsx`
- `Writings/Show.jsx` (includes share link)
- `Writings/SubmissionsIndex.jsx`
- `Submissions/Show.jsx` (teacher marking view)
- `PublicWriting/Show.jsx` (student: write + submit + view feedback)
- `Admin/UsersIndex.jsx` (optional)

### 3.4 UI Components

- Uses **Tailwind CSS** for styling.
- Uses **shadcn/ui** for ready-made components:
  - Buttons
  - Inputs
  - Tables
  - Modals / dialogs
  - Alerts / banners
  - Sidebar navigation
- Important custom components:
  - `WritingEditor` – text editor for teacher instructions and student submissions
  - `SubmissionViewer` – display submitted writing with read-only view
  - `FeedbackPanel` – score, overall comment, potentially inline feedback controls
  - `StatusBadge` – visual status of submissions

### 3.5 Editor Strategy (MVP)

For MVP:

- Editor can start as:
  - A simple `<textarea>` OR
  - A minimal rich-text editor with basic formatting (bold, italics, headings, lists)
- The key is **stability** and **correct round-trip** to the backend.
- Content can be stored as:
  - `text`/`longtext` (plain) OR
  - `HTML` OR
  - JSON structure (depending on chosen editor library)

Inline comments and highlighting can initially be implemented in a simplified way (e.g., “comment blocks” instead of fully dynamic inline anchors).

---

## 4. Database Architecture (MySQL)

### 4.1 Core Tables

#### `users`
- `id` (PK)
- `name`
- `email` (unique)
- `avatar` (nullable)
- `google_id` (unique)
- `role` (enum: `student`, `teacher`, `admin`)
- `remember_token` (nullable)
- `created_at`
- `updated_at`

#### `writings`
- `id` (PK)
- `teacher_id` (FK → users.id, role=teacher)
- `title` (string)
- `slug` (string, unique)
- `instructions` (longtext or json)
- `status` (enum: `active`, `archived`)
- `max_score` (integer, nullable)
- `due_at` (datetime, nullable)
- `created_at`
- `updated_at`

#### `writing_submissions`
- `id` (PK)
- `writing_id` (FK → writings.id)
- `student_id` (FK → users.id, role=student)
- `content` (longtext or json)
- `status` (enum: `submitted`, `evaluated`) – default `submitted`
- `submitted_at` (datetime)
- `evaluated_at` (datetime, nullable)
- `created_at`
- `updated_at`

**Indexes:**
- Unique `(writing_id, student_id)` to enforce one submission per student per task.
- Index on `(writing_id, status)` for efficient filtering per writing.

#### `writing_feedbacks`
- `id` (PK)
- `submission_id` (FK → writing_submissions.id, unique)
- `teacher_id` (FK → users.id, role=teacher)
- `score` (integer, nullable)
- `overall_comment` (longtext, nullable)
- `inline_feedback` (json, nullable)
- `created_at`
- `updated_at`

### 4.2 Future Tables (Non-MVP)

- `attachments` for media files (if writing tasks support uploads)
- `organizations` / `classes` for grouping teachers & students
- `plans` / `subscriptions` for billing
- `events` / `activity_logs` for audit trail

---

## 5. Infrastructure & Deployment

### 5.1 Environments

- **Local development**
  - Laravel Sail or Docker (PHP-FPM, Nginx, MySQL, Node)
  - `.env` configured for local DB and Google OAuth credentials
- **Staging** (optional for MVP)
  - Same stack as production, smaller resources
- **Production**
  - VPS or managed platform with:
    - Nginx/Apache + PHP-FPM
    - MySQL (managed or self-hosted)
    - Node.js for building frontend assets (CI/CD step)

### 5.2 Deployment Model

- Use Git-based deployment (GitHub Actions / other CI/CD):
  1. On push to `main` / `production` branch:
     - Run tests
     - Run `npm run build` or `pnpm build` for frontend
     - Run Laravel `php artisan migrate --force`
  2. Sync built assets + code to server
  3. Cache config/routes/views on server (`php artisan config:cache`, etc.)

- `storage` and `bootstrap/cache` must be writable by the web server user.

### 5.3 File Storage

For MVP:

- No large file uploads are required.
- All writing content is stored in DB as text/HTML/JSON.
- If in the future attachments are needed (images, PDFs):
  - Use Laravel’s Filesystem (local in MVP, S3 or similar later).

---

## 6. Security Considerations

### 6.1 Authentication & Sessions

- Authentication uses **Google OAuth** only (no passwords).
- Sessions handled by Laravel session driver:
  - Recommended: `database` or `redis` in production, but `file` can be acceptable for MVP on small scale.
- All authentication-related routes must be served over **HTTPS** in production.

### 6.2 Authorization & Data Access

- Route middleware:
  - `auth` – required for all non-public views (e.g., dashboards, writing creation, etc.)
  - `role:teacher` – restrict writing management & evaluation
  - `role:student` – restrict submission endpoints
  - `role:admin` – restrict admin endpoints
- In controllers, always scope queries to the current user where relevant:
  - Teachers only see writings where `teacher_id = auth()->id()`
  - Students only see their own submissions
- Never trust `writing_id` / `submission_id` from the client without validating ownership.

### 6.3 Input Validation & Sanitization

- All incoming data validated via **Laravel Form Requests**:
  - Titles, instructions, content, scores, etc.
- For editors that return HTML:
  - Use HTML sanitization (e.g., Laravel’s `Purifier` or built-in mechanisms) to remove dangerous tags/scripts.
- For JSON-based editors:
  - Validate against expected shape and size limits.

### 6.4 CSRF & XSS Protection

- CSRF:
  - Laravel has CSRF protection for all POST/PUT/PATCH/DELETE requests.
  - Inertia automatically handles CSRF token on frontend.
- XSS:
  - Use `@viteReactRefresh` / correct escaping by default in React
  - Treat any rich HTML content as untrusted and sanitize before rendering.

### 6.5 Rate Limiting

- Optional for MVP, but recommended:
  - Rate-limit login / OAuth callback endpoints.
  - Rate-limit write-heavy endpoints (submissions, evaluations) to prevent abuse.

### 6.6 Secrets Management

- Secrets (Google OAuth client ID/secret, DB credentials, mail provider keys) stored in:
  - `.env` (local)
  - Secret manager or environment-level secrets on server/hosting
- Secrets are **never** committed to Git.

---

## 7. Observability & Monitoring

### 7.1 Logging

- Use Laravel’s default logging to log file (`storage/logs/laravel.log`).
- Log:
  - Unexpected exceptions
  - Failed logins (if needed)
  - Important business events (optional)

### 7.2 Error Tracking (Future)

- For production, can integrate with:
  - Sentry, Bugsnag, or similar service
- Not mandatory for MVP but recommended soon after first user tests.

### 7.3 Metrics (Future)

- Track:
  - Number of active teachers
  - Number of writings created
  - Number of submissions
- This can be basic DB queries at first; later, integrate with an analytics stack.

---

## 8. Scalability & Future Evolution

Although the MVP is a **monolith**, the architecture is designed so it can evolve:

- **Scale vertically first**:
  - More CPU/RAM on the main server as load grows.
- **Database optimization**:
  - Add proper indexes
  - Introduce caching (Redis) for dashboards/stats
- **Background jobs**:
  - Offload heavy tasks (e.g., sending emails, AI scoring in future) to Laravel queues.
- **Service extraction (long term)**:
  - If needed, split read-heavy operations (analytics, reporting) into dedicated services.
  - Keep core writing/evaluation logic in one app for as long as possible.

---

## 9. Summary

- Mareff MVP is a **Laravel 12 + React (Inertia)** monolithic application.
- It uses **Google OAuth** as the only authentication method.
- All state is persisted in **MySQL** with a small, well-defined schema.
- The focus is on **simplicity, developer productivity, and fast iteration**, not microservices.
- Security relies on standard Laravel best practices: HTTPS, CSRF, role-based middleware, input validation, and proper access scoping.

This architectural setup is intentionally minimal but robust enough to support real teachers and students using Mareff in production, while leaving clear paths for expansion once the core product is validated.
