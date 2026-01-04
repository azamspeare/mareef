import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OptionsEditor } from './options-editor';
import type { QuizQuestion, QuizOption } from '@/types';
import {
    QuizQuestionType,
    QuizQuestionTypeLabels,
    getQuizQuestionTypes,
} from '@/types';
import {
    hasOptions,
    allowsMultipleCorrect,
    createTrueFalseOptions,
    createEmptyOption,
    getCorrectAnswerError,
} from '@/types';

interface QuestionCardProps {
    question: QuizQuestion;
    index: number;
    onUpdate: (question: QuizQuestion) => void;
    onDelete: () => void;
    errors?: Record<string, string>;
    showValidation?: boolean;
}

export function QuestionCard({
    question,
    index,
    onUpdate,
    onDelete,
    errors = {},
    showValidation = false,
}: QuestionCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleTypeChange = (type: QuizQuestionType) => {
        let options = question.options;
        const prevType = question.type;

        // Reset options based on type change
        if (type === QuizQuestionType.TRUE_FALSE) {
            options = createTrueFalseOptions();
        } else if (prevType === QuizQuestionType.TRUE_FALSE) {
            // Switching from true/false to other type
            options = [
                createEmptyOption(1),
                createEmptyOption(2),
            ];
        } else if (hasOptions(type) && !hasOptions(prevType)) {
            // Switching from non-option to option type
            options = [
                createEmptyOption(1),
                createEmptyOption(2),
            ];
        } else if (!hasOptions(type)) {
            // Switching to non-option type
            options = [];
        }

        // If switching from multiple_choice to single_choice, ensure only one correct
        if (type === QuizQuestionType.SINGLE_CHOICE && prevType === QuizQuestionType.MULTIPLE_CHOICE) {
            const firstCorrectIndex = options.findIndex(o => o.is_correct);
            options = options.map((o, i) => ({
                ...o,
                is_correct: i === firstCorrectIndex,
            }));
        }

        onUpdate({ ...question, type, options });
    };

    const handleContentChange = (content: string) => {
        onUpdate({ ...question, content });
    };

    const handleOptionsChange = (options: QuizOption[]) => {
        onUpdate({ ...question, options });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`w-full bg-card border rounded-lg shadow-sm ${
                isDragging ? 'opacity-50 shadow-lg' : ''
            }`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                    Q{index + 1}
                </span>
                <Select
                    value={question.type}
                    onValueChange={(value) => handleTypeChange(value as QuizQuestionType)}
                >
                    <SelectTrigger size="sm" className="w-36 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {getQuizQuestionTypes().map((type) => (
                            <SelectItem key={type} value={type} className="text-xs">
                                {QuizQuestionTypeLabels[type]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={onDelete}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Question Content */}
            <div className="p-3">
                <textarea
                    placeholder="Enter your question..."
                    className={`w-full min-h-20 resize-none border rounded-md bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                        errors.content ? 'border-destructive' : ''
                    }`}
                    value={question.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                />
                {errors.content && (
                    <p className="mt-1 text-xs text-destructive">{errors.content}</p>
                )}

                {/* Validation Errors - shown between content and options */}
                {hasOptions(question.type) && (errors.options || (showValidation && getCorrectAnswerError(question))) && (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.options || getCorrectAnswerError(question)}
                    </p>
                )}

                {/* Options Section */}
                {hasOptions(question.type) && (
                    <div className="mt-3">
                        <OptionsEditor
                            options={question.options}
                            questionType={question.type}
                            onChange={handleOptionsChange}
                            allowMultiple={allowsMultipleCorrect(question.type)}
                            isLocked={question.type === QuizQuestionType.TRUE_FALSE}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
