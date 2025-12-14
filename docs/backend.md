# Mareef - Backend Specification

Backend architecture, models, and implementation patterns for Mareef.

---

## 1. Architecture Overview

Mareef's backend is a **Laravel 12 monolithic application** with a domain-driven structure:

- **Database:** MySQL
- **ORM:** Eloquent
- **Frontend:** Inertia.js (React)
- **Auth:** Google OAuth (Laravel Socialite)
- **Cache:** Redis (recommended) or Database
- **Queue:** Redis (recommended) or Database

### 1.1 Core Domain Models

```
User ──────────────> Writing ──────────────> WritingSubmission ──────────────> WritingFeedback
(teacher)           (task)                  (student answer)                  (evaluation)
```

---

## 2. Database Schema

### 2.1 Users Table

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    password VARCHAR(255) NULL,          -- Nullable for OAuth users
    role VARCHAR(50) NOT NULL,           -- 'teacher' or 'student'
    avatar VARCHAR(255) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL            -- Soft deletes
);
```

### 2.2 Writings Table

```sql
CREATE TABLE writings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content JSON NOT NULL,               -- BlockNote editor content
    allocated_time TIME NULL,            -- Optional time limit
    public_at TIMESTAMP NULL,            -- Scheduled publishing
    hash VARCHAR(255) NOT NULL,          -- Content hash for change detection
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (teacher_id, slug)
);

CREATE INDEX writings_teacher_id_index ON writings(teacher_id);
```

### 2.3 Writing Submissions Table

```sql
CREATE TABLE writing_submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    writing_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    content JSON NOT NULL,               -- Student's writing content
    spent_time TIME NULL,                -- Time spent writing
    submitted_at TIMESTAMP NULL,         -- When submitted
    evaluated_at TIMESTAMP NULL,         -- When teacher evaluated
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (writing_id) REFERENCES writings(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (writing_id, student_id)
);

CREATE INDEX writing_submissions_writing_id_submitted_at_index
    ON writing_submissions(writing_id, submitted_at);
CREATE INDEX writing_submissions_evaluated_at_index ON writing_submissions(evaluated_at);
CREATE INDEX writing_submissions_status_index ON writing_submissions(status);
CREATE INDEX writing_submissions_student_id_index ON writing_submissions(student_id);
```

### 2.4 Writing Feedbacks Table

```sql
CREATE TABLE writing_feedbacks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    content JSON NOT NULL,               -- Inline annotations
    score DECIMAL(8,2) NOT NULL,
    feedback MEDIUMTEXT NOT NULL,        -- Overall feedback text
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (submission_id) REFERENCES writing_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 3. Models

### 3.1 User Model

**Location:** `app/Models/User/User.php`

```php
final class User extends Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'username', 'password',
        'role', 'avatar', 'last_login_at'
    ];

    protected $hidden = ['password', 'remember_token'];

    // Relationships
    public function writings(): HasMany;      // Teacher's writings
    public function submissions(): HasMany;   // Student's submissions
    public function feedbacks(): HasMany;     // Teacher's feedbacks
}
```

**Role Values:**
- `teacher` - Creates writings, evaluates submissions
- `student` - Submits writings, views feedback

### 3.2 Writing Model

**Location:** `app/Models/Writing/Writing.php`

```php
final class Writing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_id', 'title', 'slug', 'content',
        'allocated_time', 'public_at', 'hash'
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'public_at' => 'datetime',
        ];
    }

    // Relationships
    public function teacher(): BelongsTo;
    public function submissions(): HasMany;

    // Content accessor transforms image paths to URLs
    protected function content(): Attribute;
}
```

### 3.3 WritingSubmission Model

**Location:** `app/Models/Submission/WritingSubmission.php`

```php
#[ObservedBy(WritingSubmissionObserver::class)]
final class WritingSubmission extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'writing_id', 'student_id', 'content',
        'spent_time', 'submitted_at', 'evaluated_at', 'status'
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'submitted_at' => 'datetime',
            'evaluated_at' => 'datetime',
        ];
    }

    // Relationships
    public function writing(): BelongsTo;
    public function student(): BelongsTo;
    public function feedback(): HasOne;
}
```

### 3.4 WritingFeedback Model

**Location:** `app/Models/Feedback/WritingFeedback.php`

```php
final class WritingFeedback extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'submission_id', 'teacher_id', 'content', 'score', 'feedback'
    ];

    protected function casts(): array
    {
        return ['content' => 'array'];
    }

    // Relationships
    public function submission(): BelongsTo;
    public function teacher(): BelongsTo;
}
```

---

## 4. Enums

### 4.1 RoleEnum

