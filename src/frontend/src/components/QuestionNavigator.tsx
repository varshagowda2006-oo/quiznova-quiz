import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface QuestionNavigatorProps {
  /** Total number of questions in the round. */
  total: number;
  /** Index of the question currently on screen. */
  currentIndex: number;
  /** Question ids that already have a selected answer. */
  answeredQuestionIds: ReadonlySet<string>;
  /** Question ids in display order, used to map a grid cell to its answer state. */
  questionIds: readonly string[];
  /** Jump to the question at the given index. */
  onSelect: (index: number) => void;
}

/**
 * A grid of every question number that marks answered vs unanswered questions
 * and lets the player jump directly to any question.
 */
export function QuestionNavigator({
  total,
  currentIndex,
  answeredQuestionIds,
  questionIds,
  onSelect,
}: QuestionNavigatorProps) {
  const answeredCount = questionIds.filter((id) =>
    answeredQuestionIds.has(id),
  ).length;

  return (
    <section
      data-ocid="quiz.navigator"
      aria-label="Question navigator"
      className="rounded-3xl border border-border bg-card/80 p-5 shadow-subtle backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Questions
        </h2>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {answeredCount}/{total} answered
        </span>
      </div>

      <ol className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10 lg:grid-cols-5">
        {questionIds.map((questionId, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = answeredQuestionIds.has(questionId);
          return (
            <li key={questionId}>
              <button
                type="button"
                data-ocid={`quiz.navigator.item.${index + 1}`}
                onClick={() => onSelect(index)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Question ${index + 1}${isAnswered ? ", answered" : ", unanswered"}${
                  isCurrent ? ", current" : ""
                }`}
                className={cn(
                  "relative grid h-11 w-full place-items-center rounded-xl border text-sm font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isCurrent
                    ? "border-primary bg-gradient-primary text-primary-foreground shadow-elevated"
                    : isAnswered
                      ? "border-primary/40 bg-primary/10 text-primary hover:border-primary/70"
                      : "border-border bg-background/60 text-muted-foreground hover:border-accent/60 hover:text-foreground",
                )}
              >
                {index + 1}
                {isAnswered && !isCurrent ? (
                  <Check
                    className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-primary p-0.5 text-primary-foreground"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full bg-gradient-primary"
            aria-hidden="true"
          />
          Current
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full bg-primary/40"
            aria-hidden="true"
          />
          Answered
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full border border-border bg-background"
            aria-hidden="true"
          />
          Unanswered
        </span>
      </div>
    </section>
  );
}
