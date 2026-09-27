import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizAnswer, QuizQuestion } from "@/types/quiz";
import { CheckCircle2, ChevronDown, CircleHelp, XCircle } from "lucide-react";
import { useState } from "react";

interface AnswerReviewProps {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
}

type AnswerStatus = "correct" | "incorrect" | "unanswered";

interface StatusMeta {
  label: string;
  icon: typeof CheckCircle2;
  badgeClass: string;
  iconClass: string;
}

const STATUS_META: Record<AnswerStatus, StatusMeta> = {
  correct: {
    label: "Correct",
    icon: CheckCircle2,
    badgeClass: "border-primary/40 bg-primary/10 text-primary",
    iconClass: "text-primary",
  },
  incorrect: {
    label: "Incorrect",
    icon: XCircle,
    badgeClass: "border-destructive/40 bg-destructive/10 text-destructive",
    iconClass: "text-destructive",
  },
  unanswered: {
    label: "Unanswered",
    icon: CircleHelp,
    badgeClass: "border-border bg-muted text-muted-foreground",
    iconClass: "text-muted-foreground",
  },
};

function getStatus(answer: QuizAnswer | undefined): AnswerStatus {
  if (!answer || answer.selectedOptionId === null) return "unanswered";
  return answer.isCorrect ? "correct" : "incorrect";
}

/**
 * Collapsible answer review: every question with the player's selection, the
 * correct answer, and a clear correct / incorrect / unanswered indicator.
 */
export function AnswerReview({ questions, answers }: AnswerReviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const answerByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer]),
  );

  return (
    <section
      data-ocid="review.section"
      aria-labelledby="review-title"
      className="w-full animate-fade-in-up rounded-3xl border border-border bg-card/90 p-6 shadow-elevated backdrop-blur-sm md:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="review-title"
            className="font-display text-xl font-bold tracking-tight md:text-2xl"
          >
            Answer Review
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            See how each of the {questions.length} questions was answered.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          data-ocid="review.toggle"
          aria-expanded={isOpen}
          aria-controls="review-list"
          onClick={() => setIsOpen((open) => !open)}
          className="h-11 shrink-0 rounded-full border-border px-5 font-semibold transition-smooth hover:border-primary/50 hover:text-primary"
        >
          {isOpen ? "Hide Review" : "Show Review"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </Button>
      </div>

      {isOpen ? (
        <ol id="review-list" className="mt-6 space-y-4">
          {questions.map((question, index) => {
            const answer = answerByQuestionId.get(question.id);
            const status = getStatus(answer);
            const meta = STATUS_META[status];
            const StatusIcon = meta.icon;
            const selectedOption = question.options.find(
              (option) => option.id === answer?.selectedOptionId,
            );
            const correctOption = question.options.find(
              (option) => option.id === question.correctOptionId,
            );

            return (
              <li
                key={question.id}
                data-ocid={`review.item.${index + 1}`}
                className="animate-fade-in rounded-2xl border border-border bg-background/50 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted font-mono text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <p className="min-w-0 font-display text-base font-semibold leading-snug text-foreground">
                      {question.prompt}
                    </p>
                  </div>
                  <span
                    data-ocid={`review.status.${index + 1}`}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                      meta.badgeClass,
                    )}
                  >
                    <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {meta.label}
                  </span>
                </div>

                <dl className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card/60 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Your Answer
                    </dt>
                    <dd
                      className={cn(
                        "mt-1 text-sm font-medium",
                        status === "unanswered"
                          ? "italic text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {selectedOption ? selectedOption.text : "Not answered"}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Correct Answer
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {correctOption ? correctOption.text : "—"}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}
