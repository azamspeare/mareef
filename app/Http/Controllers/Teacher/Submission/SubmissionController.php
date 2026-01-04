<?php

namespace App\Http\Controllers\Teacher\Submission;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Teacher/Submissions/Index');
    }
}
