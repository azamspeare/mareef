import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Pencil, X, Check } from 'lucide-react';
import { AnnotationColorPicker } from './annotation-color-picker';
import { ANNOTATION_COLORS, type Annotation, type AnnotationColor } from './types';

interface AnnotationCommentProps {
    annotation: Annotation;
    isActive: boolean;
    isEditable: boolean;
    onClick: () => void;
    onUpdate: (id: string, updates: Partial<Annotation>) => void;
    onDelete: (id: string) => void;
}

export function AnnotationComment({
    annotation,
    isActive,
    isEditable,
    onClick,
    onUpdate,
    onDelete,
}: AnnotationCommentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editComment, setEditComment] = useState(annotation.comment);
    const [editColor, setEditColor] = useState<AnnotationColor>(annotation.color);

    const colorConfig = ANNOTATION_COLORS[annotation.color];

    const handleSaveEdit = () => {
        if (!editComment.trim()) return;
        onUpdate(annotation.id, {
            comment: editComment.trim(),
            color: editColor,
        });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditComment(annotation.comment);
        setEditColor(annotation.color);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div
                className={cn(
                    'rounded-lg border p-3 space-y-3',
                    colorConfig.border,
                    colorConfig.bg
                )}
            >
                <AnnotationColorPicker value={editColor} onChange={setEditColor} />
                <Textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="min-h-[60px] resize-none bg-background"
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit} disabled={!editComment.trim()}>
                        <Check className="h-3 w-3 mr-1" />
                        Save
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
            className={cn(
                'rounded-lg border p-3 cursor-pointer transition-all',
                colorConfig.border,
                isActive ? colorConfig.bg : 'bg-background',
                !isActive && colorConfig.bgHover
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <span
                        className={cn(
                            'inline-block text-xs font-medium px-2 py-0.5 rounded mb-1',
                            colorConfig.bg,
                            colorConfig.text
                        )}
                    >
                        {colorConfig.label}
                    </span>
                    <p className="text-sm whitespace-pre-wrap">{annotation.comment}</p>
                </div>
                {isEditable && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(annotation.id);
                            }}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
