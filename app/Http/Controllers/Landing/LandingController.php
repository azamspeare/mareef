<?php

declare(strict_types=1);

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class LandingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function welcome(Request $request): Response
    {
        return Inertia::render('Welcome');
    }

    /**
     * Handle the incoming request.
     */
    public function pricing(Request $request): Response
    {
        return Inertia::render('Landing/Pricing');
    }

    /**
     * Handle the incoming request.
     */
    public function listening(Request $request): Response
    {
        return Inertia::render('Landing/Listening');
    }

    /**
     * Handle the incoming request.
     */
    public function reading(Request $request): Response
    {
        return Inertia::render('Landing/Reading');
    }

    /**
     * Handle the incoming request.
     */
    public function writing(Request $request): Response
    {
        return Inertia::render('Landing/Writing');
    }

    /**
     * Handle the incoming request.
     */
    public function speaking(Request $request): Response
    {
        return Inertia::render('Landing/Speaking');
    }
}
