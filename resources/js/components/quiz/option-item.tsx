import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Circle, CheckCircle2, Square, CheckSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { QuizOption } from '@/types';
import { QuizQuestionType } from '@/types';

interface OptionItemProps {
    option: QuizOption;
    questionType: QuizQuestionType;
    onChange: (updates: Partial<QuizOption>) => void;
    onDelete: () => void;
    canDelete: boolean;
    isLocked?: boolean;
}

export function OptionItem({
    option,
    questionType,
    onChange,
    onDelete,
    canDelete,
    isLocked = false,
}: OptionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: option.id, disabled: isLocked });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isMultiple = questionType === QuizQuestionType.MULTIPLE_CHOICE;

    const CorrectIcon = isMultiple
        ? option.is_correct ? CheckSquare : Square
        : option.is_correct ? CheckCircle2 : Circle;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 ${isDragging ? 'opacity-50' : ''}`}
        >
            {!isLocked && (
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="w-3 h-3" />
                </button>
            )}

            <button
                type="button"
                className={`flex-shrink-0 transition-colors ${
                    option.is_correct
                        ? 'text-green-600'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onChange({ is_correct: !option.is_correct })}
            >
                <CorrectIcon className="w-4 h-4" />
            </button>

            <Input
                type="text"
                placeholder="Option text..."
                className="h-8 text-sm"
                value={option.content}
                onChange={(e) => onChange({ content: e.target.value })}
                disabled={isLocked}
            />

            {canDelete && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={onDelete}
                >
                    <X className="w-3 h-3" />
                </Button>
            )}
        </div>
    );
}
