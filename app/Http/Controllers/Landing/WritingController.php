<?php

declare(strict_types=1);

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use App\Queries\User\TeacherFindByUsernameQuery;
use App\Queries\Writing\WritingFindBySlugQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class WritingController extends Controller
{
    public function __construct(
        protected TeacherFindByUsernameQuery $teacherQuery,
        protected WritingFindBySlugQuery $writingQuery
    ) {
    }

    public function create(Request $request, string $handle, string $slug): Response
    {
        $teacher = $this->teacherQuery->query(['username' => $handle]);
        if (! $teacher) {
            abort(404);
        }

        $writing = $this->writingQuery->query(['slug' => $slug, 'teacher_id' => $teacher->id]);
        if (! $writing) {
            abort(404);
        }

        return Inertia::render('WritingTask', [
            'writing' => $writing,
        ]);
    }
}
