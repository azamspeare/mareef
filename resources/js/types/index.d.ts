import type { AuthUser } from './models/user';
import type { SharedPageProps } from './api/responses';

/**
 * Generic page props type for Inertia pages
 */
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & SharedPageProps;

/**
 * Re-export for backwards compatibility
 * @deprecated Use AuthUser from '@/types' instead
 */
export type User = AuthUser;
