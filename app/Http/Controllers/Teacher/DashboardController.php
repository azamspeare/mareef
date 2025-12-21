<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher;

use App\Filters\Submission\SubmissionFilter;
use App\Http\Controllers\Controller;
use App\Queries\Submission\SubmissionFindForListQuery;
use App\Repositories\MetricsRepository;
use App\Repositories\SubmissionsRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, MetricsRepository $metricsRepository, SubmissionsRepository $submissionsRepository, SubmissionFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = SubmissionFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Teacher/Home', [
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
