import type { Role } from '../enums';

/**
 * Base User model matching backend User model
 */
export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    phone_number: string | null;
    email_verified_at: string | null;
    last_login_at: string | null;
    role: Role;
    avatar: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * User for list views (minimal fields)
 */
export interface UserListItem {
    id: number;
    name: string;
    email: string;
    username: string;
    avatar: string | null;
}

/**
 * Student type (alias for clarity)
 */
export interface Student extends UserListItem {
    created_at: string;
}

/**
 * Teacher type (alias for clarity)
 */
export interface Teacher extends UserListItem {}

/**
 * Authenticated user data returned from backend
 */
export interface AuthUser {
    id: number;
    name: string;
    email: string;
    username: string;
    avatar: string | null;
    role: Role;
}
