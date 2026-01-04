import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptionItem } from './option-item';
import type { QuizOption, QuizQuestionType } from '@/types';
import { createEmptyOption } from '@/types';

interface OptionsEditorProps {
    options: QuizOption[];
    questionType: QuizQuestionType;
    onChange: (options: QuizOption[]) => void;
    allowMultiple: boolean;
    isLocked?: boolean;
}

export function OptionsEditor({
    options,
    questionType,
    onChange,
    allowMultiple,
    isLocked = false,
}: OptionsEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = options.findIndex((o) => o.id === active.id);
            const newIndex = options.findIndex((o) => o.id === over.id);

            const newOptions = arrayMove(options, oldIndex, newIndex).map(
                (option, index) => ({
                    ...option,
                    order: index + 1,
                })
            );

            onChange(newOptions);
        }
    };

    const handleOptionChange = (id: string, updates: Partial<QuizOption>) => {
        const newOptions = options.map((option) => {
            if (option.id === id) {
                return { ...option, ...updates };
            }
            // If not allowing multiple correct and setting this one as correct,
            // unset others
            if (!allowMultiple && updates.is_correct && option.is_correct) {
                return { ...option, is_correct: false };
            }
            return option;
        });
        onChange(newOptions);
    };

    const handleDeleteOption = (id: string) => {
        if (options.length <= 2) return; // Keep at least 2 options
        const newOptions = options
            .filter((o) => o.id !== id)
            .map((option, index) => ({
                ...option,
                order: index + 1,
            }));
        onChange(newOptions);
    };

    const handleAddOption = () => {
        const newOption = createEmptyOption(options.length + 1);
        onChange([...options, newOption]);
    };

    return (
        <div className="space-y-2">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={options.map((o) => o.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={isLocked}
                >
                    {options.map((option) => (
                        <OptionItem
                            key={option.id}
                            option={option}
                            questionType={questionType}
                            onChange={(updates) => handleOptionChange(option.id, updates)}
                            onDelete={() => handleDeleteOption(option.id)}
                            canDelete={options.length > 2 && !isLocked}
                            isLocked={isLocked}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {!isLocked && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground hover:text-foreground"
                    onClick={handleAddOption}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                </Button>
            )}
        </div>
    );
}
