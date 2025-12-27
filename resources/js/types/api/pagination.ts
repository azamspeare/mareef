/**
 * Laravel pagination links
 */
export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

/**
 * Generic paginated response from Laravel
 */
export interface Paginated<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

/**
 * Simplified paginated response (commonly used)
 */
export interface SimplePaginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

/**
 * Pagination filter params
 */
export interface PaginationParams {
    page?: number;
    per_page?: number;
}
