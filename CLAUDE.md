# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

- **Never run build or dev commands** - Do not run `npm run build`, `npm run dev`, `composer dev`, `php artisan serve`, or similar long-running/build processes. The user manages these separately.

## Build & Development Commands

```bash
# Full development environment (runs server, queue, logs, vite concurrently)
composer dev

# Individual services
php artisan serve              # Laravel server (port 8000)
php artisan queue:listen       # Queue worker
npm run dev                    # Vite dev server

# Testing
php artisan test               # Run Pest tests
composer test                  # Clear config + run tests

# Code formatting
./vendor/bin/pint              # Laravel Pint formatter

# Production build
npm run build
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

## Architecture Overview

### Backend Pattern: Domain-Driven Design

The app follows a layered architecture with clear separation:

```
Controller → FormRequest → DTO → Service → Action → Model
```

**Key directories:**
- `app/Actions/` - Single-responsibility persistence operations (Create, Update, Archive)
- `app/DTOs/` - Readonly, immutable data transfer objects with static `make()` factory methods
- `app/Services/` - Business logic orchestration, wrapped in transactions via `ServiceHandler`
- `app/Queries/` - Reusable query builders extending `AbstractArrayQueryable`
- `app/Filters/` - Request filtering/sorting extending `AbstractFilter`

**Model organization:**
Models use trait-based organization: `HasRelations`, `HasMethods`, `Attributes` for separation of concerns.

**Service execution pattern:**
```php
$result = $handler->handle(new CreateWritingService($dto));
if (!$result) {
    return redirect()->back()->withErrors(['message' => 'Failed']);
}
```

### Frontend: React + Inertia.js

- `resources/js/Pages/` - Inertia page components (auto-resolved by path)
- `resources/js/components/ui/` - Shadcn/Radix UI components
- `resources/js/hooks/` - Custom hooks (use-auto-save, use-timer, use-draft, etc.)
- `resources/js/types/` - TypeScript types with `models/` and `enums.ts`

### Subdomain Routing

- `app.{domain}` - Teacher portal
- `student.{domain}` - Student portal
- `{domain}` - Public landing pages

## Key Patterns

### DTOs
Readonly objects created via static factory: `WritingDTO::make($attributes, $teacherId)`

### Soft Deletes with Archive/Restore
- `PATCH /{resource}/{id}/archive` - Soft delete
- `PATCH /{resource}/{id}/restore` - Restore
- `DELETE /{resource}/{id}` - Force delete

### Auto-Save (Frontend)
Writing/Quiz tasks use `use-auto-save` hook with interval saves and dirty tracking. Drafts persisted to localStorage via `use-draft` hook.

### BlockNote Content
Rich text stored as JSON. Images processed during creation (`BlockNoteContentHelper::processImages`), paths transformed via model attribute accessors.

## Domains

- **Writing** - Writing tasks with timed submissions and teacher feedback/annotations
- **Quiz** - Multiple choice, true/false, short/long answer questions with auto-grading
- **User** - Teachers and students with Google OAuth authentication
