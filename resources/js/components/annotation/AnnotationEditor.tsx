import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnnotationPopover } from './AnnotationPopover';
import { AnnotationEditPopover } from './AnnotationEditPopover';
import { AnnotationComment } from './AnnotationComment';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { ANNOTATION_COLORS, type Annotation } from './types';

interface AnnotationEditorProps {
    text: string;
    annotations: Annotation[];
    isEditable: boolean;
    onAddAnnotation: (annotation: Annotation) => void;
    onUpdateAnnotation: (id: string, updates: Partial<Annotation>) => void;
    onRemoveAnnotation: (id: string) => void;
    drawerOpen: boolean;
    onDrawerOpenChange: (open: boolean) => void;
}

interface TextSegment {
    text: string;
    start: number;
    end: number;
    annotations: Annotation[];
}

function buildSegments(text: string, annotations: Annotation[]): TextSegment[] {
    if (annotations.length === 0) {
        return [{ text, start: 0, end: text.length, annotations: [] }];
    }

    // Collect all boundary points
    const boundaries = new Set<number>([0, text.length]);
    for (const ann of annotations) {
        boundaries.add(Math.max(0, ann.startOffset));
        boundaries.add(Math.min(text.length, ann.endOffset));
    }

    const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
    const segments: TextSegment[] = [];

    for (let i = 0; i < sortedBoundaries.length - 1; i++) {
        const start = sortedBoundaries[i];
        const end = sortedBoundaries[i + 1];

        // Find annotations that cover this segment
        const coveringAnnotations = annotations.filter(
            (ann) => ann.startOffset <= start && ann.endOffset >= end
        );

        segments.push({
            text: text.slice(start, end),
            start,
            end,
            annotations: coveringAnnotations,
        });
    }

    return segments;
}

