import { cn } from '@/lib/utils'

interface MareffLogoProps {
    className?: string
    showText?: boolean
    iconSize?: 'sm' | 'md' | 'lg'
}

export function MareffLogo({ className, showText = true, iconSize = 'md' }: MareffLogoProps) {
    const iconSizes = {
        sm: 'h-6 w-6 text-base',
        md: 'h-8 w-8 text-xl',
        lg: 'h-10 w-10 text-2xl',
    }

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div
                className={cn(
                    'rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold',
                    iconSizes[iconSize]
                )}>
                M
            </div>
            {showText && (
                <span className={cn('font-bold tracking-tight', textSizes[iconSize])}>
                    Mareff
                </span>
            )}
        </div>
    )
}

export function MareffLogoIcon({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl',
                className
            )}>
            M
        </div>
    )
}
