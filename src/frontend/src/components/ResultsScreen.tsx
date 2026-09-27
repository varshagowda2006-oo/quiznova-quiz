import { AnswerReview } from "@/components/AnswerReview";
import { ScoreSummary } from "@/components/ScoreSummary";
import { Button } from "@/components/ui/button";
import type { QuizQuestion, QuizResults } from "@/types/quiz";
import { RotateCcw } from "lucide-react";

interface ResultsScreenProps {
  results: QuizResults;
  questions: QuizQuestion[];
  onRestart: () => void;
}

/**
 * Results view for a completed QuizNova round: score summary, answer review,
 * and a retake action that returns to the start screen.
 */
export function ResultsScreen({
  results,
  questions,
  onRestart,
}: ResultsScreenProps) {
  return (
    <div
      data-ocid="results.page"
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 md:gap-8"
    >
      <ScoreSummary results={results} />

      <AnswerReview questions={questions} answers={results.answers} />

      <div className="flex flex-col items-center gap-3 pb-2">
        <Button
          type="button"
          data-ocid="results.retake_button"
          size="lg"
          onClick={onRestart}
          className="h-12 w-full rounded-full bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-elevated transition-smooth hover:shadow-lift hover:brightness-105 active:scale-[0.98] sm:w-auto"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          Retake Quiz
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Starts a fresh round with reshuffled questions — you will enter your
          name again.
        </p>
      </div>
    </div>
  );
}
