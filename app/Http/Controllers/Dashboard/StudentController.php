<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Filters\Student\StudentFilter;
use App\Http\Controllers\Controller;
use App\Queries\Student\StudentFindForListQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class StudentController extends Controller
{
    public function index(Request $request, StudentFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = StudentFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Students/Index', [
            'students' => $query->query($filter),
        ]);
    }
}
