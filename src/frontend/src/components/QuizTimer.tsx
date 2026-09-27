import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Total quiz duration in seconds (10 minutes). */
export const QUIZ_DURATION_SECONDS = 600;

/** Format a whole number of seconds as `M:SS`. */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface QuizTimerProps {
  /** Called exactly once when the countdown reaches zero. */
  onExpire: () => void;
  /** When true the countdown is paused and no longer ticks. */
  paused?: boolean;
}

/**
 * A 10-minute countdown that starts on mount and calls `onExpire` once at 00:00.
 *
 * The interval is cleared on unmount and whenever `paused` flips to true, so the
 * timer stops ticking the moment the quiz is submitted.
 */
export function QuizTimer({ onExpire, paused = false }: QuizTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_DURATION_SECONDS);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (secondsLeft > 0 || expiredRef.current) return;
    expiredRef.current = true;
    onExpireRef.current();
  }, [secondsLeft]);

  const isCritical = secondsLeft <= 60;
  const progress = (secondsLeft / QUIZ_DURATION_SECONDS) * 100;

  return (
    <div
      data-ocid="quiz.timer"
      role="timer"
      aria-live="off"
      aria-label={`Time remaining ${formatTime(secondsLeft)}`}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition-smooth sm:px-4",
        isCritical
          ? "border-destructive/50 bg-destructive/10 text-destructive"
          : "border-border bg-card/80 text-foreground",
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
          isCritical ? "bg-destructive/15" : "bg-primary/15 text-primary",
        )}
      >
        <Clock
          className={cn("h-4.5 w-4.5", isCritical && "animate-pulse")}
          aria-hidden="true"
        />
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Time Left
        </p>
        <p
          className={cn(
            "font-mono text-xl font-bold leading-none tabular-nums sm:text-2xl",
            isCritical ? "text-destructive" : "text-foreground",
          )}
        >
          {formatTime(secondsLeft)}
        </p>
      </div>
      <div className="ml-1 hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-linear",
            isCritical ? "bg-destructive" : "bg-gradient-primary",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
