import { Head, Link, useForm } from "@inertiajs/react";
import { useRef, useState, useEffect, useMemo } from "react";
import { useDraft } from "@/hooks/use-draft";
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
import DashboardLayout from "@/Layouts/DashboardLayout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft, Plus } from "lucide-react";
import { autoResizeTextarea } from "@/lib/block-note";
import { QuestionCard } from "@/components/quiz";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PublishModal } from "@/components/writing/publish-modal";
import type { QuizQuestion, QuizDraft } from "@/types";
import { createEmptyQuestion, QuizQuestionType, hasValidCorrectAnswer } from "@/types";

const DRAFT_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface Quiz {
    id: number;
    title: string;
    description: string;
    allocated_time: string | null;
    questions: Array<{
        id: number;
        type: string;
        content: string;
        order: number;
        point: number;
        options: Array<{
            id: number;
            content: string;
            is_correct: boolean;
            order: number;
        }>;
    }>;
}

interface EditProps {
    quiz: Quiz;
}

export default function Edit({ quiz }: EditProps) {
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const isInitialMount = useRef(true);

    // Draft persistence - unique key per quiz
    const { getInitialValue, saveDraft, clearDraft } = useDraft<QuizDraft>({
        key: `quiz_draft_edit_${quiz.id}`,
        expiryMs: DRAFT_EXPIRY_MS,
    });

    // Transform backend data to frontend format
    const transformQuestions = (): QuizQuestion[] => {
        return quiz.questions
            .sort((a, b) => a.order - b.order)
            .map((q) => ({
                id: String(q.id),
                type: q.type as QuizQuestion['type'],
                content: q.content,
                order: q.order,
                point: q.point,
                options: q.options
                    .sort((a, b) => a.order - b.order)
                    .map((o) => ({
                        id: String(o.id),
                        content: o.content,
                        is_correct: o.is_correct,
                        order: o.order,
                    })),
            }));
    };

    // Get saved draft or use backend data as default
    const savedDraft = useMemo(() => getInitialValue({
        title: quiz.title,
        description: quiz.description,
        questions: transformQuestions(),
        allocated_time: quiz.allocated_time,
    }), [quiz.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const [questions, setQuestions] = useState<QuizQuestion[]>(savedDraft.questions);

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        questionId: string | null;
    }>({
        open: false,
        questionId: null,
    });

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const { data, setData, put, processing, transform, errors } = useForm({
        title: savedDraft.title,
        description: savedDraft.description,
        allocated_time: savedDraft.allocated_time,
    });

    const getQuestionErrors = (index: number): Record<string, string> => {
        const questionErrors: Record<string, string> = {};
        const prefix = `questions.${index}.`;

        Object.entries(errors).forEach(([key, message]) => {
            if (key.startsWith(prefix)) {
                const field = key.substring(prefix.length);
                questionErrors[field] = message;
            }
        });

        return questionErrors;
    };

    // Auto-resize textareas on initial load
    useEffect(() => {
        if (titleRef.current && data.title) {
            autoResizeTextarea(titleRef.current);
        }
        if (descriptionRef.current && data.description) {
            autoResizeTextarea(descriptionRef.current);
        }
    }, []);

    // Save draft when data or questions change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        saveDraft({
            title: data.title,
            description: data.description,
            questions,
            allocated_time: data.allocated_time,
        });
    }, [data.title, data.description, data.allocated_time, questions, saveDraft]);

    // Close publish modal when there are validation errors
    useEffect(() => {
        if (hasSubmitted && Object.keys(errors).length > 0) {
            setIsPublishModalOpen(false);
        }
    }, [errors, hasSubmitted]);

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
            setQuestions((items) => {
                const oldIndex = items.findIndex((q) => q.id === active.id);
                const newIndex = items.findIndex((q) => q.id === over.id);

                return arrayMove(items, oldIndex, newIndex).map((q, index) => ({
                    ...q,
                    order: index + 1,
                }));
            });
        }
    };

    const handleAddQuestion = () => {
        const lastQuestionType = questions.length > 0
            ? questions[questions.length - 1].type
            : QuizQuestionType.SINGLE_CHOICE;

        const newQuestion = createEmptyQuestion(questions.length + 1, lastQuestionType);
        setQuestions([...questions, newQuestion]);
    };

    const handleUpdateQuestion = (updatedQuestion: QuizQuestion) => {
        setQuestions(
            questions.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            )
        );
    };

    const handleDeleteQuestion = (questionId: string) => {
        setDeleteConfirm({ open: true, questionId });
    };

    const confirmDeleteQuestion = () => {
        if (deleteConfirm.questionId) {
            setQuestions(
                questions
                    .filter((q) => q.id !== deleteConfirm.questionId)
                    .map((q, index) => ({ ...q, order: index + 1 }))
            );
        }
        setDeleteConfirm({ open: false, questionId: null });
    };

    const handleUpdateClick = () => {
        setIsPublishModalOpen(true);
    };

    const handleUpdate = (timeLimit: string | null) => {
        setHasSubmitted(true);

        // Helper to check if ID is from backend (numeric) vs frontend-generated (UUID)
        const getExistingId = (id: string): number | undefined => {
            const numId = parseInt(id, 10);
            return !isNaN(numId) ? numId : undefined;
        };

        transform((formData) => ({
            ...formData,
            allocated_time: timeLimit,
            questions: questions.map((q) => ({
                id: getExistingId(q.id),
                type: q.type,
                content: q.content,
                order: q.order,
                point: q.point,
                options: q.options.map((o) => ({
                    id: getExistingId(o.id),
                    content: o.content,
                    is_correct: o.is_correct,
                    order: o.order,
                })),
            })),
        }));

        put(route('quizzes.update', quiz.id), {
            onSuccess: () => {
                clearDraft();
                setIsPublishModalOpen(false);
            },
        });
    };

    const isValid = data.title && questions.length > 0 && questions.every(
        (q) => q.content.trim() !== '' && hasValidCorrectAnswer(q)
    );

    return (
        <DashboardLayout title="Edit Quiz">
            <Head title={`Edit: ${quiz.title} - Mareef`} />
            <div className="min-h-screen bg-background text-foreground font-sans">
                <div className="max-w-3xl lg:max-w-4xl 2xl:max-w-6xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <header className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <Link href={route('quizzes.show', quiz.id)} className="hover:text-foreground transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <span className="text-sm">Edit your quiz</span>
                        </div>
                        <Button
                            onClick={handleUpdateClick}
                            className="rounded-full px-6"
                            disabled={!isValid || processing}
                        >
                            Update
                        </Button>
                    </header>

                    {/* Main Content */}
                    <main className="pb-16">
                        {/* Title Input */}
                        <textarea
                            ref={titleRef}
                            placeholder="Quiz title..."
                            rows={1}
                            autoFocus
                            className={`w-full overflow-hidden resize-none border-0 bg-transparent text-2xl font-bold leading-tight placeholder:text-muted-foreground focus:outline-none focus:ring-0 md:text-3xl ${
                                errors.title ? 'text-destructive placeholder:text-destructive/50' : ''
                            }`}
                            value={data.title}
                            onInput={() => autoResizeTextarea(titleRef.current)}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-destructive">{errors.title}</p>
                        )}

                        {/* Description Input */}
                        <textarea
                            ref={descriptionRef}
                            placeholder="Add a description..."
                            rows={1}
                            className={`w-full mt-2 overflow-hidden resize-none border-0 bg-transparent text-base leading-relaxed text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 md:text-lg ${
                                errors.description ? 'text-destructive placeholder:text-destructive/50' : ''
                            }`}
                            value={data.description}
                            onInput={() => autoResizeTextarea(descriptionRef.current)}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-destructive">{errors.description}</p>
                        )}

                        {/* Divider */}
                        <div className="mt-8 mb-8 flex justify-center">
                            <div className="w-16 h-px bg-border" />
                        </div>

                        {/* Questions Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Questions
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({questions.length})
                                    </span>
                                </h2>
                            </div>

                            {/* Vertical Questions List */}
                            <div className="flex flex-col gap-4">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={questions.map((q) => q.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {questions.map((question, index) => (
                                            <QuestionCard
                                                key={question.id}
                                                question={question}
                                                index={index}
                                                onUpdate={handleUpdateQuestion}
                                                onDelete={() => handleDeleteQuestion(question.id)}
                                                errors={getQuestionErrors(index)}
                                                showValidation={hasSubmitted}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>

                                {/* Add Question Button */}
                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="text-sm font-medium">Add Question</span>
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
                title="Delete Question"
                description="Are you sure you want to delete this question? This action cannot be undone."
                actionLabel="Delete"
                variant="destructive"
                onConfirm={confirmDeleteQuestion}
            />

            {/* Update Modal */}
            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onPublish={handleUpdate}
                isSubmitting={processing}
                title="Update Quiz"
                description="Update the time limit for this quiz."
                actionLabel="Update Quiz"
                initialTimeLimit={quiz.allocated_time}
            />
        </DashboardLayout>
    );
}
