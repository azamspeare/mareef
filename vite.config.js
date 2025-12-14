import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    build: {
        // Increase limit since syntax highlighting grammars are large but lazy-loaded
        chunkSizeWarningLimit: 1000,
        // Use esbuild for minification (faster than terser, included by default)
        minify: 'esbuild',
        rollupOptions: {
            onwarn(warning, warn) {
                // Suppress "__serializeForClipboard" warning from BlockNote/prosemirror-view
                // This is a known compatibility issue that doesn't affect functionality
                if (
                    warning.code === 'MISSING_EXPORT' &&
                    warning.message.includes('__serializeForClipboard')
                ) {
                    return;
                }
                warn(warning);
            },
            output: {
                manualChunks: {
                    // Core vendor chunks - loaded immediately
                    'vendor-react': ['react', 'react-dom'],
                    // Heavy editor chunk - loaded lazily on writing pages
                    'vendor-blocknote': [
                        '@blocknote/core',
                        '@blocknote/react',
                        '@blocknote/mantine',
                    ],
                    // UI component library
                    'vendor-radix': [
                        '@radix-ui/react-accordion',
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-toggle',
                        '@radix-ui/react-toggle-group',
                        '@radix-ui/react-tooltip',
                    ],
                    // Charts - only loaded on dashboard
                    'vendor-charts': ['recharts'],
                    // Inertia - core routing
                    'vendor-inertia': ['@inertiajs/react'],
                },
            },
        },
    },
    // Optimize dependency pre-bundling for faster dev server
    optimizeDeps: {
        include: ['react', 'react-dom', '@inertiajs/react'],
        exclude: ['@blocknote/core', '@blocknote/react', '@blocknote/mantine'],
    },
});
