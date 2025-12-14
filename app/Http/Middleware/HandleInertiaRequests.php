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
                'user' => $request->user()?->only(['id', 'name', 'email', 'avatar', 'role']),
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
        ];
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
