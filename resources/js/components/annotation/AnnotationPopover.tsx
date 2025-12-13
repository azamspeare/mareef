import { useState } from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnnotationColorPicker } from './AnnotationColorPicker';
import { generateAnnotationId, type Annotation, type AnnotationColor } from './types';

interface AnnotationPopoverProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    position: { x: number; y: number };
    selectionRange: { start: number; end: number } | null;
    onSave: (annotation: Annotation) => void;
    onColorChange?: (color: AnnotationColor) => void;
}

export function AnnotationPopover({
    open,
    onOpenChange,
    position,
    selectionRange,
    onSave,
    onColorChange,
}: AnnotationPopoverProps) {
    const [color, setColor] = useState<AnnotationColor>('suggestion');
    const [comment, setComment] = useState('');

    // Check if comment is required (only "praise" can skip comment)
    const isCommentRequired = color !== 'praise';
    const canSave = selectionRange && (!isCommentRequired || comment.trim());

    const handleColorChange = (newColor: AnnotationColor) => {
        setColor(newColor);
        onColorChange?.(newColor);
    };

    const handleSave = () => {
        if (!selectionRange || (isCommentRequired && !comment.trim())) return;

        const annotation: Annotation = {
            id: generateAnnotationId(),
            startOffset: selectionRange.start,
            endOffset: selectionRange.end,
            color,
            comment: comment.trim(),
            createdAt: new Date().toISOString(),
        };

        onSave(annotation);
        handleClose();
    };

    const handleClose = () => {
        setComment('');
        setColor('suggestion');
        onOpenChange(false);
    };

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverAnchor
                style={{
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                    width: 0,
                    height: 0,
                }}
            />
            <PopoverContent
                className="w-80"
                side="top"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Highlight color:</p>
                        <AnnotationColorPicker value={color} onChange={handleColorChange} />
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground mb-1">
                            Comment{!isCommentRequired && ' (optional)'}:
                        </p>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add your comment..."
                            className="min-h-[80px] resize-none"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={!canSave}>
                            {color === 'praise' && !comment.trim() ? 'Add Highlight' : 'Add Comment'}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
