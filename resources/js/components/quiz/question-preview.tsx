import { memo, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Circle, Square, Type, AlignLeft } from 'lucide-react';
import type { QuizQuestion, QuizOption } from '@/types';
import { QuizQuestionType, QuizQuestionTypeLabels } from '@/types';

interface QuestionPreviewProps {
    question: QuizQuestion;
    index: number;
}

export const QuestionPreview = memo(function QuestionPreview({ question, index }: QuestionPreviewProps) {
    const isSingleChoice = question.type === QuizQuestionType.SINGLE_CHOICE || question.type === QuizQuestionType.TRUE_FALSE;

    const sortedOptions = useMemo(() =>
        [...(question.options || [])].sort((a, b) => a.order - b.order),
        [question.options]
    );

    const getTypeIcon = () => {
        switch (question.type) {
            case QuizQuestionType.SINGLE_CHOICE:
            case QuizQuestionType.TRUE_FALSE:
                return <Circle className="w-3.5 h-3.5" />;
            case QuizQuestionType.MULTIPLE_CHOICE:
                return <Square className="w-3.5 h-3.5" />;
            case QuizQuestionType.SHORT_ANSWER:
                return <Type className="w-3.5 h-3.5" />;
            case QuizQuestionType.LONG_ANSWER:
                return <AlignLeft className="w-3.5 h-3.5" />;
            default:
                return null;
        }
    };

    const renderOption = (option: QuizOption) => (
        <div
            key={option.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md border bg-muted/30 border-transparent"
        >
            {isSingleChoice ? (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
                <Square className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm">{option.content}</span>
            {option.is_correct && (
                <Badge className="text-xs ml-auto bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950">
                    Correct
                </Badge>
            )}
        </div>
    );

    const renderAnswerPlaceholder = () => {
        if (question.type === QuizQuestionType.SHORT_ANSWER) {
            return (
                <div className="px-3 py-2 rounded-md border border-dashed bg-muted/20">
                    <span className="text-sm text-muted-foreground italic">Short text answer expected</span>
                </div>
            );
        }

        if (question.type === QuizQuestionType.LONG_ANSWER) {
            return (
                <div className="px-3 py-4 rounded-md border border-dashed bg-muted/20">
                    <span className="text-sm text-muted-foreground italic">Long text answer expected</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-card border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                <span className="text-sm font-semibold text-muted-foreground">
                    Q{index + 1}
                </span>
                <Badge variant="outline" className="text-xs gap-1.5">
                    {getTypeIcon()}
                    {QuizQuestionTypeLabels[question.type]}
                </Badge>
                <div className="flex-1" />
                <Badge variant="secondary" className="text-xs">
                    {question.point} {question.point === 1 ? 'point' : 'points'}
                </Badge>
            </div>

            {/* Question Content */}
            <div className="p-4 space-y-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {question.content}
                </p>

                {/* Options or Answer Placeholder */}
                {sortedOptions.length > 0 ? (
                    <div className="space-y-2">
                        {sortedOptions.map(renderOption)}
                    </div>
                ) : (
                    renderAnswerPlaceholder()
                )}
            </div>
        </div>
    );
});
