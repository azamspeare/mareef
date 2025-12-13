import { useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, X, WrapText } from 'lucide-react';
import { AnnotationColorPicker } from './AnnotationColorPicker';
import { ANNOTATION_COLORS, type Annotation, type AnnotationColor } from './types';

interface AnnotationEditPopoverProps {
    annotation: Annotation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    position: { x: number; y: number };
    isEditable: boolean;
    onUpdate: (id: string, updates: Partial<Annotation>) => void;
    onDelete: (id: string) => void;
    text: string;
}

export function AnnotationEditPopover({
    annotation,
    open,
    onOpenChange,
    position,
    isEditable,
    onUpdate,
    onDelete,
    text,
}: AnnotationEditPopoverProps) {
    const [color, setColor] = useState<AnnotationColor>(annotation?.color ?? 'suggestion');
    const [comment, setComment] = useState(annotation?.comment ?? '');

    // Reset state when annotation changes
    if (annotation && (color !== annotation.color || comment !== annotation.comment)) {
        if (annotation.color !== color && !open) setColor(annotation.color);
        if (annotation.comment !== comment && !open) setComment(annotation.comment);
    }

    // Check if annotation has partial word boundaries
    const wordBoundaryInfo = useMemo(() => {
        if (!annotation || !text) return { hasPartialWords: false, expanded: null };

        const { startOffset, endOffset } = annotation;

        // Check if start is in the middle of a word
        const startInMiddle = startOffset > 0 && !/\s/.test(text[startOffset - 1]);
        // Check if end is in the middle of a word
        const endInMiddle = endOffset < text.length && !/\s/.test(text[endOffset]);

        if (!startInMiddle && !endInMiddle) {
            return { hasPartialWords: false, expanded: null };
        }

        // Calculate expanded boundaries
        let wordStart = startOffset;
        while (wordStart > 0 && !/\s/.test(text[wordStart - 1])) {
            wordStart--;
        }

        let wordEnd = endOffset;
        while (wordEnd < text.length && !/\s/.test(text[wordEnd])) {
            wordEnd++;
        }

        return {
            hasPartialWords: true,
            expanded: { start: wordStart, end: wordEnd },
        };
    }, [annotation, text]);

    const handleSnapToWords = () => {
        if (!annotation || !wordBoundaryInfo.expanded) return;
        onUpdate(annotation.id, {
            startOffset: wordBoundaryInfo.expanded.start,
            endOffset: wordBoundaryInfo.expanded.end,
        });
    };

    // Check if comment is required (only "praise" can skip comment)
    const isCommentRequired = color !== 'praise';
    const canSave = !isCommentRequired || comment.trim();

    const handleSave = () => {
        if (!annotation || (isCommentRequired && !comment.trim())) return;
        onUpdate(annotation.id, { color, comment: comment.trim() });
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (!annotation) return;
        onDelete(annotation.id);
        onOpenChange(false);
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    if (!annotation) return null;

    const colorConfig = ANNOTATION_COLORS[annotation.color];

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
                    {isEditable ? (
                        <>
                            {wordBoundaryInfo.hasPartialWords && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSnapToWords}
                                    className="w-full text-xs"
                                >
                                    <WrapText className="h-3 w-3 mr-1.5" />
                                    Snap to full words
                                </Button>
                            )}

                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Highlight color:</p>
                                <AnnotationColorPicker value={color} onChange={setColor} />
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

                            <div className="flex justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSave} disabled={!canSave}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={handleClose}
                                className="absolute -top-1 -right-1 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>
                            <div className="pr-5">
                                <span
                                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded mb-2 ${colorConfig.bg} ${colorConfig.text}`}
                                >
                                    {colorConfig.label}
                                </span>
                                <p className="text-sm whitespace-pre-wrap">{annotation.comment}</p>
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