**Location:** `app/Contracts/Enums/RoleEnum.php`

```php
enum RoleEnum: string
{
    case TEACHER = 'teacher';
    case STUDENT = 'student';
}
```

### 4.2 SubmissionProcessEnum

**Location:** `app/Contracts/Enums/SubmissionProcessEnum.php`

```php
enum SubmissionProcessEnum: string
{
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';

    public static function isInProgress(string $status): bool;
}
```

### 4.3 SubmissionStatusEnum

**Location:** `app/Contracts/Enums/SubmissionStatusEnum.php`

```php
enum SubmissionStatusEnum: string
{
    case ALL = 'all';
    case NOT_REVIEWED = 'not_reviewed';
    case EVALUATED = 'evaluated';
}
```

---

## 5. Actions

Single-purpose classes that perform domain operations.

### 5.1 CreateSubmissionAction

**Location:** `app/Actions/Submission/CreateSubmissionAction.php`

```php
final class CreateSubmissionAction
{
    public function run(SubmissionDTO $dto): WritingSubmission
    {
        return WritingSubmission::create([
            'writing_id' => $dto->writingId,
            'student_id' => $dto->studentId,
            'content' => $dto->content,
            'status' => SubmissionProcessEnum::IN_PROGRESS->value,
        ]);
    }
}
```

### 5.2 UpdateSubmissionAction

```php
final class UpdateSubmissionAction
{
    public function run(WritingSubmission $submission, SubmissionDTO $dto): WritingSubmission
    {
        $submission->update($dto->toArray());
        return $submission;
    }
}
```

---

## 6. DTOs (Data Transfer Objects)

### 6.1 SubmissionDTO

**Location:** `app/DTOs/Submission/SubmissionDTO.php`

```php
final class SubmissionDTO extends AbstractDTO
{
    public function __construct(
        public readonly int $writingId,
        public readonly int $studentId,
        public readonly ?array $content = null,
        public readonly ?string $spentTime = null,
        public readonly ?string $status = null,
        public readonly ?Carbon $submittedAt = null,
    ) {}

    public static function make(array $attributes, int $studentId): self;
    public function toArray(): array;
}
```

---

## 7. Queries

Complex query builders for retrieving data.

### 7.1 SubmissionFindForListQuery

**Location:** `app/Queries/Submission/SubmissionFindForListQuery.php`

```php
final class SubmissionFindForListQuery extends AbstractFilterQueryable
{
    public function query(AbstractFilter $filter): LengthAwarePaginator
    {
        return WritingSubmission::query()
            ->select([
                'writing_submissions.id',
                'writing_submissions.writing_id',
                'writing_submissions.student_id',
                'writing_submissions.spent_time',
                'writing_submissions.submitted_at',
                'writing_submissions.evaluated_at',
                'writing_submissions.created_at',
            ])
            ->join('writings', 'writing_submissions.writing_id', '=', 'writings.id')
            ->where('writings.teacher_id', $filter->teacherId)
            ->whereNull('writings.deleted_at')
            ->with([
                'writing:id,title,allocated_time',
                'student:id,name',
                'feedback:id,submission_id,score',
            ])
            // Apply search and status filters
            ->paginate($filter->perPage);
    }
}
```

---

## 8. Filters

### 8.1 SubmissionFilter

**Location:** `app/Filters/Submission/SubmissionFilter.php`

```php
final class SubmissionFilter extends AbstractFilter
{
    public function __construct(
        public readonly int $teacherId,
        public readonly SubmissionStatusEnum $status = SubmissionStatusEnum::ALL,
        public readonly ?string $search = null,
        public readonly string $sortBy = 'submitted_at',
        public readonly string $sortDirection = 'desc',
        public readonly int $perPage = 15,
    ) {}

    public static function fromRequest(Request $request, int $teacherId): self;
}
```

---

## 9. Repositories

Aggregated data access with caching.

### 9.1 MetricsRepository

**Location:** `app/Repositories/MetricsRepository.php`

```php
final class MetricsRepository
{
    private const CACHE_TTL = 300; // 5 minutes

    public function calculateSubmissionsMetrics(int $teacher_id): array
    {
        return Cache::remember(
            "metrics:submissions:{$teacher_id}",
            self::CACHE_TTL,
            fn () => $this->querySubmissionMetrics($teacher_id)
        );
    }

    public function calculateStudentsMetrics(int $teacher_id): array;
    public function calculateWritingMetrics(int $teacher_id): array;

    public static function invalidateCache(int $teacher_id): void
    {
        Cache::forget("metrics:submissions:{$teacher_id}");
        Cache::forget("metrics:students:{$teacher_id}");
        Cache::forget("metrics:writings:{$teacher_id}");
        Cache::forget("counts:submissions:{$teacher_id}");
    }
}
```

