import { cn } from '@/lib/utils';
import { ANNOTATION_COLORS, type AnnotationColor } from './types';

interface AnnotationColorPickerProps {
    value: AnnotationColor;
    onChange: (color: AnnotationColor) => void;
}

const COLOR_BUTTONS: { color: AnnotationColor; className: string }[] = [
    { color: 'error', className: 'bg-red-500 hover:bg-red-600' },
    { color: 'suggestion', className: 'bg-yellow-500 hover:bg-yellow-600' },
    { color: 'praise', className: 'bg-green-500 hover:bg-green-600' },
    { color: 'neutral', className: 'bg-blue-500 hover:bg-blue-600' },
];

export function AnnotationColorPicker({ value, onChange }: AnnotationColorPickerProps) {
    return (
        <div className="flex items-center gap-2">
            {COLOR_BUTTONS.map(({ color, className }) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className={cn(
                        'h-6 w-6 rounded-full transition-all',
                        className,
                        value === color && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                    )}
                    title={ANNOTATION_COLORS[color].label}
                />
            ))}
            <span className="ml-2 text-xs text-muted-foreground">
                {ANNOTATION_COLORS[value].label}
            </span>
        </div>
    );
}
