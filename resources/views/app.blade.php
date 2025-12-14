@php
    $seo = $page['props']['seo'] ?? [];
    $ogTitle = $seo['title'] ?? 'Mareef - The Task Platform for Language Teachers';
    $ogDescription = $seo['description'] ?? 'Create, share, and evaluate language tasks. Simplify your teaching workflow with Mareef.';
    $ogImage = $seo['image'] ?? '/images/og/welcome.png';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Open Graph / Social Meta Tags -->
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mareef" />
        <meta property="og:title" content="{{ $ogTitle }}" />
        <meta property="og:description" content="{{ $ogDescription }}" />
        <meta property="og:image" content="{{ url($ogImage) }}" />
        <meta property="og:url" content="{{ url()->current() }}" />

        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ $ogTitle }}" />
        <meta name="twitter:description" content="{{ $ogDescription }}" />
        <meta name="twitter:image" content="{{ url($ogImage) }}" />

        <!-- General Meta -->
        <meta name="description" content="{{ $ogDescription }}" />

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

        @production
            <script src="https://cdn.visitors.now/v.js" data-token="{{ env('VISITORS_NOW_TOKEN') }}"></script>
        @endproduction
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