---

## 10. Observers

### 10.1 WritingSubmissionObserver

**Location:** `app/Observers/Submission/WritingSubmissionObserver.php`

```php
final class WritingSubmissionObserver
{
    public function created(WritingSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);

        defer(function () use ($submission) {
            Mail::to($submission->writing->teacher->email)
                ->send(new StudentSubmissionNotification($submission));
        });
    }

    public function updated(WritingSubmission $submission): void
    {
        if ($submission->isDirty('evaluated_at') || $submission->isDirty('status')) {
            $this->invalidateTeacherCache($submission);
        }
    }

    private function invalidateTeacherCache(WritingSubmission $submission): void
    {
        MetricsRepository::invalidateCache($submission->writing->teacher_id);
    }
}
```

---

## 11. Controllers

### 11.1 DashboardController

**Location:** `app/Http/Controllers/Dashboard/DashboardController.php`

```php
final class DashboardController extends Controller
{
    public function __invoke(
        Request $request,
        MetricsRepository $metricsRepository,
        SubmissionsRepository $submissionsRepository,
        SubmissionFindForListQuery $query
    ): Response {
        $teacher = $request->user();
        $filter = SubmissionFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Dashboard/Home', [
            'metrics' => [
                'submissions' => $metricsRepository->calculateSubmissionsMetrics($teacher->id),
                'students' => $metricsRepository->calculateStudentsMetrics($teacher->id),
                'writings' => $metricsRepository->calculateWritingMetrics($teacher->id),
            ],
            'counts' => $submissionsRepository->getAllCounts($teacher->id),
            'submissions' => $query->query($filter),
        ]);
    }
}
```

---

## 12. Middleware

### 12.1 EnsureRoleIsValidMiddleware

**Location:** `app/Http/Middleware/EnsureRoleIsValidMiddleware.php`

```php
final class EnsureRoleIsValidMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if ($request->user()?->role !== $role) {
            abort(403, 'Unauthorized');
        }
        return $next($request);
    }
}
```

### 12.2 HandleInertiaRequests

Shares global data with all Inertia responses:
- `auth.user` - Current user (selective fields)
- `flash` - Flash messages
- `ziggy` - Route definitions (cached)

---

## 13. Rate Limiting

**Location:** `app/Providers/AppServiceProvider.php`

```php
RateLimiter::for('web', fn (Request $request) =>
    Limit::perMinute(60)->by($request->ip()));

RateLimiter::for('auto-save', fn (Request $request) =>
    Limit::perMinute(10)->by($request->user()?->id ?: $request->ip()));

RateLimiter::for('auth', fn (Request $request) =>
    Limit::perMinute(5)->by($request->ip()));

RateLimiter::for('api', fn (Request $request) =>
    Limit::perMinute(30)->by($request->user()?->id ?: $request->ip()));

RateLimiter::for('uploads', fn (Request $request) =>
    Limit::perMinute(20)->by($request->user()?->id ?: $request->ip()));
```

---

## 14. Routes

### 14.1 Teacher Portal (`app.{domain}`)

```php
Route::middleware(['auth', 'is_role:teacher'])->group(function () {
    Route::get('dashboard', DashboardController::class);

    Route::resource('students', StudentController::class)->only(['index', 'show']);
    Route::resource('writings', WritingController::class);
    Route::resource('submissions', SubmissionController::class)->only(['index', 'show']);
    Route::post('submissions/{id}/evaluate', [SubmissionController::class, 'evaluate']);
});
```

### 14.2 Student Portal (`student.{domain}`)

```php
Route::prefix('tasks')->group(function () {
    Route::get('/{handle}/writing/{slug}', [WritingController::class, 'create']);

    Route::middleware(['auth', 'is_role:student'])->group(function () {
        Route::post('submissions/start', [WritingController::class, 'start']);
        Route::post('submissions/save', [WritingController::class, 'update'])
            ->middleware('throttle:auto-save');
        Route::post('submissions/finish', [WritingController::class, 'finish']);
    });
});
```

---

## 15. Testing

### 15.1 Factories

```php
// WritingFactory
Writing::factory()->create([
    'teacher_id' => $teacher->id,
    'title' => 'Test Writing',
]);

// WritingSubmissionFactory
WritingSubmission::factory()->create([
    'writing_id' => $writing->id,
    'student_id' => $student->id,
]);
```

### 15.2 Running Tests

```bash
php artisan test
php artisan test --filter=SubmissionTest
```
