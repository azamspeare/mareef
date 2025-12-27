<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Cached Ziggy routes (computed once per deployment)
     */
    private static ?array $ziggyRoutes = null;

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => fn () => [
                'user' => $request->user()?->only(['id', 'name', 'email', 'username', 'avatar', 'role']),
            ],
            'flash' => fn () => [
                'error' => $request->session()->get('error'),
                'success' => $request->session()->get('success'),
                'message' => $request->session()->get('message'),
            ],
            'ziggy' => fn () => [
                ...$this->getZiggyRoutes(),
                'location' => $request->url(),
            ],
            'seo' => fn () => $this->getSeoMeta($request),
        ];
    }

    /**
     * Get SEO meta data based on current route.
     *
     * @return array<string, string>
     */
    private function getSeoMeta(Request $request): array
    {
        $routeName = $request->route()?->getName();
        $path = $request->path();

        // Default meta
        $meta = [
            'title' => 'Mareef - The Task Platform for Language Teachers',
            'description' => 'Create, share, and evaluate language tasks. Simplify your teaching workflow with Mareef.',
            'image' => '/images/og/welcome.png',
        ];

        // Route-specific meta
        $routeMeta = [
            'home' => $meta, // Default
            'pricing' => [
                'title' => 'Pricing - Mareef',
                'description' => 'Simple, transparent pricing for language teachers. Start free, upgrade when you need more.',
                'image' => '/images/og/pricing.png',
            ],
            'tasks.writing' => [
                'title' => 'Writing Tasks - Mareef',
                'description' => 'No more Google Docs chaos. Create, assign, and evaluate writing tasks in one clean workflow.',
                'image' => '/images/og/tasks.png',
            ],
            'tasks.reading' => [
                'title' => 'Reading Tasks - Mareef',
                'description' => 'Build, assign, and auto-grade reading comprehension tasks. No more paper worksheets.',
                'image' => '/images/og/tasks.png',
            ],
            'tasks.listening' => [
                'title' => 'Listening Tasks - Mareef',
                'description' => 'Create structured listening tasks with synced questions. No more audio files in chat.',
                'image' => '/images/og/tasks.png',
            ],
            'tasks.speaking' => [
                'title' => 'Speaking Tasks - Mareef',
                'description' => 'Collect and evaluate student speech with timestamped feedback. No more voice messages in chat.',
                'image' => '/images/og/tasks.png',
            ],
        ];

        // Check for writing task page (dynamic route)
        if (str_starts_with($path, 'w/')) {
            return [
                'title' => 'Writing Task - Mareef',
                'description' => 'Complete your writing task on Mareef.',
                'image' => '/images/og/writing-task.png',
            ];
        }

        return $routeMeta[$routeName] ?? $meta;
    }

    /**
     * Get cached Ziggy routes.
     * Routes are cached in memory for the request lifecycle and in cache for 1 hour.
     */
    private function getZiggyRoutes(): array
    {
        if (self::$ziggyRoutes !== null) {
            return self::$ziggyRoutes;
        }

        self::$ziggyRoutes = Cache::remember('ziggy:routes', 3600, function () {
            return (new Ziggy)->toArray();
        });

        return self::$ziggyRoutes;
    }
}
