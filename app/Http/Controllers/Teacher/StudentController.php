<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher;

use App\Filters\Student\StudentFilter;
use App\Filters\Student\StudentSubmissionFilter;
use App\Http\Controllers\Controller;
use App\Queries\Student\StudentActivityQuery;
use App\Queries\Student\StudentFindByIDQuery;
use App\Queries\Student\StudentFindForListQuery;
use App\Queries\Student\StudentSubmissionFindForListQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class StudentController extends Controller
{
    public function index(Request $request, StudentFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = StudentFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Teacher/Students/Index', [
            'students' => $query->withTrashed()->query($filter),
        ]);
    }

    public function show(Request $request, int $id, StudentFindByIDQuery $studentQuery, StudentSubmissionFindForListQuery $submissionQuery, StudentActivityQuery $activityQuery): Response {
        $teacher = $request->user();

        $request->merge(['student_id' => $id]);
        $filter = StudentSubmissionFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Teacher/Students/Show', [
            'student' => $studentQuery->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]),
            'submissions' => $submissionQuery->query($filter),
            'activity' => $activityQuery->query(['student_id' => $id, 'teacher_id' => $teacher->id, 'days' => 90]),
            'filters' => [
                'status' => $request->input('status', 'all'),
                'page' => (int) $request->input('page', 1),
                'per_page' => (int) $request->input('per_page', 10),
            ],
        ]);
    }
}
