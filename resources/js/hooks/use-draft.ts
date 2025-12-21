import { useCallback, useEffect, useRef } from 'react'
import {
  getLocalStorageValue,
  setLocalStorageValue,
  removeLocalStorageValue,
} from './use-local-storage'

interface UseDraftOptions<T> {
  /** Unique key for localStorage */
  key: string
  /** Time in milliseconds after which the draft expires */
  expiryMs?: number
  /** Fields to exclude from saving (e.g., 'password') */
  excludeFields?: (keyof T)[]
  /** Whether auto-save is enabled */
  enabled?: boolean
}

interface UseDraftReturn<T> {
  /** Get initial value (from localStorage or default) */
  getInitialValue: (defaultValue: T) => T
  /** Save current data to localStorage */
  saveDraft: (data: T) => void
  /** Clear the draft from localStorage */
  clearDraft: () => void
  /** Check if a draft exists */
  hasDraft: () => boolean
}

/**
 * Hook for managing form drafts with localStorage persistence.
 *
 * @example
 * // Basic usage with Inertia useForm
 * const { getInitialValue, saveDraft, clearDraft } = useDraft<FormData>({
 *   key: 'my_form_draft',
 *   expiryMs: 30 * 60 * 1000, // 30 minutes
 *   excludeFields: ['password'],
 * })
 *
 * const { data, setData, post } = useForm(getInitialValue({
 *   name: '',
 *   email: '',
 *   password: '',
 * }))
 *
 * // Auto-save on change
 * useEffect(() => {
 *   saveDraft(data)
 * }, [data.name, data.email])
 *
 * // Clear on success
 * post(route('...'), { onSuccess: clearDraft })
 */
export function useDraft<T extends Record<string, unknown>>(
  options: UseDraftOptions<T>
): UseDraftReturn<T> {
  const { key, expiryMs, excludeFields = [], enabled = true } = options

  const getInitialValue = useCallback(
    (defaultValue: T): T => {
      if (!enabled) return defaultValue

      const saved = getLocalStorageValue<Partial<T>>(key, {}, expiryMs)

      if (Object.keys(saved).length === 0) {
        return defaultValue
      }

      // Merge saved values with defaults, respecting excluded fields
      const merged = { ...defaultValue }
      for (const field of Object.keys(saved) as (keyof T)[]) {
        if (!excludeFields.includes(field) && saved[field] !== undefined) {
          merged[field] = saved[field] as T[keyof T]
        }
      }

      return merged
    },
    [key, expiryMs, excludeFields, enabled]
  )

  const saveDraft = useCallback(
    (data: T) => {
      if (!enabled) return

      // Filter out excluded fields
      const dataToSave: Partial<T> = {}
      for (const field of Object.keys(data) as (keyof T)[]) {
        if (!excludeFields.includes(field)) {
          dataToSave[field] = data[field]
        }
      }

      setLocalStorageValue(key, dataToSave, expiryMs)
    },
    [key, expiryMs, excludeFields, enabled]
  )

  const clearDraft = useCallback(() => {
    removeLocalStorageValue(key)
  }, [key])

  const hasDraft = useCallback((): boolean => {
    if (!enabled) return false

    const saved = getLocalStorageValue<Partial<T>>(key, {}, expiryMs)
    return Object.keys(saved).length > 0
  }, [key, expiryMs, enabled])

  return {
    getInitialValue,
    saveDraft,
    clearDraft,
    hasDraft,
  }
}

/**
 * Hook for auto-saving form data with debouncing.
 *
 * @example
 * const { saveDraft, clearDraft } = useAutoSaveDraft({
 *   key: 'my_form',
 *   data,
 *   dependencies: [data.name, data.email],
 *   excludeFields: ['password'],
 *   debounceMs: 500,
 * })
 */
export function useAutoSaveDraft<T extends Record<string, unknown>>(options: {
  key: string
  data: T
  dependencies: unknown[]
  excludeFields?: (keyof T)[]
  expiryMs?: number
  debounceMs?: number
  enabled?: boolean
}): { clearDraft: () => void } {
  const {
    key,
    data,
    dependencies,
    excludeFields = [],
    expiryMs,
    debounceMs = 0,
    enabled = true,
  } = options

  const isInitialMount = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const clearDraft = useCallback(() => {
    removeLocalStorageValue(key)
  }, [key])

  useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!enabled) return

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce save
    timeoutRef.current = setTimeout(() => {
      const dataToSave: Partial<T> = {}
      for (const field of Object.keys(data) as (keyof T)[]) {
        if (!excludeFields.includes(field)) {
          dataToSave[field] = data[field]
        }
      }
      setLocalStorageValue(key, dataToSave, expiryMs)
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

  return { clearDraft }
}
