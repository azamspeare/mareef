import { useCallback } from 'react'

interface UseBlockNoteUploadOptions {
  /** The route name for uploading files */
  routeName?: string
  /** Custom headers to include in the request */
  headers?: Record<string, string>
  /** Callback when upload starts */
  onUploadStart?: (file: File) => void
  /** Callback when upload completes */
  onUploadComplete?: (url: string) => void
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void
}

/**
 * Hook that provides a file upload function for BlockNote editor.
 *
 * @example
 * const uploadFile = useBlockNoteUpload()
 *
 * const editor = useCreateBlockNote({
 *   uploadFile,
 * })
 */
export function useBlockNoteUpload(options: UseBlockNoteUploadOptions = {}) {
  const {
    routeName = 'images.store',
    headers = {},
    onUploadStart,
    onUploadComplete,
    onUploadError,
  } = options

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      onUploadStart?.(file)

      const body = new FormData()
      body.append('file', file)

      const csrfToken =
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || ''

      try {
        const response = await fetch(route(routeName), {
          method: 'POST',
          body,
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            ...headers,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to upload file')
        }

        const data = await response.json()
        const url = data.url

        onUploadComplete?.(url)
        return url
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Upload failed')
        onUploadError?.(err)
        throw err
      }
    },
    [routeName, headers, onUploadStart, onUploadComplete, onUploadError]
  )

  return uploadFile
}
