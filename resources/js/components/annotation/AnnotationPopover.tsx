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
    selectedText: string;
    selectionRange: { start: number; end: number } | null;
    onSave: (annotation: Annotation) => void;
}

export function AnnotationPopover({
    open,
    onOpenChange,
    position,
    selectedText,
    selectionRange,
    onSave,
}: AnnotationPopoverProps) {
    const [color, setColor] = useState<AnnotationColor>('suggestion');
    const [comment, setComment] = useState('');

    const handleSave = () => {
        if (!selectionRange || !comment.trim()) return;

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
                side="bottom"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Selected text:</p>
                        <p className="text-sm font-medium line-clamp-2 bg-muted/50 px-2 py-1 rounded">
                            "{selectedText}"
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Highlight color:</p>
                        <AnnotationColorPicker value={color} onChange={setColor} />
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Comment:</p>
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
                        <Button size="sm" onClick={handleSave} disabled={!comment.trim()}>
                            Add Comment
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
