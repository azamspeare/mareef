import { useState, useEffect, useCallback } from 'react'

interface UseLocalStorageOptions<T> {
  /** Time in milliseconds after which the stored value expires */
  expiryMs?: number
  /** Function to transform the value before storing */
  serialize?: (value: T) => string
  /** Function to transform the stored string back to value */
  deserialize?: (value: string) => T
}

interface StoredValue<T> {
  value: T
  savedAt: number
}

/**
 * Hook for managing localStorage with SSR safety, optional expiry, and type safety.
 *
 * @example
 * // Basic usage
 * const [name, setName, removeName] = useLocalStorage('user_name', '')
 *
 * @example
 * // With expiry (30 minutes)
 * const [draft, setDraft, clearDraft] = useLocalStorage('form_draft', null, {
 *   expiryMs: 30 * 60 * 1000
 * })
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { expiryMs, serialize, deserialize } = options

  // Get stored value with expiry check
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = localStorage.getItem(key)
      if (!item) return initialValue

      if (expiryMs) {
        // With expiry: stored as { value, savedAt }
        const stored: StoredValue<T> = JSON.parse(item)
        const now = Date.now()

        if (now - stored.savedAt > expiryMs) {
          localStorage.removeItem(key)
          return initialValue
        }

        return deserialize ? deserialize(JSON.stringify(stored.value)) : stored.value
      }

      // Without expiry: stored directly
      return deserialize ? deserialize(item) : JSON.parse(item)
    } catch {
      return initialValue
    }
  }, [key, initialValue, expiryMs, deserialize])

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  // Update state when key changes
  useEffect(() => {
    setStoredValue(getStoredValue())
  }, [key, getStoredValue])

  // Set value to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window === 'undefined') return

        const serialized = serialize
          ? serialize(valueToStore)
          : JSON.stringify(valueToStore)

        if (expiryMs) {
          // With expiry: wrap in { value, savedAt }
          const wrapped: StoredValue<T> = {
            value: valueToStore,
            savedAt: Date.now(),
          }
          localStorage.setItem(key, JSON.stringify(wrapped))
        } else {
          localStorage.setItem(key, serialized)
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue, expiryMs, serialize]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Simple helper to get a value from localStorage without reactivity.
 * Useful for initial values in forms.
 */
export function getLocalStorageValue<T>(
  key: string,
  defaultValue: T,
  expiryMs?: number
): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    if (expiryMs) {
      const stored: StoredValue<T> = JSON.parse(item)
      const now = Date.now()

      if (now - stored.savedAt > expiryMs) {
        localStorage.removeItem(key)
        return defaultValue
      }

      return stored.value
    }

    return JSON.parse(item)
  } catch {
    return defaultValue
  }
}

/**
 * Simple helper to set a value in localStorage.
 */
export function setLocalStorageValue<T>(
  key: string,
  value: T,
  expiryMs?: number
): void {
  if (typeof window === 'undefined') return

  try {
    if (expiryMs) {
      const wrapped: StoredValue<T> = {
        value,
        savedAt: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(wrapped))
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error)
  }
}

/**
 * Simple helper to remove a value from localStorage.
 */
export function removeLocalStorageValue(key: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
  }
}
