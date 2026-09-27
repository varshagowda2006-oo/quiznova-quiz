import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QuizResults } from "@/types/quiz";
import {
  CheckCircle2,
  CircleHelp,
  MinusCircle,
  Target,
  XCircle,
} from "lucide-react";

interface ScoreSummaryProps {
  results: QuizResults;
}

interface PerformanceTier {
  headline: string;
  message: string;
  /** Tailwind text color class for the headline accent. */
  accentClass: string;
}

/** Map a percentage score to a tiered performance message. */
function getPerformanceTier(percentage: number): PerformanceTier {
  if (percentage === 100) {
    return {
      headline: "Flawless Victory",
      message:
        "A perfect run — every single answer landed. That is mastery of the material.",
      accentClass: "text-primary",
    };
  }
  if (percentage >= 80) {
    return {
      headline: "Outstanding",
      message:
        "Excellent command of the material. You are clearly operating at a high level.",
      accentClass: "text-primary",
    };
  }
  if (percentage >= 60) {
    return {
      headline: "Solid Effort",
      message:
        "A strong result. Review the misses below and you will be unstoppable next round.",
      accentClass: "text-accent",
    };
  }
  if (percentage >= 40) {
    return {
      headline: "Getting There",
      message:
        "You have the fundamentals. Focus on the review below to sharpen the gaps.",
      accentClass: "text-warning",
    };
  }
  return {
    headline: "Keep Building",
    message:
      "Every expert started here. Study the review below and take another run at it.",
    accentClass: "text-destructive",
  };
}

/**
 * Hero results card: greeting, completion line, score ring, stat tiles, and a
 * performance message tuned to the final percentage.
 */
export function ScoreSummary({ results }: ScoreSummaryProps) {
  const { playerName, total, correct, incorrect, percentage } = results;
  const unanswered = Math.max(total - correct - incorrect, 0);
  const tier = getPerformanceTier(percentage);

  const stats = [
    {
      key: "correct",
      label: "Correct",
      value: correct,
      icon: CheckCircle2,
      valueClass: "text-primary",
      iconClass: "text-primary",
    },
    {
      key: "incorrect",
      label: "Incorrect",
      value: incorrect,
      icon: XCircle,
      valueClass: "text-destructive",
      iconClass: "text-destructive",
    },
    {
      key: "unanswered",
      label: "Unanswered",
      value: unanswered,
      icon: MinusCircle,
      valueClass: "text-muted-foreground",
      iconClass: "text-muted-foreground",
    },
  ] as const;

  return (
    <section
      data-ocid="results.section"
      aria-labelledby="results-title"
      className="w-full animate-fade-in-up rounded-3xl border border-border bg-card/90 p-6 shadow-elevated backdrop-blur-sm md:p-10"
    >
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <Target className="h-3.5 w-3.5" aria-hidden="true" />
          Quiz Complete
        </span>

        <h1
          id="results-title"
          className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl"
        >
          Well Done, <span className="text-gradient-primary">{playerName}</span>
          ! 🎉
        </h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          You have completed the QuizNova Mock Test.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,15rem)_1fr] md:items-center md:gap-8">
        <div className="flex flex-col items-center">
          <div
            data-ocid="results.score_card"
            className="relative grid h-44 w-44 place-items-center rounded-full"
            style={{
              background: `conic-gradient(oklch(var(--primary)) ${percentage * 3.6}deg, oklch(var(--muted)) 0deg)`,
            }}
          >
            <div className="grid h-[8.5rem] w-[8.5rem] place-items-center rounded-full bg-card shadow-subtle">
              <div className="text-center">
                <span className="block font-display text-4xl font-bold tracking-tight text-foreground">
                  {percentage}%
                </span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Score
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 font-display text-2xl font-bold tracking-tight">
            {correct} <span className="text-muted-foreground">/ {total}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            questions answered correctly
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Accuracy</span>
              <span className="font-mono text-muted-foreground">
                {percentage}%
              </span>
            </div>
            <Progress
              value={percentage}
              data-ocid="results.progress"
              aria-label={`Accuracy ${percentage} percent`}
              className="h-2.5 bg-muted"
            />
          </div>

          <dl className="grid grid-cols-3 gap-3">
            {stats.map(
              ({ key, label, value, icon: Icon, valueClass, iconClass }) => (
                <div
                  key={key}
                  data-ocid={`results.stat.${key}`}
                  className="rounded-2xl border border-border bg-background/50 p-3 text-center transition-smooth hover:border-primary/40 md:p-4"
                >
                  <Icon
                    className={cn("mx-auto h-5 w-5", iconClass)}
                    aria-hidden="true"
                  />
                  <dd
                    className={cn(
                      "mt-2 font-display text-2xl font-bold",
                      valueClass,
                    )}
                  >
                    {value}
                  </dd>
                  <dt className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                </div>
              ),
            )}
          </dl>

          <div
            data-ocid="results.performance_message"
            className="rounded-2xl border border-border bg-gradient-surface p-4"
          >
            <p
              className={cn(
                "font-display text-lg font-bold tracking-tight",
                tier.accentClass,
              )}
            >
              {tier.headline}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {tier.message}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
