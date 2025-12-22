import { cn } from '@/lib/utils'
import { logo } from '@/lib/images'

interface MareefLogoProps {
    className?: string
    showText?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
}

const sizes = {
    xs: { icon: 'size-6', text: 'text-base' },
    sm: { icon: 'size-7', text: 'text-lg' },
    md: { icon: 'size-8', text: 'text-xl' },
    lg: { icon: 'size-10', text: 'text-2xl' },
}

function LogoIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="600" height="600" className="fill-white dark:fill-zinc-950" rx="100" />
            <circle cx="234" cy="234" r="88" className="fill-black dark:fill-white" />
            <circle cx="300" cy="366" r="88" className="fill-black dark:fill-white" />
            <circle cx="168" cy="366" r="88" className="fill-black dark:fill-white" />
            <circle cx="432" cy="366" r="88" className="fill-black dark:fill-white" />
            <circle cx="366" cy="234" r="88" className="fill-black dark:fill-white" />
        </svg>
    )
}

export function MareefLogo({ className, showText = true, size = 'md' }: MareefLogoProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <LogoIcon className={cn('rounded-md', sizes[size].icon)} />
            {showText && (
                <span className={cn('font-semibold', sizes[size].text)}>
                    Mareef
                </span>
            )}
        </div>
    )
}

export function MareefLogoIcon({ className }: { className?: string }) {
    return <LogoIcon className={cn('size-8 rounded-lg', className)} />
}

/**
 * Teacher logo using bundled/optimized image
 */
export function TeacherLogo({ className, showText = true, size = 'md' }: MareefLogoProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <img
                src={logo.svg}
                alt="Mareef"
                className={cn('rounded-md', sizes[size].icon)}
            />
            {showText && (
                <span className={cn('font-semibold', sizes[size].text)}>
                    Mareef
                </span>
            )}
        </div>
    )
}

export function TeacherLogoIcon({ className }: { className?: string }) {
    return (
        <img
            src={logo.svg}
            alt="Mareef"
            className={cn('size-8 rounded-lg', className)}
        />
    )
}
