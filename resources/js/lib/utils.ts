import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTeacherUrl(path: string = ''): string {
  const domain = import.meta.env.VITE_APP_TEACHER_DOMAIN
  if (!domain) return '#'
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  const normalizedPath = path.startsWith('/') ? path : path ? `/${path}` : ''
  return `${protocol}//${domain}${normalizedPath}`
}

export function getContactUrl(): string {
  return 'https://t.me/mareef_support'
}
