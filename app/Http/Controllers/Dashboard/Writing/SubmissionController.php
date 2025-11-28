<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard\Writing;

use App\Filters\Submission\SubmissionFilter;
use App\Http\Controllers\Controller;
use App\Queries\Submission\SubmissionFindForListQuery;
use App\Queries\Submission\SubmissionFindByIDQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, SubmissionFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = SubmissionFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Submissions/Index', [
            'submissions' => $query->query($filter),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id, SubmissionFindByIDQuery $query): Response
    {
        $teacher = $request->user();

        return Inertia::render('Submissions/Show', [
            'submission' => $query->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Evaluate a resource in storage.
     */
    public function evaluate(Request $request, int $id)
    {
        //
    }
}
