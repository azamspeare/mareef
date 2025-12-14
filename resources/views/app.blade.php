<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

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