export function AnnotationEditor({
    text,
    annotations,
    isEditable,
    onAddAnnotation,
    onUpdateAnnotation,
    onRemoveAnnotation,
    drawerOpen,
    onDrawerOpenChange,
}: AnnotationEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    // New annotation popover state
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
    const [selectedText, setSelectedText] = useState('');
    const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

    // Edit annotation popover state
    const [editPopoverOpen, setEditPopoverOpen] = useState(false);
    const [editPopoverPosition, setEditPopoverPosition] = useState({ x: 0, y: 0 });
    const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);

    const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

    const segments = useMemo(() => buildSegments(text, annotations), [text, annotations]);

    // Sort annotations by position for drawer
    const sortedAnnotations = useMemo(
        () => [...annotations].sort((a, b) => a.startOffset - b.startOffset),
        [annotations]
    );

    const handleTextMouseUp = useCallback(() => {
        if (!isEditable) return;

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !textRef.current) {
            return;
        }

        const selectionText = selection.toString().trim();
        if (!selectionText) return;

        // Calculate offset within our text content
        const range = selection.getRangeAt(0);
        const preSelectionRange = document.createRange();
        preSelectionRange.selectNodeContents(textRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const startOffset = preSelectionRange.toString().length;
        const endOffset = startOffset + selection.toString().length;

        // Check for overlap with existing annotations
        const hasOverlap = annotations.some(
            (ann) =>
                (startOffset >= ann.startOffset && startOffset < ann.endOffset) ||
                (endOffset > ann.startOffset && endOffset <= ann.endOffset) ||
                (startOffset <= ann.startOffset && endOffset >= ann.endOffset)
        );

        if (hasOverlap) {
            selection.removeAllRanges();
            return;
        }

        // Get position for popover
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (containerRect) {
            setPopoverPosition({
                x: rect.left - containerRect.left,
                y: rect.bottom - containerRect.top + 8,
            });
        }

        setSelectedText(selectionText);
        setSelectionRange({ start: startOffset, end: endOffset });
        setPopoverOpen(true);
    }, [isEditable, annotations]);

    const handleAddAnnotation = useCallback(
        (annotation: Annotation) => {
            onAddAnnotation(annotation);
            setActiveAnnotationId(annotation.id);
            window.getSelection()?.removeAllRanges();
        },
        [onAddAnnotation]
    );

    const handleHighlightClick = useCallback(
        (e: React.MouseEvent, annotation: Annotation) => {
            e.stopPropagation();

            // Get position for edit popover (anchor at top of highlight)
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();

            // If clicking a different annotation while popover is open,
            // close first to ensure proper repositioning
            if (editPopoverOpen && editingAnnotation?.id !== annotation.id) {
                setEditPopoverOpen(false);
                // Use requestAnimationFrame to ensure the close happens before reopening
                requestAnimationFrame(() => {
                    if (containerRect) {
                        setEditPopoverPosition({
                            x: rect.left - containerRect.left,
                            y: rect.top - containerRect.top,
                        });
                    }
                    setEditingAnnotation(annotation);
                    setActiveAnnotationId(annotation.id);
                    setEditPopoverOpen(true);
                });
                return;
            }

            if (containerRect) {
                setEditPopoverPosition({
                    x: rect.left - containerRect.left,
                    y: rect.top - containerRect.top,
                });
            }

            setEditingAnnotation(annotation);
            setActiveAnnotationId(annotation.id);
            setEditPopoverOpen(true);
        },
        [editPopoverOpen, editingAnnotation?.id]
    );

    const scrollToAnnotation = useCallback((annotationId: string) => {
        setActiveAnnotationId(annotationId);
        const element = document.querySelector(`[data-annotation-id="${annotationId}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Clear selection when popover closes
    useEffect(() => {
        if (!popoverOpen) {
            window.getSelection()?.removeAllRanges();
        }
    }, [popoverOpen]);

    // Clear active annotation when edit popover closes
    useEffect(() => {
        if (!editPopoverOpen) {
            setEditingAnnotation(null);
            setActiveAnnotationId(null);
        }
    }, [editPopoverOpen]);

    // Clear active annotation when drawer closes
    useEffect(() => {
        if (!drawerOpen) {
            setActiveAnnotationId(null);
        }
    }, [drawerOpen]);

    return (
        <>
            <div ref={containerRef} className="relative">
                {/* Main text area */}
                <div
                    ref={textRef}
                    className={cn(
                        'prose prose-stone dark:prose-invert max-w-none',
                        'text-base leading-relaxed whitespace-pre-wrap',
                        isEditable && 'cursor-text select-text'
                    )}
                    onMouseUp={handleTextMouseUp}
                >
                    {segments.map((segment, index) => {
                        if (segment.annotations.length === 0) {
                            return <span key={index}>{segment.text}</span>;
                        }

                        // Use the first annotation's color for display
                        const primaryAnnotation = segment.annotations[0];
                        const colorConfig = ANNOTATION_COLORS[primaryAnnotation.color];
                        const isActive = segment.annotations.some(
                            (ann) => ann.id === activeAnnotationId
                        );

                        return (
                            <span
                                key={index}
                                data-annotation-id={primaryAnnotation.id}
                                className={cn(
                                    'cursor-pointer transition-all rounded px-0.5 -mx-0.5 border-b-2',
                                    colorConfig.bg,
                                    colorConfig.border.replace('border-', 'border-b-'),
                                    colorConfig.bgHover,
                                    isActive && 'ring-2 ring-offset-2 ring-offset-background',
                                    isActive && colorConfig.border.replace('border-', 'ring-')
                                )}
                                onClick={(e) => handleHighlightClick(e, primaryAnnotation)}
                            >
                                {segment.text}
                            </span>
                        );
                    })}
                </div>

                {/* New annotation popover */}
                <AnnotationPopover
                    open={popoverOpen}
                    onOpenChange={setPopoverOpen}
                    position={popoverPosition}
                    selectedText={selectedText}
                    selectionRange={selectionRange}
                    onSave={handleAddAnnotation}
                />

                {/* Edit annotation popover */}
                <AnnotationEditPopover
                    key={editingAnnotation?.id ?? 'no-annotation'}
                    annotation={editingAnnotation}
                    open={editPopoverOpen}
                    onOpenChange={setEditPopoverOpen}
                    position={editPopoverPosition}
                    isEditable={isEditable}
                    onUpdate={onUpdateAnnotation}
                    onDelete={onRemoveAnnotation}
                />
            </div>

            {/* Comments Drawer */}
            <Sheet open={drawerOpen} onOpenChange={onDrawerOpenChange}>
                <SheetContent side="left" className="w-[400px] sm:max-w-[400px]">
                    <SheetHeader>
                        <SheetTitle>Comments ({sortedAnnotations.length})</SheetTitle>
                        <SheetDescription>
                            {isEditable
                                ? 'Select text in the response to add comments.'
                                : 'Feedback comments from your teacher.'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        {sortedAnnotations.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No comments yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {sortedAnnotations.map((annotation) => (
                                    <AnnotationComment
                                        key={annotation.id}
                                        annotation={annotation}
                                        isActive={annotation.id === activeAnnotationId}
                                        isEditable={isEditable}
                                        onClick={() => scrollToAnnotation(annotation.id)}
                                        onUpdate={onUpdateAnnotation}
                                        onDelete={onRemoveAnnotation}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
