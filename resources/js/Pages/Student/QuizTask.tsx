import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button.tsx";
import { ThemeToggle } from "@/components/theme-toggle.tsx";
import { Clock, ScanFace, GraduationCap, ClipboardList, ChevronLeft, ChevronRight, Check, X, MessageSquare, Trophy, CircleCheck, CircleX } from "lucide-react";
import { ogImages, logo } from "@/lib/images";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner.tsx";
import { FlashToaster } from "@/components/flash-toaster.tsx";
import {
    getLocalStorageValue,
    setLocalStorageValue,
    removeLocalStorageValue,
} from "@/hooks/use-local-storage.ts";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty.tsx";
import { useTimer } from "@/hooks/use-timer.ts";
import { useAutoSave } from "@/hooks/use-auto-save.ts";
import { cn } from "@/lib/utils";
import { QuizQuestionType as QuizQuestionTypeEnum } from "@/types/enums";
import type { QuizTask as Quiz, QuizSubmission as Submission, QuizQuestionStudent } from "@/types";

interface QuizTaskProps {
    quiz: Quiz;
    submission: Submission | null;
}

// Type for storing answers locally
type AnswersMap = Record<number, number[]>; // question_id -> selected option ids

// Get draft answers from localStorage
function getLocalDraft(storageKey: string | null): AnswersMap | null {
    if (!storageKey) return null;
    return getLocalStorageValue<AnswersMap | null>(storageKey, null);
}

// Parse submission answers into AnswersMap
function parseSubmissionAnswers(submission: Submission | null): AnswersMap {
    if (!submission?.answers) return {};
    const map: AnswersMap = {};
    for (const answer of submission.answers) {
        map[answer.question_id] = answer.options || [];
    }
    return map;
}

// Header Component
interface HeaderProps {
    isSaving: boolean;
    isInProgress: boolean;
    isCompleted: boolean;
    formattedTime: string;
    timeColorClass: string;
    timeLeft: number;
    completedSpentTime?: string;
    onFinishClick: () => void;
}

