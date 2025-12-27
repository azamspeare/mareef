import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMainUrl(path: string = ''): string {
  const domain = import.meta.env.VITE_APP_DOMAIN || 'localhost'
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  const normalizedPath = path.startsWith('/') ? path : path ? `/${path}` : ''
  return `${protocol}//${domain}${normalizedPath}`
}

export function getTeacherUrl(path: string = ''): string {
  const domain = import.meta.env.VITE_APP_TEACHER_DOMAIN
  if (!domain) return '#'
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  const normalizedPath = path.startsWith('/') ? path : path ? `/${path}` : ''
  return `${protocol}//${domain}${normalizedPath}`
}

export function getStudentUrl(path: string = ''): string {
  const domain = import.meta.env.VITE_APP_STUDENT_DOMAIN
  if (!domain) return '#'
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  const normalizedPath = path.startsWith('/') ? path : path ? `/${path}` : ''
  return `${protocol}//${domain}${normalizedPath}`
}

export function getContactUrl(): string {
  return 'https://t.me/mareef_support'
}

export function getTelegramBotUrl(): string {
  return 'https://t.me/mareef_bot'
}

/**
 * Format a time string (HH:MM:SS) to a human-readable format.
 * @example calculateTime("01:30:00") // "90m"
 * @example calculateTime("00:45:30") // "45m 30s"
 */
export function calculateTime(time: string | null): string {
  if (!time) return "No limit";

  const [hours, minutes, seconds] = time.split(":").map(Number);
  if (hours === 0 && minutes === 0) return `${seconds}s`;
  if (hours === 0 && seconds === 0) return `${minutes}m`;
  if (minutes === 0 && seconds === 0) return `${hours * 60}m`;
  if (minutes === 0) return `${hours * 60}m ${seconds}s`;
  return `${hours * 60 + minutes}m ${seconds}s`;
}

/**
 * Format Uzbekistan phone number input.
 * Ensures value starts with +998 and only allows 9 digits after prefix.
 * @example formatUzbekPhone("+998901234567") // "+998901234567"
 * @example formatUzbekPhone("901234567") // "+998901234567"
 */
export function formatUzbekPhone(value: string): string {
  // Ensure it always starts with +998
  if (!value.startsWith('+998')) {
    value = '+998'
  }
  // Only allow digits after +998, max 9 digits
  const digits = value.slice(4).replace(/\D/g, '').slice(0, 9)
  return '+998' + digits
}
