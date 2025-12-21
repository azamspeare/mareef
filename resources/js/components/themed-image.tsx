import { cn } from '@/lib/utils'
import type { ThemedImage } from '@/lib/images'

interface ThemedImageProps {
  src: ThemedImage
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

/**
 * Image component that automatically switches between light and dark versions
 * based on the current theme. Uses CSS to show/hide the appropriate image.
 */
export function ThemedImage({
  src,
  alt,
  className,
  loading = 'lazy',
  priority = false,
}: ThemedImageProps) {
  return (
    <>
      <img
        src={src.light}
        alt={alt}
        loading={priority ? 'eager' : loading}
        className={cn('dark:hidden', className)}
      />
      <img
        src={src.dark}
        alt={alt}
        loading={priority ? 'eager' : loading}
        className={cn('hidden dark:block', className)}
      />
    </>
  )
}
