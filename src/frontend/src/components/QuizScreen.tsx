import { QuestionNavigator } from "@/components/QuestionNavigator";
import { QuizTimer } from "@/components/QuizTimer";
import { SubmitConfirmDialog } from "@/components/SubmitConfirmDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QuizAnswer, QuizQuestion } from "@/types/quiz";
import { ArrowLeft, ArrowRight, Check, Send, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface QuizScreenProps {
  playerName: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  /** Move to a specific question index. */
  onNavigate: (index: number) => void;
  /** Record or change the selected option for a question. */
  onSelectAnswer: (questionId: string, optionId: string) => void;
  /** Score the quiz and move to the results view. */
  onSubmit: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;

/**
 * The quiz-taking screen: one question at a time with a progress indicator,
 * a countdown timer, a jump-to-question navigator, and a submit confirmation.
 */
export function QuizScreen({
  playerName,
  questions,
  currentIndex,
  answers,
  onNavigate,
  onSelectAnswer,
  onSubmit,
}: QuizScreenProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const answerByQuestionId = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const answer of answers)
      map.set(answer.questionId, answer.selectedOptionId);
    return map;
  }, [answers]);

  const answeredQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const answer of answers) {
      if (answer.selectedOptionId) ids.add(answer.questionId);
    }
    return ids;
  }, [answers]);

  const answeredCount = answeredQuestionIds.size;
  const progressValue = total > 0 ? (answeredCount / total) * 100 : 0;

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setConfirmOpen(false);
    onSubmit();
  }, [onSubmit]);

  const handleExpire = useCallback(() => {
    if (submitted) return;
    handleSubmit();
  }, [submitted, handleSubmit]);

  if (!question) return null;

  const selectedOptionId = answerByQuestionId.get(question.id) ?? null;

  return (
    <section
      data-ocid="quiz.section"
      aria-labelledby="quiz-heading"
      className="w-full max-w-5xl animate-fade-in-up"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Player
          </p>
          <h1
            id="quiz-heading"
            className="truncate font-display text-2xl font-bold tracking-tight md:text-3xl"
          >
            {playerName}
          </h1>
        </div>
        <QuizTimer onExpire={handleExpire} paused={submitted} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-3xl border border-border bg-card/90 p-5 shadow-elevated backdrop-blur-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Question {currentIndex + 1} of {total}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {answeredCount} answered
            </span>
          </div>

          <Progress
            data-ocid="quiz.progress"
            value={progressValue}
            aria-label={`Quiz progress: ${answeredCount} of ${total} answered`}
            className="mt-4 h-2.5 bg-muted"
          />

          <h2 className="mt-7 font-display text-xl font-bold leading-snug tracking-tight md:text-2xl">
            {question.prompt}
          </h2>

          <fieldset className="mt-6">
            <legend className="sr-only">Choose one answer</legend>
            <div className="grid gap-3">
              {question.options.map((option, index) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    data-ocid={`quiz.option.${index + 1}`}
                    onClick={() => onSelectAnswer(question.id, option.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-5",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-elevated glow-primary"
                        : "border-border bg-background/60 hover:border-accent/60 hover:bg-accent/5",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-base font-bold transition-smooth",
                        isSelected
                          ? "bg-gradient-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {isSelected ? (
                        <Check className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        (OPTION_LABELS[index] ?? index + 1)
                      )}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-base font-medium leading-snug md:text-lg",
                        isSelected ? "text-foreground" : "text-foreground/90",
                      )}
                    >
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              data-ocid="quiz.previous_button"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={isFirst}
              className="h-12 rounded-full border-border px-6 font-semibold sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </Button>

            {isLast ? (
              <Button
                type="button"
                data-ocid="quiz.submit_button"
                onClick={() => setConfirmOpen(true)}
                className="h-12 rounded-full bg-gradient-primary px-7 font-semibold text-primary-foreground shadow-elevated transition-smooth hover:shadow-lift hover:brightness-105 active:scale-[0.98]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit Quiz
              </Button>
            ) : (
              <Button
                type="button"
                data-ocid="quiz.next_button"
                onClick={() => onNavigate(currentIndex + 1)}
                className="h-12 rounded-full bg-gradient-primary px-7 font-semibold text-primary-foreground shadow-elevated transition-smooth hover:shadow-lift hover:brightness-105 active:scale-[0.98]"
              >
                Next
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        <QuestionNavigator
          total={total}
          currentIndex={currentIndex}
          answeredQuestionIds={answeredQuestionIds}
          questionIds={questions.map((item) => item.id)}
          onSelect={onNavigate}
        />
      </div>

      <SubmitConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        answeredCount={answeredCount}
        total={total}
        onConfirm={handleSubmit}
      />
    </section>
  );
}
