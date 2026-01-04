import type { AuthUser } from '../models/user';

/**
 * Flash messages from Laravel session
 */
export interface FlashMessages {
    success?: string;
    error?: string;
    message?: string;
    info?: string;
    warning?: string;
}

/**
 * Auth props passed to every page via Inertia
 */
export interface AuthProps {
    user: AuthUser | null;
}

/**
 * Base page props shared across all pages
 */
export interface SharedPageProps {
    auth: AuthProps;
    flash: FlashMessages;
    [key: string]: unknown;
}

/**
 * Filters state for list pages
 */
export interface ListFilters {
    status?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
}

/**
 * Activity chart data (date -> count mapping)
 */
export interface ActivityData {
    [date: string]: number;
}

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
    total_writings: number;
    total_students: number;
    total_submissions: number;
    pending_reviews: number;
}

/**
 * Dashboard counts
 */
export interface DashboardCounts {
    total: number;
    not_reviewed: number;
    evaluated: number;
}