const Header = memo(function Header({
    isSaving,
    isInProgress,
    isCompleted,
    formattedTime,
    timeColorClass,
    timeLeft,
    completedSpentTime,
    onFinishClick,
}: HeaderProps) {
    return (
        <header className="px-4 py-3 border-b border-border bg-card md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <div className="flex items-center justify-between md:justify-start md:gap-3">
                    <div className="flex items-center gap-3">
                        <img src={logo.svg} alt="Mareef" className="h-6 w-6" />
                        <h1 className="text-lg font-bold tracking-tight md:text-xl">Quiz Task</h1>
                    </div>
                    <div className="md:hidden">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        {isSaving && (
                            <span className="text-sm text-muted-foreground">Saving...</span>
                        )}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm ${isInProgress ? timeColorClass : 'bg-muted'}`}>
                            <Clock className="w-4 h-4" />
                            <span>{formattedTime}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>
                        {isInProgress && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={onFinishClick}
                                disabled={timeLeft <= 0}
                                className="relative overflow-hidden group md:size-default"
                            >
                                <span className="relative z-10">Finish</span>
                                <div className="absolute top-0 -left-[100%] w-[50%] h-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 dark:via-black/20 to-transparent animate-shine" />
                            </Button>
                        )}
                        {isCompleted && (
                            <Button variant="outline" size="sm" disabled className="md:size-default">
                                Completed {completedSpentTime && `· ${completedSpentTime}`}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
});

// Login Drawer Component
interface LoginDrawerProps {
    isOpen: boolean;
}

const LoginDrawer = memo(function LoginDrawer({ isOpen }: LoginDrawerProps) {
    const handleGoogleLogin = useCallback(() => {
        window.location.href = route('student.auth.google.redirect');
    }, []);

    const handleManualLogin = useCallback(() => {
        window.location.href = route('student.login');
    }, []);

    const handleRegister = useCallback(() => {
        window.location.href = route('student.register');
    }, []);

    return (
        <Drawer open={isOpen} dismissible={false}>
            <DrawerContent className="max-w-full">
                <DrawerHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-primary/10">
                            <GraduationCap className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <DrawerTitle className="text-2xl mb-2">
                        Ready to Start Your Quiz?
                    </DrawerTitle>
                    <DrawerDescription className="text-base max-w-md mx-auto">
                        Please log in to begin your quiz.
                        This allows us to save your progress and track your performance.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 pb-8">
                    <div className="max-w-sm mx-auto space-y-3">
                        <div className="flex gap-2">
                            <Button className="flex-1" size="default" onClick={handleGoogleLogin}>
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                            <Button className="flex-1" size="default" variant="outline" onClick={handleManualLogin}>
                                <ScanFace className="w-4 h-4 mr-2" />
                                Account
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">or</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full" size="default" onClick={handleRegister}>
                            Register
                        </Button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground max-w-md mx-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Track Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Auto-grading</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span>Save Work</span>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
});

// Empty State Component
interface EmptyStateProps {
    onStart: () => void;
}

const EmptyState = memo(function EmptyState({ onStart }: EmptyStateProps) {
    return (
        <Empty className="h-full border-0">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ClipboardList />
                </EmptyMedia>
                <EmptyTitle>Ready to Begin?</EmptyTitle>
                <EmptyDescription>
                    You haven't started this quiz yet. Click the button below to begin.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={onStart}>
                    Start Quiz
                </Button>
            </EmptyContent>
        </Empty>
    );
});

// Question Option Component
interface QuestionOptionProps {
    option: { id: number; content: string };
    isSelected: boolean;
    isMultiple: boolean;
    disabled: boolean;
    isCompleted: boolean;
    isCorrectOption: boolean;
    onClick: () => void;
}

const QuestionOption = memo(function QuestionOption({
    option,
    isSelected,
    disabled,
    isCompleted,
    isCorrectOption,
    onClick,
}: QuestionOptionProps) {
    // Determine the visual state based on completion status
    const getOptionStyles = () => {
        if (isCompleted) {
            // After submission: show correct/incorrect
            if (isSelected && isCorrectOption) {
                // Selected and correct - green
                return "border-green-500 bg-green-500/10 text-foreground";
            } else if (isSelected && !isCorrectOption) {
                // Selected but incorrect - red
                return "border-red-500 bg-red-500/10 text-foreground";
            } else if (isCorrectOption) {
                // Not selected but was correct - show as correct answer
                return "border-green-500/50 bg-green-500/5 text-foreground";
            }
            return "border-border bg-card opacity-60";
        }

        // During quiz: normal selection behavior
        if (isSelected) {
            return "border-green-500 bg-green-500/10 text-foreground hover:border-green-500 hover:bg-green-500/15";
        }
        return "border-border bg-card hover:border-primary/50 hover:bg-primary/5";
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:cursor-not-allowed",
                getOptionStyles()
            )}
        >
            <span className="text-sm">{option.content}</span>
        </button>
    );
});

// Question Display Component
interface QuestionDisplayProps {
    question: QuizQuestionStudent;
    currentIndex: number;
    totalQuestions: number;
    selectedOptions: number[];
    correctOptionIds: number[];
    isCompleted: boolean;
    isAnswerCorrect: boolean | null;
    disabled: boolean;
    onOptionSelect: (optionId: number) => void;
}

const QuestionDisplay = memo(function QuestionDisplay({
    question,
    currentIndex,
    totalQuestions,
    selectedOptions,
    correctOptionIds,
    isCompleted,
    isAnswerCorrect,
    disabled,
    onOptionSelect,
}: QuestionDisplayProps) {
    const isMultiple = question.type === QuizQuestionTypeEnum.MULTIPLE_CHOICE;

    // Sort options by order
    const sortedOptions = useMemo(() =>
        [...question.options].sort((a, b) => a.order - b.order),
        [question.options]
    );

    // Normalize correct option IDs to numbers for comparison
    const normalizedCorrectIds = useMemo(() =>
        correctOptionIds.map(id => Number(id)),
        [correctOptionIds]
    );

    // Check if an option is correct
    const isOptionCorrect = useCallback((optionId: number) =>
        normalizedCorrectIds.includes(Number(optionId)),
        [normalizedCorrectIds]
    );

    // Get correct option labels for feedback
    const correctOptionsLabels = useMemo(() => {
        if (!isCompleted || normalizedCorrectIds.length === 0) return [];
        return question.options
            .filter(opt => isOptionCorrect(opt.id))
            .map(opt => opt.content);
    }, [isCompleted, normalizedCorrectIds, question.options, isOptionCorrect]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                        Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {question.point} {question.point === 1 ? 'point' : 'points'}
                    </span>
                </div>
                {isMultiple && !isCompleted && (
                    <p className="text-xs text-muted-foreground mb-2">
                        Select all that apply
                    </p>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-medium leading-relaxed">
                    {question.content}
                </h2>
            </div>

            <div className="space-y-2">
                {sortedOptions.map((option) => (
                    <QuestionOption
                        key={option.id}
                        option={option}
                        isSelected={selectedOptions.includes(option.id)}
                        isMultiple={isMultiple}
                        disabled={disabled}
                        isCompleted={isCompleted}
                        isCorrectOption={isOptionCorrect(option.id)}
                        onClick={() => onOptionSelect(option.id)}
                    />
                ))}
            </div>

            {/* Feedback after submission */}
            {isCompleted && isAnswerCorrect !== null && (
                <div className={cn(
                    "mt-4 px-3 py-2.5 rounded-md flex items-start gap-2.5",
                    isAnswerCorrect
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-red-500/10 border border-red-500/20"
                )}>
                    {isAnswerCorrect ? (
                        <>
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Correct! You answered this question correctly.
                            </p>
                        </>
                    ) : (
                        <>
                            <X className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm">
                                <span className="text-red-600 dark:text-red-400">Incorrect.</span>{' '}
                                <span className="text-muted-foreground">
                                    The correct answer{correctOptionsLabels.length > 1 ? 's were' : ' was'}:{' '}
                                </span>
                                <span className="font-medium text-foreground">
                                    {correctOptionsLabels.join(', ')}
                                </span>
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

// Question Pagination Component
interface QuestionPaginationProps {
    questions: QuizQuestionStudent[];
    currentIndex: number;
    answers: AnswersMap;
    onQuestionSelect: (index: number) => void;
    onPrevious: () => void;
    onNext: () => void;
}

const QuestionPagination = memo(function QuestionPagination({
    questions,
    currentIndex,
    answers,
    onQuestionSelect,
    onPrevious,
    onNext,
}: QuestionPaginationProps) {
    return (
        <div className="border-t border-border bg-card px-4 py-4 md:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back
                    </Button>

                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        {questions.map((question, index) => {
                            const hasAnswer = answers[question.id]?.length > 0;
                            const isActive = index === currentIndex;

                            return (
                                <button
                                    key={question.id}
                                    onClick={() => onQuestionSelect(index)}
                                    className={cn(
                                        "w-8 h-8 rounded-md text-sm font-medium transition-all",
                                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : hasAnswer
                                            ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    )}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onNext}
                        disabled={currentIndex === questions.length - 1}
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
});

// Feedback Panel Component
interface FeedbackPanelProps {
    score: number;
    totalPoints: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    feedback: string | null;
}

const FeedbackPanel = memo(function FeedbackPanel({
    score,
    totalPoints,
    totalQuestions,
    correctCount,
    incorrectCount,
    feedback,
}: FeedbackPanelProps) {
    const scorePercentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    return (
        <div className="bg-card border border-border rounded-lg p-5 space-y-5">
            {/* Score Section */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                    <Trophy className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">
                    {score} / {totalPoints}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    {scorePercentage}% Score
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-lg font-semibold text-foreground">{totalQuestions}</div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <div className="flex items-center justify-center gap-1">
                        <CircleCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">{correctCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-500/10">
                    <div className="flex items-center justify-center gap-1">
                        <CircleX className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-lg font-semibold text-red-600 dark:text-red-400">{incorrectCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Incorrect</p>
                </div>
            </div>

            {/* Teacher Feedback Section */}
            {feedback && (
                <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-foreground">Teacher Feedback</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {feedback}
                    </p>
                </div>
            )}
        </div>
    );
});

// Main Component
export default function QuizTask({ quiz, submission }: QuizTaskProps) {
    const { props } = usePage<{
        auth?: { user?: any };
    }>();

    const isAuthenticated = !!props.auth?.user;
    const hasStarted = !!submission;
    const isCompleted = submission?.status === 'completed';
    const isInProgress = submission?.status === 'in_progress';

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(!isAuthenticated);
    const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

    // Storage key uses submission.id to be student-specific
    const storageKey = submission?.id ? `quiz_draft_${submission.id}` : null;

    // Initialize answers from localStorage or submission
    const initialAnswers = useMemo(() => {
        const localDraft = getLocalDraft(storageKey);
        if (localDraft) return localDraft;
        return parseSubmissionAnswers(submission);
    }, [submission, storageKey]);

    const [answers, setAnswers] = useState<AnswersMap>(initialAnswers);

    // Questions sorted by order
    const sortedQuestions = useMemo(
        () => [...quiz.questions].sort((a, b) => a.order - b.order),
        [quiz.questions]
    );

    const currentQuestion = sortedQuestions[currentQuestionIndex];

    // Use custom timer hook
    const { timeLeft, formattedTime, timeColorClass, spentTime } = useTimer({
        allocatedTime: quiz.allocated_time,
        startedAt: submission?.created_at,
        isActive: isInProgress,
        onTimeUp: useCallback(() => {
            toast.error("Time's up! Submitting your quiz automatically.");
        }, []),
    });

    // Get auto-save payload
    const getAutoSavePayload = useCallback(() => ({
        quiz_id: quiz.id,
        answers: answers,
    }), [quiz.id, answers]);

    // Use custom auto-save hook (5 minutes = 300000ms)
    const { isSaving, markDirty } = useAutoSave({
        isActive: isInProgress,
        interval: 300000,
        routeName: 'student.tasks.submissions.quiz.save',
        getPayload: getAutoSavePayload,
    });

    // Update drawer state when authentication changes
    useEffect(() => {
        setIsLoginDrawerOpen(!isAuthenticated);
    }, [isAuthenticated]);

    // Sync answers when submission changes
    useEffect(() => {
        if (!submission) return;

        const localDraft = getLocalDraft(storageKey);
        if (localDraft) {
            setAnswers(localDraft);
            return;
        }

        setAnswers(parseSubmissionAnswers(submission));
    }, [submission?.id, submission?.status, storageKey]);

    // Handle option selection
    const handleOptionSelect = useCallback((optionId: number) => {
        if (!currentQuestion || !isInProgress) return;

        const isMultiple = currentQuestion.type === QuizQuestionTypeEnum.MULTIPLE_CHOICE;
        const questionId = currentQuestion.id;

        setAnswers((prev) => {
            const currentSelected = prev[questionId] || [];
            let newSelected: number[];

            if (isMultiple) {
                // Toggle selection for multiple choice
                if (currentSelected.includes(optionId)) {
                    newSelected = currentSelected.filter((id) => id !== optionId);
                } else {
                    newSelected = [...currentSelected, optionId];
                }
            } else {
                // Single selection - replace
                newSelected = [optionId];
            }

            const newAnswers = { ...prev, [questionId]: newSelected };

            // Save to localStorage
            if (storageKey) {
                setLocalStorageValue(storageKey, newAnswers);
            }

            return newAnswers;
        });

        markDirty();
    }, [currentQuestion, isInProgress, storageKey, markDirty]);

    // Navigation handlers
    const handlePrevious = useCallback(() => {
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const handleNext = useCallback(() => {
        setCurrentQuestionIndex((prev) => Math.min(sortedQuestions.length - 1, prev + 1));
    }, [sortedQuestions.length]);

    const handleQuestionSelect = useCallback((index: number) => {
        setCurrentQuestionIndex(index);
    }, []);

    // Start the task
    const handleStart = useCallback(() => {
        router.post(route('student.tasks.submissions.quiz.start'), {
            quiz_id: quiz.id,
        });
    }, [quiz.id]);

    // Open the finish confirmation dialog
    const handleFinishClick = useCallback(() => {
        setIsFinishDialogOpen(true);
    }, []);

    // Finish the task
    const handleFinish = useCallback(() => {
        if (timeLeft <= 0 && !isInProgress) return;

        setIsFinishDialogOpen(false);
        router.post(route('student.tasks.submissions.quiz.finish'), {
            quiz_id: quiz.id,
            answers: answers,
            spent_time: spentTime,
        }, {
            onSuccess: () => {
                if (storageKey) {
                    removeLocalStorageValue(storageKey);
                }
            }
        });
    }, [quiz.id, answers, spentTime, timeLeft, isInProgress, storageKey]);

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeLeft <= 0 && isInProgress) {
            handleFinish();
        }
    }, [timeLeft, isInProgress, handleFinish]);

    // Count answered questions
    const answeredCount = useMemo(() => {
        return sortedQuestions.filter((q) => (answers[q.id]?.length || 0) > 0).length;
    }, [sortedQuestions, answers]);

    // Get answer data for current question (for completed submissions)
    const currentQuestionAnswer = useMemo(() => {
        if (!currentQuestion || !submission?.answers) return null;
        return submission.answers.find(a => a.question_id === currentQuestion.id) || null;
    }, [currentQuestion, submission?.answers]);

    // Calculate feedback panel data
    const feedbackData = useMemo(() => {
        if (!isCompleted || !submission?.answers) {
            return null;
        }

        const totalPoints = sortedQuestions.reduce((sum, q) => sum + q.point, 0);
        const correctCount = submission.answers.filter(a => a.is_correct).length;
        const incorrectCount = submission.answers.filter(a => !a.is_correct).length;

        return {
            score: submission.score,
            totalPoints,
            totalQuestions: sortedQuestions.length,
            correctCount,
            incorrectCount,
            feedback: submission.feedback,
        };
    }, [isCompleted, submission, sortedQuestions]);

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <Head>
                <title>Quiz Task</title>
                <meta property="og:title" content={quiz.title || "Quiz Task"} />
                <meta property="og:description" content="Complete your quiz on Mareef." />
                <meta property="og:image" content={ogImages.quizTask} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={ogImages.quizTask} />
            </Head>

            <Header
                isSaving={isSaving}
                isInProgress={isInProgress}
                isCompleted={isCompleted}
                formattedTime={formattedTime}
                timeColorClass={timeColorClass}
                timeLeft={timeLeft}
                completedSpentTime={submission?.spent_time ?? undefined}
                onFinishClick={handleFinishClick}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {!hasStarted && isAuthenticated ? (
                    <EmptyState onStart={handleStart} />
                ) : hasStarted ? (
                    <>
                        {/* Question Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className={cn(
                                "min-h-full p-6 flex items-center justify-center",
                                feedbackData ? "flex-col lg:flex-row gap-6" : ""
                            )}>
                                {/* Feedback Panel - Top on mobile, Left on desktop */}
                                {feedbackData && (
                                    <div className="w-full lg:w-80 shrink-0">
                                        <FeedbackPanel
                                            score={feedbackData.score}
                                            totalPoints={feedbackData.totalPoints}
                                            totalQuestions={feedbackData.totalQuestions}
                                            correctCount={feedbackData.correctCount}
                                            incorrectCount={feedbackData.incorrectCount}
                                            feedback={feedbackData.feedback}
                                        />
                                    </div>
                                )}

                                {/* Questions */}
                                <div className={cn(
                                    feedbackData ? "w-full lg:max-w-2xl" : ""
                                )}>
                                    {currentQuestion && (
                                        <QuestionDisplay
                                            question={currentQuestion}
                                            currentIndex={currentQuestionIndex}
                                            totalQuestions={sortedQuestions.length}
                                            selectedOptions={answers[currentQuestion.id] || []}
                                            correctOptionIds={currentQuestionAnswer?.correct_options || []}
                                            isCompleted={isCompleted}
                                            isAnswerCorrect={isCompleted ? (currentQuestionAnswer?.is_correct ?? null) : null}
                                            disabled={!isInProgress}
                                            onOptionSelect={handleOptionSelect}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <QuestionPagination
                            questions={sortedQuestions}
                            currentIndex={currentQuestionIndex}
                            answers={answers}
                            onQuestionSelect={handleQuestionSelect}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                        />
                    </>
                ) : (
                    <div className="flex-1" />
                )}
            </div>

            <LoginDrawer isOpen={isLoginDrawerOpen} />

            {/* Finish Confirmation Dialog */}
            <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit your quiz?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to finish and submit your quiz?
                            This action cannot be undone, and you won't be able to make
                            any further changes after submission.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Time remaining: {formattedTime}</span>
                        </div>
                        <div>
                            Answered: {answeredCount} / {sortedQuestions.length}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFinishDialogOpen(false)}>
                            Continue Quiz
                        </Button>
                        <Button onClick={handleFinish}>
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <FlashToaster />
            <Toaster position="bottom-center" />
        </div>
    );
}
